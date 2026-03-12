<script lang="ts">
  import { MessageSquare } from "@lucide/svelte";
  import { LlmBrandIcon } from "$lib/features/llm-brand-icon";
  import type { LlmBrandTypes } from "$lib/entities/llm";

  const modelNames: Record<LlmBrandTypes, string> = {
    openai: "ChatGPT",
    claude: "Claude",
    qwen: "Qwen",
    llama: "Llama",
    mistral: "Mistral",
  };

  interface Props {
    title: string;
    model?: LlmBrandTypes;
    subtitle?: string;
    href?: string;
    onrename?: (title: string) => void;
  }

  let { title, model, subtitle, href, onrename }: Props = $props();

  const displaySubtitle = $derived(subtitle ?? (model ? modelNames[model] : undefined));

  let editing = $state(false);
  let editValue = $state(title);
  let inputEl = $state<HTMLInputElement | null>(null);

  $effect(() => {
    if (editing && inputEl) {
      inputEl.focus();
      inputEl.select();
    }
  });

  function startEdit(e: MouseEvent) {
    if (!onrename) return;
    e.stopPropagation();
    editValue = title;
    editing = true;
  }

  function commit() {
    const trimmed = editValue.trim();
    if (trimmed) onrename?.(trimmed);
    editing = false;
  }

  function onKeyDown(e: KeyboardEvent) {
    if (e.key === "Enter") commit();
    if (e.key === "Escape") editing = false;
  }
</script>

{#snippet content()}
  <div class="card-chat__content">
    {#if editing}
      <input
        bind:this={inputEl}
        bind:value={editValue}
        class="card-chat__input"
        onblur={commit}
        onkeydown={onKeyDown}
        onmousedown={(e) => e.stopPropagation()}
      />
    {:else}
      <button
        type="button"
        class="card-chat__title"
        ondblclick={startEdit}
        onclick={(e) => e.stopPropagation()}
        onmousedown={(e) => onrename && e.stopPropagation()}
      >
        {title}
      </button>
    {/if}
    {#if displaySubtitle}
      <span class="card-chat__subtitle">{displaySubtitle}</span>
    {/if}
  </div>
{/snippet}

{#if href}
  <a class="card-chat" {href}>
    <div class="card-chat__icon">
      {#if model}
        <LlmBrandIcon brand={model} />
      {:else}
        <MessageSquare class="card-chat__icon-fallback" />
      {/if}
    </div>
    {@render content()}
  </a>
{:else}
  <div class="card-chat">
    <div class="card-chat__icon">
      {#if model}
        <LlmBrandIcon brand={model} />
      {:else}
        <MessageSquare class="card-chat__icon-fallback" />
      {/if}
    </div>
    {@render content()}
  </div>
{/if}

<style>
  .card-chat {
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-3);
    width: 14rem;
    padding: var(--spacing-3) var(--spacing-4);
    background-color: var(--surface-card);
    border: 1px solid var(--border-subtle);
    border-left: 3px solid var(--brand-default);
    border-radius: var(--radius-md);
    text-decoration: none;
    color: inherit;
    cursor: default;
    transition:
      background-color var(--duration-fast) var(--ease-default),
      border-color var(--duration-fast) var(--ease-default),
      box-shadow var(--duration-fast) var(--ease-default);
  }

  a.card-chat {
    cursor: pointer;
  }

  a.card-chat:hover {
    background-color: var(--brand-subtle);
    border-color: var(--brand-default);
    box-shadow: var(--shadow-sm);
  }

  .card-chat__icon {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
  }

  :global(.card-chat__icon-fallback) {
    width: 1.5rem;
    height: 1.5rem;
    color: var(--brand-default);
  }

  .card-chat__content {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-1);
    overflow: hidden;
    min-width: 0;
    flex: 1;
  }

  .card-chat__title {
    font-size: var(--text-sm);
    font-weight: var(--font-weight-semibold);
    color: var(--text-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: text;
  }

  .card-chat__title:hover {
    color: var(--color-brand-text);
  }

  .card-chat__input {
    font-size: var(--text-sm);
    font-weight: var(--font-weight-semibold);
    color: var(--text-primary);
    background: transparent;
    border: none;
    border-bottom: 1px solid var(--brand-default);
    outline: none;
    width: 100%;
    padding: 0;
    caret-color: var(--brand-default);
  }

  .card-chat__subtitle {
    font-size: var(--text-xs);
    color: var(--text-subtle);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
