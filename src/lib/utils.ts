import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { isValidationError, up } from 'up-fetch';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const upfetch = up(fetch);

export const ungh = up(fetch, () => ({
	baseUrl: 'https://ungh.cc',
	onError: (error) => {
		if (isValidationError(error)) {
			for (const issue of error.issues) {
				console.error(issue);
			}
		}
		return;
	}
}));

export function parseTag(tag: string) {
	if (!tag) return;

	const cleaned = tag.replace(/^[^\d]*/, '');

	const match = cleaned.match(/^(\d+)(?:\.(\d+))?(?:\.(\d+))?([-+].*)?$/);
	if (!match) return;

	const major = parseInt(match[1]);
	const minor = parseInt(match[2] ?? '0');
	const patch = parseInt(match[3] ?? '0');
	const meta = match[4] ?? '';

	const version = `${major}.${minor}.${patch}${meta}`;

	let releaseType: 'major' | 'minor' | 'patch';
	if (minor === 0 && patch === 0) releaseType = 'major';
	else if (patch === 0) releaseType = 'minor';
	else releaseType = 'patch';

	return { version, releaseType };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChild<T> = T extends { child?: any } ? Omit<T, 'child'> : T;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChildren<T> = T extends { children?: any } ? Omit<T, 'children'> : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null };
