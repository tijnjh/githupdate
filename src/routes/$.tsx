import { createFileRoute } from '@tanstack/react-router'
import { RepositoryReleases } from '../components/RepositoryReleases'
import { RouteError } from '../components/States'
import { parseRepositories } from '../lib/repositories'

export const Route = createFileRoute('/$')({
  loader: ({ params }) => parseRepositories(params._splat ?? ''),
  errorComponent: RouteError,
  component: RepositoriesRoute,
})

function RepositoriesRoute() {
  const repositories = Route.useLoaderData()
  return <RepositoryReleases repositories={repositories} />
}
