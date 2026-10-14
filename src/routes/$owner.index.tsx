import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { RepositoryReleases } from '../components/RepositoryReleases'
import { RouteError, RoutePending } from '../components/States'
import { ownerReposQuery } from '../lib/queries'

export const Route = createFileRoute('/$owner/')({
  loader: ({ context, params }) => context.queryClient.ensureQueryData(ownerReposQuery(params.owner)),
  pendingComponent: RoutePending,
  errorComponent: RouteError,
  component: OwnerRoute,
})

function OwnerRoute() {
  const { owner } = Route.useParams()
  const { data: repositories } = useSuspenseQuery(ownerReposQuery(owner))
  return <RepositoryReleases key={owner} repositories={repositories} latestOnly />
}
