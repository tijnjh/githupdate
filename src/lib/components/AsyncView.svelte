<script lang="ts" generics="T">
	import * as Alert from '$lib/components/ui/alert/index.js';
	import { Spinner } from '$lib/components/ui/spinner/index.js';
	import { CircleAlertIcon } from 'lucide-svelte';
	import type { Snippet } from 'svelte';

	const {
		query,
		success
	}: {
		query: {
			loading: boolean;
			error?: Error;
			current?: T;
		};
		success: Snippet<[T]>;
	} = $props();
</script>

{#if query.error}
	<Alert.Root variant="destructive">
		<CircleAlertIcon />
		<Alert.Title>Error</Alert.Title>
		<Alert.Description>{query.error.message}</Alert.Description>
	</Alert.Root>
{/if}

{#if query.loading}
	<Spinner class="mx-auto size-8" />
{:else}
	{@render success(query.current!)}
{/if}
