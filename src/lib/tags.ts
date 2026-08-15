export type ReleaseType = 'major' | 'minor' | 'patch'

export interface ParsedTag {
  version: string
  releaseType: ReleaseType
}

export function parseTag(tag: string): ParsedTag | undefined {
  if (!tag) {
    return
  }

  const cleaned = tag.replace(/^\D*/, '')
  const match = cleaned.match(/^(\d+)(?:\.(\d+))?(?:\.(\d+))?([-+].*)?$/)

  if (!match) {
    return
  }

  const major = Number.parseInt(match[1], 10)
  const minor = Number.parseInt(match[2] ?? '0', 10)
  const patch = Number.parseInt(match[3] ?? '0', 10)
  const meta = match[4] ?? ''
  const version = `${major}.${minor}.${patch}${meta}`

  let releaseType: ReleaseType
  if (minor === 0 && patch === 0) {
    releaseType = 'major'
  }
  else if (patch === 0) {
    releaseType = 'minor'
  }
  else {
    releaseType = 'patch'
  }

  return { version, releaseType }
}
