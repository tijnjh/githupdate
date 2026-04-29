<script lang="ts">
	import { upfetch } from '$lib/utils';
	import {
		Input,
		Sidebar,
		SidebarGroup,
		SidebarItem,
		Spinner,
		type SidebarProps
	} from 'flowbite-svelte';
	import { useDebounce } from 'runed';
	import { starredRepos, user as currentUser } from '$lib/global.svelte';
	import * as v from 'valibot';
	import { resolve } from '$app/paths';
	import { HomeSolid } from 'flowbite-svelte-icons';
	import { page } from '$app/state';

	const props: Omit<SidebarProps, 'children'> = $props();

	let isLoading = $state(false);
	const activeUrl = $derived(page.url.pathname);

	let user = $state(currentUser.current);

	let fetchingPageNr = $state<number>();

	const updateStarredRepos = useDebounce(async (user?: string) => {
		currentUser.current = user;

		const allRepos: { name: string; owner: string }[] = [];
		fetchingPageNr = 1;
		const perPage = 100;

		while (true) {
			const repos = await upfetch(`https://api.github.com/users/${user}/starred`, {
				params: { per_page: perPage, page: fetchingPageNr },
				schema: v.array(
					v.object({
						name: v.string(),
						owner: v.object({ login: v.string() })
					})
				)
			});

			isLoading = true;

			allRepos.push(
				...repos.map((repo) => ({
					name: repo.name,
					owner: repo.owner.login
				}))
			);

			if (repos.length < perPage) break;

			fetchingPageNr++;
		}

		starredRepos.current = allRepos;
		isLoading = false;
	}, 1000);

	let searchQuery = $state<string>();

	const filteredRepos = $derived.by(() => {
		if (!searchQuery) return starredRepos.current;

		return starredRepos.current.filter((repo) =>
			`${repo.owner}/${repo.name}`.toLowerCase().includes(searchQuery!.toLowerCase())
		);
	});
</script>

<Sidebar
	{...props}
	{activeUrl}
	backdrop={false}
	position="absolute"
	classes={{
		nonactive: 'p-2',
		active: 'p-2',
		content: 'max-h-dvh overflow-y-auto'
	}}
>
	<SidebarGroup class="mb-4">
		<SidebarItem label="Home" href="/">
			{#snippet icon()}
				<HomeSolid
					class="h-5 w-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
				/>
			{/snippet}
		</SidebarItem>
	</SidebarGroup>
	<Input
		bind:value={user}
		oninput={() => updateStarredRepos(user)}
		placeholder="Enter your github handle"
		class="mb-2"
	/>
	<Input
		bind:value={searchQuery}
		oninput={() => updateStarredRepos(user)}
		placeholder="Filter starred repos"
		class="mb-2"
	/>
	<SidebarGroup class="overflow-y-auto">
		{#if isLoading}
			<Spinner class="mx-auto my-4" />
			{fetchingPageNr ? fetchingPageNr * 100 : 0}
		{:else}
			{#each filteredRepos as { owner, name } (`${owner}/${name}`)}
				<SidebarItem
					label={`${owner}/${name}`}
					href={resolve('/[owner]/[name]', { owner, name })}
				/>
			{/each}
		{/if}
	</SidebarGroup>
</Sidebar>
