<script lang="ts">
  import { onMount, tick } from "svelte";
  import favicon from "$lib/assets/favicon.svg";
  import "$lib/app/styles/global.css";
  import { initTheme } from "$lib/shared/lib/theme";

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
  {@render children()}
</div>
