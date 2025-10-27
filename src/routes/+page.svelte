<script lang="ts">
	import ReleaseCard from '$lib/components/ReleaseCard.svelte';
	import { Release } from '$lib/schemas/release';
	import { ungh } from '$lib/utils';
	import type { Repo } from '$lib/schemas/repo';
	import { starredRepos } from '$lib/global.svelte';
	import { slide } from 'svelte/transition';

	type ReleaseWithMeta = Release & { meta: Repo };

	let releases: ReleaseWithMeta[] = $state([]);

	const promises: Promise<ReleaseWithMeta>[] = [];

	for (const repo of starredRepos.current) {
		promises.push(
			ungh<{ release: Release }>(`/repos/${repo.owner}/${repo.name}/releases/latest`, {
				reject: () => false,
				onError: () => {},
				retry: { attempts: 5 }
			})
				.then((r) => r.release)
				.then((r) => ({ ...r, meta: repo }))
				.then((release) => {
					releases.push(release);
					return release;
				})
		);
	}

	Promise.allSettled(promises);

	const sortedReleases = $derived(
		releases.toSorted((a, b) => {
			const dateA = new Date(a.publishedAt);
			const dateB = new Date(b.publishedAt);
			return dateB.getTime() - dateA.getTime();
		})
	);
</script>

{#if starredRepos.current.length !== sortedReleases.length}
	<progress
		transition:slide
		class="relative my-8 h-2 w-full overflow-hidden rounded-full bg-primary/20"
		max={starredRepos.current.length}
		value={sortedReleases.length}
	></progress>
{/if}

{#each sortedReleases as { meta, ...release } (meta.owner + meta.name)}
	{#if release.id}
		<ReleaseCard release={$state.snapshot(release)} {meta} />
	{/if}
{/each}
