<script lang="ts">
  import { WorkspacePanel } from "$lib/widgets";
  import { page } from "$app/stores";
</script>

<WorkspacePanel title="Folder">
  <p class="placeholder">Folder: {$page.params.id}</p>
</WorkspacePanel>

<style>
  .placeholder {
    font-size: var(--text-sm);
    color: var(--text-subtle);
  }
</style>
