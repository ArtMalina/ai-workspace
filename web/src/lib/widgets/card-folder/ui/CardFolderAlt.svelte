<script lang="ts">
  import { FileText, Layers, MessageSquare } from "@lucide/svelte";
  import type { LlmBrandTypes } from "$lib/entities/llm";
  import { LlmBrandIcon } from "$lib/features/llm-brand-icon";

  const MAX_VISIBLE_BRANDS = 3;

  interface Props {
    title: string;
    /** Unique models present across chats in this folder */
    llmBrands?: LlmBrandTypes[];
    filesCount?: number;
    collectionsCount?: number;
    chatsCount?: number;
    href?: string;
    onrename?: (title: string) => void;
  }

  let {
    title,
    llmBrands = [],
    filesCount,
    collectionsCount,
    chatsCount,
    href,
    onrename,
  }: Props = $props();

  const visibleBrands = $derived(llmBrands.slice(0, MAX_VISIBLE_BRANDS));
  const extraBrands = $derived(Math.max(0, llmBrands.length - MAX_VISIBLE_BRANDS));
  const hasChatRow = $derived((chatsCount ?? 0) > 0 || llmBrands.length > 0);
  const hasStats = $derived((filesCount ?? 0) > 0 || (collectionsCount ?? 0) > 0);

  // ─── Rename ──────────────────────────────────────────────
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

{#snippet body()}
  <div class="cfa__body">
    <!-- Title -->
    <div class="cfa__header">
      {#if editing}
        <input
          bind:this={inputEl}
          bind:value={editValue}
          class="cfa__input"
          onblur={commit}
          onkeydown={onKeyDown}
          onmousedown={(e) => e.stopPropagation()}
        />
      {:else}
        <span
          role="button"
          tabindex="0"
          class="cfa__title"
          ondblclick={startEdit}
          onmousedown={(e) => onrename && e.stopPropagation()}
        >
          {title}
        </span>
      {/if}
    </div>

    <!-- Brand stack + chat count -->
    {#if hasChatRow}
      <div class="cfa__chats-row">
        {#if visibleBrands.length > 0}
          <div class="cfa__brands">
            {#each visibleBrands as brand}
              <div class="cfa__brand-badge" title={brand}>
                <LlmBrandIcon {brand} />
              </div>
            {/each}
            {#if extraBrands > 0}
              <div class="cfa__brand-extra">+{extraBrands}</div>
            {/if}
          </div>
        {/if}

        {#if (chatsCount ?? 0) > 0}
          <span class="cfa__meta">
            <MessageSquare class="cfa__meta-icon" />
            {chatsCount}
            {chatsCount === 1 ? "chat" : "chats"}
          </span>
        {/if}
      </div>
    {/if}

    <!-- Divider + file/collection stats -->
    {#if hasStats}
      <hr class="cfa__divider" />
      <div class="cfa__stats">
        {#if (filesCount ?? 0) > 0}
          <span class="cfa__stat">
            <FileText class="cfa__stat-icon" />
            {filesCount}
            {filesCount === 1 ? "file" : "files"}
          </span>
        {/if}
        {#if (collectionsCount ?? 0) > 0}
          <span class="cfa__stat">
            <Layers class="cfa__stat-icon" />
            {collectionsCount}
            {collectionsCount === 1 ? "collection" : "collections"}
          </span>
        {/if}
      </div>
    {/if}
  </div>
{/snippet}

{#if href}
  <a class="cfa" {href}>
    <div class="cfa__tab"></div>
    {@render body()}
  </a>
{:else}
  <div class="cfa">
    <div class="cfa__tab"></div>
    {@render body()}
  </div>
{/if}

<style>
  /* ─── Shell ─────────────────────────────────────────────── */
  .cfa {
    display: inline-flex;
    flex-direction: column;
    width: 17rem;
    text-decoration: none;
    color: inherit;
    cursor: default;
  }

  a.cfa {
    cursor: pointer;
  }

  /* ─── Tab ────────────────────────────────────────────────── */
  .cfa__tab {
    align-self: flex-start;
    width: 6.5rem;
    height: 1rem;
    background: linear-gradient(
      to right,
      var(--brand-subtle),
      color-mix(in srgb, var(--brand-subtle) 20%, transparent)
    );
    border: 1.5px solid var(--border-default);
    border-bottom: none;
    border-radius: var(--radius-md) var(--radius-md) 0 0;
    transition:
      background var(--duration-fast) var(--ease-default),
      border-color var(--duration-fast) var(--ease-default);
  }

  /* ─── Body ───────────────────────────────────────────────── */
  .cfa__body {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-2);
    padding: var(--spacing-3) var(--spacing-4);
    background: var(--surface-card);
    border: 1.5px solid var(--border-default);
    border-radius: 0 var(--radius-md) var(--radius-md) var(--radius-md);
    box-shadow: var(--shadow-sm);
    transition:
      background var(--duration-fast) var(--ease-default),
      border-color var(--duration-fast) var(--ease-default),
      box-shadow var(--duration-fast) var(--ease-default);
  }

  /* ─── Title ──────────────────────────────────────────────── */
  .cfa__header {
    min-width: 0;
  }

  .cfa__title {
    display: block;
    font-size: var(--text-sm);
    font-weight: var(--font-weight-semibold);
    color: var(--text-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: text;
    transition: color var(--duration-fast) var(--ease-default);
  }

  .cfa__title:hover {
    color: var(--brand-text);
  }

  .cfa__input {
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

  /* ─── Chats row ──────────────────────────────────────────── */
  .cfa__chats-row {
    display: flex;
    align-items: center;
    gap: var(--spacing-2);
  }

  /* Overlapping brand badge stack */
  .cfa__brands {
    display: flex;
    align-items: center;
  }

  .cfa__brand-badge {
    width: 1.375rem;
    height: 1.375rem;
    border-radius: 50%;
    background: var(--surface-elevated);
    border: 1.5px solid var(--surface-card);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: -0.375rem;
    overflow: hidden;
    transition: border-color var(--duration-fast) var(--ease-default);
  }

  .cfa__brand-badge:first-child {
    margin-left: 0;
  }

  .cfa__brand-extra {
    width: 1.375rem;
    height: 1.375rem;
    border-radius: 50%;
    background: var(--surface-overlay);
    border: 1.5px solid var(--surface-card);
    margin-left: -0.375rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.5rem;
    font-weight: var(--font-weight-bold);
    color: var(--text-secondary);
    transition: border-color var(--duration-fast) var(--ease-default);
  }

  .cfa__meta {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-size: var(--text-xs);
    color: var(--text-subtle);
  }

  :global(.cfa__meta-icon) {
    width: 0.75rem;
    height: 0.75rem;
    flex-shrink: 0;
  }

  /* ─── Divider ────────────────────────────────────────────── */
  .cfa__divider {
    border: none;
    border-top: 1px solid var(--border-subtle);
    margin: 0;
  }

  /* ─── Stats row ──────────────────────────────────────────── */
  .cfa__stats {
    display: flex;
    align-items: center;
    gap: var(--spacing-3);
  }

  .cfa__stat {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-size: var(--text-xs);
    color: var(--text-subtle);
  }

  :global(.cfa__stat-icon) {
    width: 0.75rem;
    height: 0.75rem;
    flex-shrink: 0;
  }

  /* ─── Hover (link only) ──────────────────────────────────── */
  a.cfa:hover .cfa__tab {
    background: var(--brand-subtle);
    border-color: var(--brand-default);
  }

  a.cfa:hover .cfa__body {
    background: var(--brand-subtle);
    border-color: var(--brand-default);
    box-shadow: var(--shadow-md);
  }

  a.cfa:hover .cfa__brand-badge,
  a.cfa:hover .cfa__brand-extra {
    border-color: var(--brand-subtle);
  }
</style>
