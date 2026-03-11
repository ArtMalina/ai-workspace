<script lang="ts">
  import type { LlmBrandTypes } from "$lib/entities/llm";

  import LlmBrandIcon from "./LlmBrandIcon.svelte";

  interface Props {
    brand: LlmBrandTypes;
    className?: string;
  }

  let { brand, className = "p-1 border-1 border-brand bg-surface rounded-lg" }: Props = $props();
</script>

<div class="flex items-center {className}">
  {#key brand}
    <LlmBrandIcon {brand} />
  {/key}
</div>
