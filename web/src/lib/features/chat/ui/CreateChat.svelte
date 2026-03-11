<script lang="ts">
  import { MessageSquarePlus } from "@lucide/svelte";
  import { Button } from "$lib/shared/ui";

  let { onCreate }: { onCreate?: () => void } = $props();
</script>

<Button variant="filled" size="sm" onclick={onCreate}>
  <MessageSquarePlus class="w-4 h-4" />
  New Chat
</Button>
