import { createFileRoute } from '@tanstack/react-router'
import { RepositoryReleases } from '../components/RepositoryReleases'
import { RouteError } from '../components/States'
import { parseRepositories } from '../lib/repositories'

export const Route = createFileRoute('/$owner/$name')({
  loader: ({ params }) => parseRepositories(`${params.owner}/${params.name}`),
  errorComponent: RouteError,
  component: RepositoryRoute,
})

function RepositoryRoute() {
  const repositories = Route.useLoaderData()
  return <RepositoryReleases repositories={repositories} />
}
