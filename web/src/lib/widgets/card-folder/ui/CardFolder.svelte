<script lang="ts">
  import { Folder } from "@lucide/svelte";
  import type { Snippet } from "svelte";
  import type { LlmBrandTypes } from "$lib/entities/llm";
  import { LlmBrandIconWrapper } from "$lib/features/llm-brand-icon";

  interface Props {
    title: string;
    description?: string;
    llmBrand?: LlmBrandTypes;
    href?: string;
    onrename?: (title: string) => void;
    children?: Snippet;
  }

  let { title, description, href, onrename, llmBrand, children }: Props = $props();

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
  <div class="card-folder__content">
    {#if editing}
      <input
        bind:this={inputEl}
        bind:value={editValue}
        class="card-folder__input"
        onblur={commit}
        onkeydown={onKeyDown}
        onmousedown={(e) => e.stopPropagation()}
      />
    {:else}
      <span
        role="button"
        tabindex="0"
        class="card-folder__title"
        ondblclick={startEdit}
        onmousedown={(e) => onrename && e.stopPropagation()}
      >
        {title}
      </span>
    {/if}
    {#if description}
      <span class="card-folder__description">{description}</span>
    {/if}
    {@render children?.()}
  </div>
{/snippet}

{#if href}
  <a class="card-folder" {href}>
    <div class="card-folder__tab"></div>
    <div class="card-folder__body">
      {#if llmBrand}
        <LlmBrandIconWrapper brand={llmBrand} />
      {:else}
        <Folder class="card-folder__icon" />
      {/if}
      {@render content()}
    </div>
  </a>
{:else}
  <div class="card-folder">
    <div class="card-folder__tab"></div>
    <div class="card-folder__body">
      {#if llmBrand}
        <LlmBrandIconWrapper brand={llmBrand} />
      {:else}
        <Folder class="card-folder__icon" />
      {/if}
      {@render content()}
    </div>
  </div>
{/if}

<style>
  .card-folder {
    display: inline-flex;
    flex-direction: column;
    text-decoration: none;
    color: inherit;
    cursor: default;
    width: 14rem;
  }

  a.card-folder {
    cursor: pointer;
  }

  .card-folder__tab {
    align-self: flex-start;
    width: 5rem;
    height: 0.75rem;
    background-color: var(--surface-elevated);
    border-radius: var(--radius-md) var(--radius-md) 0 0;
    border: 2px solid var(--border-default);
    border-bottom: none;
    transition: background-color var(--duration-fast) var(--ease-default);
  }

  .card-folder__body {
    display: flex;
    align-items: center;
    gap: var(--spacing-3);
    padding: var(--spacing-4);
    background-color: var(--surface-elevated);
    border: 2px solid var(--border-default);
    border-radius: 0 var(--radius-md) var(--radius-md) var(--radius-md);
    transition:
      background-color var(--duration-fast) var(--ease-default),
      border-color var(--duration-fast) var(--ease-default);
  }

  :global(.card-folder__icon) {
    flex-shrink: 0;
    width: 2rem;
    height: 2rem;
    color: var(--brand-default);
    transition: color var(--duration-fast) var(--ease-default);
  }

  .card-folder__content {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-1);
    overflow: hidden;
    min-width: 0;
    flex: 1;
  }

  .card-folder__title {
    font-size: var(--text-sm);
    font-weight: var(--font-weight-semibold);
    color: var(--text-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: text;
  }
  .card-folder__title:hover {
    color: var(--color-brand-text);
  }

  .card-folder__input {
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

  .card-folder__description {
    font-size: var(--text-sm);
    color: var(--text-subtle);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* hover — only when it's a link */
  a.card-folder:hover .card-folder__tab {
    background-color: var(--brand-subtle);
    border-color: var(--brand-default);
  }

  a.card-folder:hover .card-folder__body {
    background-color: var(--brand-subtle);
    border-color: var(--brand-default);
  }

  a.card-folder:hover :global(.card-folder__icon) {
    color: var(--brand-hover);
  }
</style>
