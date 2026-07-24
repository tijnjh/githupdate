import { Text, Title1 } from '@fluentui/react-components'
import { ArrowLeft20Regular } from '@fluentui/react-icons'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { ReleaseCard } from '../components/ReleaseCard'
import { RouteError, RoutePending } from '../components/States'
import { releasesQuery } from '../lib/queries'

export const Route = createFileRoute('/$owner/$name')({
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(releasesQuery(params.owner, params.name)),
  pendingComponent: RoutePending,
  errorComponent: RouteError,
  component: RepositoryRoute,
})

function RepositoryRoute() {
  const { owner, name } = Route.useParams()
  const { data: releases } = useSuspenseQuery(releasesQuery(owner, name))

  return (
    <div className="page-stack">
      <Link to="/" className="back-link">
        <ArrowLeft20Regular />
        Releases
      </Link>

      <section className="repository-intro">
        <Title1 as="h1">
          {owner}
          /
          {name}
        </Title1>
      </section>

      {releases.length > 0
        ? (
            <div className="release-grid">
              {releases.map(release => (
                <ReleaseCard key={release.id} release={release} meta={{ owner, name }} />
              ))}
            </div>
          )
        : (
            <section className="inline-empty">
              <Text size={500} weight="semibold">
                No releases
              </Text>
            </section>
          )}
    </div>
  )
}
