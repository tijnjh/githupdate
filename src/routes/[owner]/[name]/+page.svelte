<script lang="ts">
	import { page } from '$app/state';
	import * as v from 'valibot';
	import { Release } from '$lib/schemas/release';
	import { ungh } from '$lib/utils';
	import { resource } from 'runed';
	import ReleaseCard from '$lib/components/ReleaseCard.svelte';
	import AsyncView from '$lib/components/AsyncView.svelte';

	const query = resource(
		() => page.params,
		() =>
			ungh(`/repos/${page.params.owner}/${page.params.name}/releases`, {
				schema: v.object({
					releases: v.array(Release)
				})
			}).then((r) => r.releases) as Promise<Release[]>
	);
</script>

<AsyncView {query}>
	{#snippet success(releases)}
		{#each releases as release (release.id)}
			<ReleaseCard
				{release}
				meta={{
					name: page.params.name!,
					owner: page.params.owner!
				}}
			/>
		{/each}
	{/snippet}
</AsyncView>
