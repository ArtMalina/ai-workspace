<script lang="ts">
  import { Workspace } from "$lib/pages/workspace";

  let { children } = $props();
</script>

<div class="workspace-root">
  <Workspace />
  {@render children()}
</div>

<style>
  .workspace-root {
    position: relative;
    height: 100%;
    overflow: hidden;
  }
</style>
