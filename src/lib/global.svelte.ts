import { PersistedState } from 'runed';
import type { Repo } from './schemas/repo';

export const user = new PersistedState<string | undefined>('user', undefined);
export const starredRepos = new PersistedState<Repo[]>('starredRepos', []);
