<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import AppSidebar from '$lib/components/AppSidebar.svelte';
	import { ModeWatcher, toggleMode } from 'mode-watcher';
	import '../app.css';
	import * as Accordion from '$lib/components/ui/accordion/index.js';
	import Button from '$lib/components/ui/button/button.svelte';
	import { MoonIcon, SunIcon } from 'lucide-svelte';

	let { children } = $props();
</script>

<ModeWatcher />

<Sidebar.Provider>
	<AppSidebar />
	<main class="mx-auto flex w-4xl flex-col gap-4 p-4">
		<div class="flex justify-between">
			<Sidebar.Trigger />

			<Button onclick={toggleMode} variant="outline" size="icon">
				<SunIcon
					class="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all! dark:scale-0 dark:-rotate-90"
				/>
				<MoonIcon
					class="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all! dark:scale-100 dark:rotate-0"
				/>
				<span class="sr-only">Toggle theme</span>
			</Button>
		</div>
		<Accordion.Root type="single">
			{@render children?.()}
		</Accordion.Root>
	</main>
</Sidebar.Provider>
