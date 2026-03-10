<script lang="ts">
  import { onMount, tick } from "svelte";
  import favicon from "$lib/assets/favicon.svg";
  import "$lib/app/styles/global.css";
  import { AppShell } from "$lib/app";
  import { Header, Footer } from "$lib/widgets";
  import { ThemeToggle } from "$lib/features/theme-toggle";
  import { initTheme } from "$lib/shared/lib/theme";

  let { children } = $props();
  let loaded = $state(false);

  onMount(async () => {
    // initTheme();
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
      <Header />
    {/snippet}

    {#snippet headerEnd()}
      <ThemeToggle />
    {/snippet}

    {#snippet footer()}
      <Footer />
    {/snippet}

    {@render children()}
  </AppShell>
</div>
