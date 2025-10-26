import * as v from 'valibot';

export const Repo = v.object({
	name: v.string(),
	owner: v.string()
});

export type Repo = v.InferOutput<typeof Repo>;
