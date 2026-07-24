import type { Repo } from '../types'
import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

export type ColorScheme = 'light' | 'dark'

const preferredColorScheme: ColorScheme
  = typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'

export const userAtom = atomWithStorage('user', '')
export const starredReposAtom = atomWithStorage<Repo[]>('starredRepos', [])
export const colorSchemeAtom = atomWithStorage<ColorScheme>(
  'githupdates-color-scheme',
  preferredColorScheme,
)
export const sidebarOpenAtom = atom(false)
