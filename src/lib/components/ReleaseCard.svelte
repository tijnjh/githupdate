<script lang="ts">
	import type { Release } from '$lib/schemas/release';
	import { formatDistance } from 'date-fns';
	import type { Repo } from '$lib/schemas/repo';
	import { marked } from 'marked';
	import { parseTag } from '$lib/utils';
	import { page } from '$app/state';
	import { AccordionItem, Badge, Button } from 'flowbite-svelte';
	import { GithubSolid, AngleRightOutline } from 'flowbite-svelte-icons';

	const { release, meta }: { release: Release; meta: Repo } = $props();

	const semver = $derived(parseTag(release.tag));

	const badgeVariant = $derived.by(() => {
		if (semver?.version.includes('-')) {
			return 'gray';
		} else {
			switch (semver?.releaseType) {
				case 'major':
					return 'primary';
				case 'minor':
					return 'secondary';
				case 'patch':
					return 'gray';
				default:
					return 'gray';
			}
		}
	});
</script>

<AccordionItem>
	{#snippet header()}
		<div class="flex flex-col items-start justify-start">
			<div class="flex items-center gap-2">
				{meta.owner}
				<AngleRightOutline size="sm" class="opacity-50" />
				{meta.name}
			</div>

			<div class="flex items-center gap-2">
				<Badge color={badgeVariant}>
					{semver?.version ?? release.tag}
				</Badge>

				{formatDistance(release.publishedAt, new Date(), { addSuffix: true })}
			</div>
		</div>
	{/snippet}
	<div class="mb-6 flex items-center gap-2">
		<Button
			href="https://github.com/{meta.owner}/{meta.name}/releases/tag/{release.tag}"
			target="_blank"
		>
			<GithubSolid />
		</Button>

		{#if page.route.id === '/'}
			<Button href="/{meta.owner}/{meta.name}">All releases</Button>
		{/if}
	</div>
	<div class="prose wrap-break-word dark:prose-invert">
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html release.markdown ? marked.parse(release.markdown) : release.html}
	</div>
</AccordionItem>
