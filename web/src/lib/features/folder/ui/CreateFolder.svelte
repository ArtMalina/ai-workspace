<script lang="ts">
  import { Button } from "$lib/shared/ui";

  let {
    onCreate,
  }: {
    onCreate?: () => void;
  } = $props();
</script>

<Button variant="filled" size="sm" onclick={onCreate}>+ New Folder</Button>
