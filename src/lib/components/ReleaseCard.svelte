<script lang="ts">
	import type { Release } from '$lib/schemas/release';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import * as Accordion from '$lib/components/ui/accordion/index.js';
	import { formatDistance } from 'date-fns';
	import type { Repo } from '$lib/schemas/repo';
	import { marked } from 'marked';

	const { release, meta }: { release: Release; meta: Repo } = $props();

	const id = $props.id();
</script>

<Accordion.Item value={id}>
	<Accordion.Trigger>
		<div class="flex w-full items-center justify-between">
			<div class="flex items-center gap-2">
				{meta.owner}/{meta.name}

				{release.tag}

				{#if release.prerelease}
					<Badge>Pre-release</Badge>
				{/if}

				{#if release.draft}
					<Badge>Draft</Badge>
				{/if}
			</div>

			<div class="ml-auto">
				{formatDistance(release.publishedAt, new Date(), { addSuffix: true })}
			</div>
		</div>
	</Accordion.Trigger>
	<Accordion.Content class="prose dark:prose-invert">
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html release.markdown ? marked.parse(release.markdown) : release.html}
	</Accordion.Content>
</Accordion.Item>
