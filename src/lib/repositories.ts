import type { Repo } from '../types'

/** Full names set the owner for any following comma-separated shorthand names. */
export function parseRepositories(path: string): Repo[] {
  let owner = ''
  const repositories: Repo[] = []
  const seen = new Set<string>()

  for (const entry of path.replace(/^\//, '').replace(/\/$/, '').split(',')) {
    const parts = entry.split('/')
    if (parts.length === 2) {
      owner = parts[0]
    }
    const name = parts.at(-1) ?? ''
    if (parts.length > 2 || !/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i.test(owner)
      || !/^[\w.-]+$/.test(name) || name === '.' || name === '..') {
      throw new Error('Use owner/repository followed by comma-separated repositories. Bare repository names reuse the previous owner.')
    }

    const key = `${owner}/${name}`.toLowerCase()
    if (!seen.has(key)) {
      seen.add(key)
      repositories.push({ owner, name })
    }
  }

  return repositories
}
