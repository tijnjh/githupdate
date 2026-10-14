import type { Release, Repo } from '../types'
import { Button, ProgressBar, Text } from '@fluentui/react-components'
import { ArrowLeft20Regular } from '@fluentui/react-icons'
import { useQueries } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { latestReleaseQuery, releasesQuery } from '../lib/queries'
import { ReleaseCard } from './ReleaseCard'
import { ErrorState } from './States'

export function RepositoryReleases({ repositories, latestOnly = false }: { repositories: Repo[], latestOnly?: boolean }) {
  const navigate = useNavigate()
  const [limit, setLimit] = useState(10)
  const visibleRepositories = latestOnly ? repositories.slice(0, limit) : repositories
  const queries = useQueries({
    queries: visibleRepositories.map(repo => latestOnly
      ? { ...latestReleaseQuery(repo), select: (release: Release | null) => release ? [release] : [] }
      : releasesQuery(repo.owner, repo.name)),
  })
  const batchComplete = queries.every(query => !query.isPending)
  useEffect(() => {
    if (latestOnly && batchComplete && limit < repositories.length) {
      const timeout = setTimeout(() => setLimit(current => current + 10), 0)
      return () => clearTimeout(timeout)
    }
  }, [latestOnly, batchComplete, limit, repositories.length])
  const completedCount = queries.filter(query => !query.isPending).length
  const isLoading = completedCount < repositories.length
  const releases = queries
    .flatMap((query, index) => (query.data ?? []).map(release => ({
      release,
      meta: repositories[index],
    })))
    .sort((a, b) => Date.parse(b.release.publishedAt) - Date.parse(a.release.publishedAt))

  return (
    <div className="page-stack">
      <div>
        <Button
          appearance="subtle"
          icon={<ArrowLeft20Regular />}
          onClick={() => void navigate({ to: '/' })}
        >
          Latest releases
        </Button>
      </div>

      {isLoading
        ? (
            <div className="feed-progress" role="status" aria-label="Loading releases">
              <ProgressBar value={completedCount / repositories.length} />
            </div>
          )
        : null}

      {queries.map((query, index) => {
        const repo = repositories[index]
        return query.isError
          ? (
              <div key={`${repo.owner}/${repo.name}`}>
                <Text weight="semibold">{`${repo.owner}/${repo.name}`}</Text>
                <ErrorState error={query.error} />
              </div>
            )
          : null
      })}

      <div className="release-grid">
        {releases.map(({ release, meta }) => (
          <ReleaseCard
            key={`${meta.owner}/${meta.name}/${release.id}`}
            release={release}
            meta={meta}
            showAllReleasesLink={latestOnly}
          />
        ))}
      </div>

      {!isLoading && releases.length === 0 && !queries.some(query => query.isError)
        ? (
            <section className="inline-empty">
              <Text size={500} weight="semibold">No releases</Text>
            </section>
          )
        : null}
    </div>
  )
}
