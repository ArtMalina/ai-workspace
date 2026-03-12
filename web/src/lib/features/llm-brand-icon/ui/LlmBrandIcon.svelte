<script lang="ts">
  import { LlmIcon } from "$lib/shared/ui";
  import type { LlmBrandTypes } from "$lib/entities/llm";

  interface Props {
    brand: LlmBrandTypes;
    className?: string;
  }

  const { brand, className }: Props = $props();
</script>

<LlmIcon class={className} {brand} />
