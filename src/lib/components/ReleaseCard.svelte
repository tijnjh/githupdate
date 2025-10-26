<script lang="ts">
	import type { Release } from '$lib/schemas/release';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import * as Accordion from '$lib/components/ui/accordion/index.js';
	import { formatDistance } from 'date-fns';
	import type { Repo } from '$lib/schemas/repo';
	import { marked } from 'marked';
	import * as Avatar from './ui/avatar/index.js';

	const { release, meta }: { release: Release; meta: Repo } = $props();

	console.log(release);

	const id = $props.id();
</script>

<Accordion.Item value={id}>
	<Accordion.Trigger>
		<div class="flex w-full items-center justify-between">
			<div class="flex items-center gap-2">
				<Avatar.Root>
					<Avatar.Image src={`https://github.com/${meta.owner}.png`} alt="@{meta.owner}" />
					<Avatar.Fallback>{meta.owner[0].toUpperCase()}</Avatar.Fallback>
				</Avatar.Root>

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
				{(() => {
					try {
						return formatDistance(release.publishedAt, new Date(), { addSuffix: true });
					} catch {
						return release.publishedAt;
					}
				})()}
			</div>
		</div>
	</Accordion.Trigger>
	<Accordion.Content class="prose dark:prose-invert">
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html release.markdown ? marked.parse(release.markdown) : release.html}
	</Accordion.Content>
</Accordion.Item>
