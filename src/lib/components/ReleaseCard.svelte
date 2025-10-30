<script lang="ts">
	import type { Release } from '$lib/schemas/release';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import * as Accordion from '$lib/components/ui/accordion/index.js';
	import { formatDistance } from 'date-fns';
	import type { Repo } from '$lib/schemas/repo';
	import { marked } from 'marked';
	import { parseTag } from '$lib/utils';
	import { ChevronRightIcon, GithubIcon } from 'lucide-svelte';
	import Button from './ui/button/button.svelte';

	const { release, meta }: { release: Release; meta: Repo } = $props();

	const id = $props.id();

	const semver = $derived(parseTag(release.tag));

	const badgeVariant = $derived.by(() => {
		if (semver?.version.includes('-')) {
			return 'outline';
		} else {
			switch (semver?.releaseType) {
				case 'major':
					return 'default';
				case 'minor':
					return 'secondary';
				case 'patch':
					return 'outline';
				default:
					return 'outline';
			}
		}
	});
</script>

<Accordion.Item value={id}>
	<Accordion.Trigger>
		<div class="flex w-full items-center justify-between">
			<div class="flex items-center gap-2">
				{meta.owner}
				<ChevronRightIcon class="size-3 opacity-50" />
				{meta.name}

				<Badge variant={badgeVariant}>
					{semver?.version ?? release.tag}
				</Badge>

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
	<Accordion.Content>
		<div class="prose mb-6 dark:prose-invert">
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			{@html release.markdown ? marked.parse(release.markdown) : release.html}
		</div>
		<div class="flex items-center gap-2">
			<Button
				href="https://github.com/{meta.owner}/{meta.name}/releases/tag/{release.tag}"
				target="_blank"
				size="icon"
			>
				<GithubIcon />
			</Button>

			<Button href="/{meta.owner}/{meta.name}" variant="secondary">All releases</Button>
		</div>
	</Accordion.Content>
</Accordion.Item>
