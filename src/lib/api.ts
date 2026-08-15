import type { Release, Repo } from '../types'
import * as v from 'valibot'
import { ReleaseSchema } from '../types'

const githubRepoSchema = v.object({
  name: v.string(),
  owner: v.object({
    login: v.string(),
  }),
})

const githubReposSchema = v.array(githubRepoSchema)
const latestReleaseSchema = v.object({ release: ReleaseSchema })
const releasesSchema = v.object({ releases: v.array(ReleaseSchema) })

export class ApiError extends Error {
  readonly status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

async function requestJson<TSchema extends v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>>(
  url: string,
  schema: TSchema,
  signal?: AbortSignal,
): Promise<v.InferOutput<TSchema>> {
  const response = await fetch(url, {
    signal,
    headers: {
      Accept: 'application/json',
    },
  })

  if (!response.ok) {
    let detail = ''

    try {
      const payload = (await response.json()) as { message?: string }
      detail = payload.message ? `: ${payload.message}` : ''
    }
    catch {
      // The response body is optional for errors.
    }

    throw new ApiError(`Request failed (${response.status})${detail}`, response.status)
  }

  return v.parse(schema, await response.json())
}

interface StarredRepoOptions {
  signal?: AbortSignal
  onPage?: (page: number, repositoryCount: number) => void
}

export async function fetchStarredRepos(
  username: string,
  { signal, onPage }: StarredRepoOptions = {},
): Promise<Repo[]> {
  const repositories: Repo[] = []
  const perPage = 100
  let page = 1

  while (true) {
    const url = new URL(`https://api.github.com/users/${encodeURIComponent(username)}/starred`)
    url.searchParams.set('per_page', String(perPage))
    url.searchParams.set('page', String(page))

    const result = await requestJson(url.toString(), githubReposSchema, signal)

    repositories.push(
      ...result.map(repo => ({
        name: repo.name,
        owner: repo.owner.login,
      })),
    )
    onPage?.(page, repositories.length)

    if (result.length < perPage) {
      break
    }
    page += 1
  }

  return repositories
}

function unghUrl(owner: string, name: string, suffix: string): string {
  return `https://ungh.cc/repos/${encodeURIComponent(owner)}/${encodeURIComponent(name)}/${suffix}`
}

export async function fetchLatestRelease(
  repo: Repo,
  signal?: AbortSignal,
): Promise<Release | null> {
  try {
    const result = await requestJson(
      unghUrl(repo.owner, repo.name, 'releases/latest'),
      latestReleaseSchema,
      signal,
    )
    return result.release
  }
  catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null
    }
    throw error
  }
}

export async function fetchReleases(
  owner: string,
  name: string,
  signal?: AbortSignal,
): Promise<Release[]> {
  const result = await requestJson(unghUrl(owner, name, 'releases'), releasesSchema, signal)
  return result.releases
}
