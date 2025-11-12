<script lang="ts">
	import { ModeWatcher, toggleMode, mode } from 'mode-watcher';
	import '../app.css';
	import { Button, SidebarButton, uiHelpers } from 'flowbite-svelte';
	import { MoonSolid, SunSolid } from 'flowbite-svelte-icons';
	import AppSidebar from '$lib/components/AppSidebar.svelte';

	let { children } = $props();

	const Icon = $derived(mode.current === 'dark' ? SunSolid : MoonSolid);

	const sidebarUi = uiHelpers();

	let isOpen = $derived(sidebarUi.isOpen);

	const closeSidebar = sidebarUi.close;
</script>

<ModeWatcher />

<div class="relative">
	<AppSidebar {closeSidebar} {isOpen} />

	<div class="flex flex-col gap-4 overflow-y-scroll p-4 md:ml-64">
		<div class="items center flex">
			<SidebarButton onclick={sidebarUi.toggle} class="mb-2" />
			<Button onclick={toggleMode} class="mb-2 ml-auto">
				<Icon />
				<span class="sr-only">Toggle theme</span>
			</Button>
		</div>
		{@render children?.()}
	</div>
</div>
