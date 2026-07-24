import { Button, ProgressBar, Text, Tooltip } from '@fluentui/react-components'
import { ArrowClockwise20Regular, Star24Regular } from '@fluentui/react-icons'
import { useQueries, useQueryClient } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { useAtomValue } from 'jotai'
import { useMemo } from 'react'
import { ReleaseCard } from '../components/ReleaseCard'
import { ErrorState } from '../components/States'
import { latestReleaseQuery } from '../lib/queries'
import { starredReposAtom } from '../state/atoms'

export const Route = createFileRoute('/')({
  component: HomeRoute,
})

function HomeRoute() {
  const repositories = useAtomValue(starredReposAtom)
  const queryClient = useQueryClient()
  const releaseQueries = useQueries({
    queries: repositories.map(repository => latestReleaseQuery(repository)),
  })

  const releases = useMemo(
    () =>
      releaseQueries
        .map((query, index) => {
          const release = query.data
          return release ? { release, meta: repositories[index] } : null
        })
        .filter(item => item !== null)
        .sort(
          (a, b) =>
            new Date(b.release.publishedAt).getTime() - new Date(a.release.publishedAt).getTime(),
        ),
    [releaseQueries, repositories],
  )

  const completedCount = releaseQueries.filter(query => !query.isPending).length
  const failedQuery = releaseQueries.find(query => query.isError)
  const isLoading = repositories.length > 0 && completedCount < repositories.length

  if (repositories.length === 0) {
    return (
      <section className="empty-state">
        <div className="empty-illustration" aria-hidden="true">
          <Star24Regular />
        </div>
        <Text size={500} weight="semibold">
          Enter a GitHub username
        </Text>
      </section>
    )
  }

  return (
    <div className="page-stack">
      <div className="page-actions">
        <Tooltip content="Refresh" relationship="label">
          <Button
            appearance="subtle"
            icon={<ArrowClockwise20Regular />}
            onClick={() => void queryClient.invalidateQueries({ queryKey: ['release', 'latest'] })}
            aria-label="Refresh releases"
          />
        </Tooltip>
      </div>

      {isLoading
        ? (
            <div className="feed-progress" role="status" aria-label="Loading releases">
              <ProgressBar value={completedCount / repositories.length} />
            </div>
          )
        : null}

      {failedQuery ? <ErrorState error={failedQuery.error} /> : null}

      <div className="release-grid">
        {releases.map(({ release, meta }) => (
          <ReleaseCard
            key={`${meta.owner}/${meta.name}/${release.id}`}
            release={release}
            meta={meta}
            showAllReleasesLink
          />
        ))}
      </div>

      {!isLoading && releases.length === 0
        ? (
            <section className="inline-empty">
              <Text size={500} weight="semibold">
                No releases
              </Text>
            </section>
          )
        : null}
    </div>
  )
}
