<script lang="ts">
  import { onMount, tick } from "svelte";
  import favicon from "$lib/assets/favicon.svg";
  import "$lib/app/styles/global.css";
  import { AppShell } from "$lib/app";
  import { ThemeToggle } from "$lib/features/theme-toggle";
  import { initTheme } from "$lib/shared/lib/theme";
  import { LampDesk } from "@lucide/svelte";

  let { children } = $props();
  let loaded = $state(false);

  onMount(async () => {
    initTheme();
    await tick();
    loaded = true;
  });
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<div style:visibility={loaded ? "visible" : "hidden"}>
  <AppShell>
    {#snippet headerStart()}
      <h1 class="flex gap-2 items-center ui-label m-0 uppercase font-bold">
        AI <LampDesk class="w-5 h-5 text-brand-active" /> Workspace
      </h1>
    {/snippet}

    {#snippet headerEnd()}
      <ThemeToggle />
    {/snippet}

    {@render children()}
  </AppShell>
</div>
