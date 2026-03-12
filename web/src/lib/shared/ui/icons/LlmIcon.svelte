<script lang="ts">
  import type { Component } from "svelte";
  import type { LlmBrandTypes } from "$lib/entities/llm";
  import IconOpenAI from "./IconOpenAI.svelte";
  import IconClaude from "./IconClaude.svelte";
  import IconQwen from "./IconQwen.svelte";
  import IconLlama from "./IconLlama.svelte";
  import IconMistral from "./IconMistral.svelte";

  interface Props {
    brand: LlmBrandTypes;
    size?: number | string;
    class?: string;
  }

  let { brand, size, class: className = "" }: Props = $props();

  const ICONS: Record<LlmBrandTypes, Component> = {
    openai: IconOpenAI,
    claude: IconClaude,
    qwen: IconQwen,
    llama: IconLlama,
    mistral: IconMistral,
  };

  const Icon = $derived(ICONS[brand] ?? IconOpenAI);
</script>

<Icon {size} class={className} />
