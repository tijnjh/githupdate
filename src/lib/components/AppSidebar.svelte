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

	const updateStarredRepos = useDebounce(async (user?: string) => {
		currentUser.current = user;

		const allRepos: { name: string; owner: string }[] = [];
		let page = 1;
		const perPage = 100;

		while (true) {
			const repos = await upfetch(`https://api.github.com/users/${user}/starred`, {
				params: { per_page: perPage, page },
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

			page++;
		}

		starredRepos.current = allRepos;
		isLoading = false;
	}, 1000);
</script>

<Sidebar
	{...props}
	{activeUrl}
	backdrop={false}
	params={{ x: -50, duration: 50 }}
	class="z-50 flex flex-col gap-4"
	position="absolute"
	classes={{
		nonactive: 'p-2',
		active: 'p-2'
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
	/>
	<SidebarGroup class="overflow-y-scroll">
		{#if isLoading}
			<Spinner class="mx-auto my-4" />
		{:else}
			{#each starredRepos.current as { owner, name } (`${owner}/${name}`)}
				<SidebarItem
					label={`${owner}/${name}`}
					href={resolve('/[owner]/[name]', { owner, name })}
				/>
			{/each}
		{/if}
	</SidebarGroup>
</Sidebar>
