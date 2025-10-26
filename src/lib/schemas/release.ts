import * as v from 'valibot';

export const Release = v.strictObject({
	id: v.number(),
	tag: v.string(),
	author: v.string(),
	name: v.nullish(v.string()),
	draft: v.boolean(),
	prerelease: v.boolean(),
	createdAt: v.string(),
	publishedAt: v.string(),
	markdown: v.nullish(v.string()),
	html: v.string(),
	assets: v.array(
		v.strictObject({
			contentType: v.string(),
			size: v.number(),
			createdAt: v.string(),
			updatedAt: v.string(),
			downloadCount: v.number(),
			downloadUrl: v.string()
		})
	)
});

export type Release = v.InferOutput<typeof Release>;
