<script lang="ts" generics="T">
	import { Alert, Spinner } from 'flowbite-svelte';
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
	<Alert>{query.error.message}</Alert>
{/if}

{#if query.loading}
	<Spinner />
{:else}
	{@render success(query.current!)}
{/if}
