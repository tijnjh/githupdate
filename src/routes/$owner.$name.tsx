import { Button, Text } from '@fluentui/react-components'
import { ArrowLeft20Regular } from '@fluentui/react-icons'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
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
  const navigate = useNavigate()

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
