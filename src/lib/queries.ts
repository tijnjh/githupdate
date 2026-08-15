import type { Repo } from '../types'
import { queryOptions } from '@tanstack/react-query'
import { fetchLatestRelease, fetchReleases, fetchStarredRepos } from './api'

export const queryKeys = {
  releases: (owner: string, name: string) => ['releases', owner, name] as const,
  latestRelease: (repo: Repo) => ['release', 'latest', repo.owner, repo.name] as const,
  starredRepos: (username: string) => ['starred-repositories', username] as const,
}

export function latestReleaseQuery(repo: Repo) {
  return queryOptions({
    queryKey: queryKeys.latestRelease(repo),
    queryFn: ({ signal }) => fetchLatestRelease(repo, signal),
    retry: 5,
  })
}

export function releasesQuery(owner: string, name: string) {
  return queryOptions({
    queryKey: queryKeys.releases(owner, name),
    queryFn: ({ signal }) => fetchReleases(owner, name, signal),
  })
}

export function starredReposQuery(username: string) {
  return queryOptions({
    queryKey: queryKeys.starredRepos(username),
    queryFn: ({ signal }) => fetchStarredRepos(username, { signal }),
    staleTime: Infinity,
    gcTime: Infinity,
    retry: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  })
}
