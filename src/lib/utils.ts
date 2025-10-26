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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChild<T> = T extends { child?: any } ? Omit<T, 'child'> : T;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChildren<T> = T extends { children?: any } ? Omit<T, 'children'> : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null };
