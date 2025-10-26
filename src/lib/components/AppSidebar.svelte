<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { resolve } from '$app/paths';
	import Input from './ui/input/input.svelte';
	import { starredRepos, user as currentUser } from '$lib/global.svelte';
	import { useDebounce } from 'runed';
	import * as v from 'valibot';
	import { upfetch } from '$lib/utils';
	import * as Avatar from '$lib/components/ui/avatar/index.js';

	const updateStarredRepos = useDebounce(async (user: string) => {
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
	}, 1000);
</script>

<Sidebar.Root>
	<Sidebar.Content>
		<Sidebar.Header>
			<Input
				oninput={(e) => updateStarredRepos(e.currentTarget?.value)}
				placeholder="Enter your github username"
				value={currentUser.current}
			/>
		</Sidebar.Header>
		<Sidebar.Group>
			<Sidebar.GroupContent>
				<Sidebar.Menu>
					<Sidebar.MenuButton>
						{#snippet child({ props })}
							<a href={resolve('/')} {...props}>Timeline</a>
						{/snippet}
					</Sidebar.MenuButton>
				</Sidebar.Menu>
			</Sidebar.GroupContent>
		</Sidebar.Group>

		<Sidebar.Group>
			<Sidebar.GroupLabel>Following ({starredRepos.current.length})</Sidebar.GroupLabel>
			<Sidebar.GroupContent>
				<Sidebar.Menu>
					{#each starredRepos.current as { owner, name } (`${owner}/${name}`)}
						<Sidebar.MenuItem>
							<Sidebar.MenuButton>
								{#snippet child({ props })}
									<a href={resolve('/[owner]/[name]', { owner, name })} {...props}>
										<Avatar.Root>
											<Avatar.Image src={`https://github.com/${owner}.png`} alt="@{owner}" />
											<Avatar.Fallback>{owner[0].toUpperCase()}</Avatar.Fallback>
										</Avatar.Root>
										<span>{owner}/{name}</span>
									</a>
								{/snippet}
							</Sidebar.MenuButton>
						</Sidebar.MenuItem>
					{/each}
				</Sidebar.Menu>
			</Sidebar.GroupContent>
		</Sidebar.Group>
	</Sidebar.Content>
</Sidebar.Root>
