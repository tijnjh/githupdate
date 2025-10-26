<script lang="ts">
	import ReleaseCard from '$lib/components/ReleaseCard.svelte';
	import { Release } from '$lib/schemas/release';
	import { ungh } from '$lib/utils';
	import { getUnixTime } from 'date-fns';
	import { resource } from 'runed';
	import AsyncView from '$lib/components/AsyncView.svelte';
	import type { Repo } from '$lib/schemas/repo';
	import { starredRepos } from '$lib/global.svelte';

	const promises: Promise<Release & { meta: Repo }>[] = [];

	for (const repo of starredRepos.current) {
		promises.push(
			ungh<{ release: Release }>(`/repos/${repo.owner}/${repo.name}/releases/latest`, {
				reject: () => false,
				onError: () => {}
			})
				.then((r) => r.release)
				.then((r) => ({ ...r, meta: repo }))
		);
	}

	const query = resource(
		() => starredRepos.current,
		async () => {
			try {
				const results = await Promise.allSettled(promises);

				const fulfilled = results
					.filter(
						(r): r is PromiseFulfilledResult<Release & { meta: Repo }> => r.status === 'fulfilled'
					)
					.map((r) => r.value)
					.flat();

				return fulfilled.sort((a, b) => getUnixTime(b.createdAt) - getUnixTime(a.createdAt));
			} catch (error) {
				console.error('Unexpected error in query:', error);
				return [];
			}
		}
	);
</script>

<AsyncView {query}>
	{#snippet success(releases)}
		{#each releases as { meta, ...release } (release.id ?? Math.random())}
			{#if release.id}
				<ReleaseCard release={$state.snapshot(release)} {meta} />
			{/if}
		{/each}
	{/snippet}
</AsyncView>
