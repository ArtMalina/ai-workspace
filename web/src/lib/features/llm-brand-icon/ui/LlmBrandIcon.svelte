<script lang="ts">
  import type { Component } from "svelte";
  import { IconClaude, IconLlama, IconMistral, IconOpenAI, IconQwen } from "$lib/shared/ui";
  import type { LlmBrandTypes } from "$lib/entities/llm";

  interface Props {
    brand: LlmBrandTypes;
  }

  let { brand }: Props = $props();

  const components: Record<LlmBrandTypes, Component> = {
    openai: IconOpenAI,
    llama: IconLlama,
    mistral: IconMistral,
    qwen: IconQwen,
    claude: IconClaude,
  };

  const IconComponent = $derived(components[brand] || IconOpenAI);
</script>

<IconComponent />
