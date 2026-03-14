<script lang="ts">
  import { FileText, Layers } from "@lucide/svelte";
  import type { LlmBrandTypes } from "$lib/entities/llm";
  import { LlmBrandIcon } from "$lib/features/llm-brand-icon";
  import { FolderCardTitle } from "$lib/features/folder";

  const MAX_VISIBLE_BRANDS = 3;

  interface Props {
    folderId: string;
    title: string;
    /** Unique models present across chats in this folder */
    llmBrands?: LlmBrandTypes[];
    filesCount?: number;
    collectionsCount?: number;
    chatsCount?: number;
    href?: string;
    /** Renders hover styles + pointer cursor on the div variant (no href) */
    clickable?: boolean;
    /** Highlighted when a chat card is dragged over this folder */
    isDropTarget?: boolean;
    onEditingChange?: (editing: boolean) => void;
  }

  let {
    folderId,
    title,
    llmBrands = [],
    filesCount,
    collectionsCount,
    chatsCount,
    href,
    clickable = false,
    isDropTarget = false,
    onEditingChange,
  }: Props = $props();

  const visibleBrands = $derived(llmBrands.slice(0, MAX_VISIBLE_BRANDS));
  const extraBrands = $derived(Math.max(0, llmBrands.length - MAX_VISIBLE_BRANDS));
  const hasChatRow = $derived((chatsCount ?? 0) > 0 || llmBrands.length > 0);
  const hasStats = $derived((filesCount ?? 0) > 0 || (collectionsCount ?? 0) > 0);
</script>

{#snippet body()}
  <div class="cfa__body">
    <!-- Title -->
    <div class="cfa__header">
      <FolderCardTitle {folderId} {title} {onEditingChange} />
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
  <a class="cfa" class:cfa--drop-target={isDropTarget} data-folder-id={folderId} {href}>
    <div class="cfa__tab"></div>
    {@render body()}
    {#if isDropTarget}
      <div class="cfa__drop-overlay" aria-hidden="true">
        <span class="cfa__drop-label">Drop to add</span>
      </div>
    {/if}
  </a>
{:else}
  <div
    class="cfa"
    class:cfa--drop-target={isDropTarget}
    class:cfa--clickable={clickable}
    data-folder-id={folderId}
  >
    <div class="cfa__tab"></div>
    {@render body()}
    {#if isDropTarget}
      <div class="cfa__drop-overlay" aria-hidden="true">
        <span class="cfa__drop-label">Drop to add</span>
      </div>
    {/if}
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
    position: relative;
  }

  a.cfa {
    cursor: pointer;
  }

  /* ─── Tab ────────────────────────────────────────────────── */
  .cfa__tab {
    align-self: flex-start;
    width: 6.5rem;
    height: 1rem;
    background: var(--brand-subtle);
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

  /* ─── Drop target ────────────────────────────────────────── */
  .cfa--drop-target .cfa__tab {
    background: color-mix(in srgb, var(--brand-default) 15%, transparent);
    border-color: var(--brand-default);
    animation: cfa-pulse 0.9s ease-in-out infinite alternate;
  }

  .cfa--drop-target .cfa__body {
    border-color: var(--brand-default) !important;
    background: color-mix(in srgb, var(--brand-default) 8%, var(--surface-card));
    box-shadow:
      0 0 0 3px color-mix(in srgb, var(--brand-default) 20%, transparent),
      var(--shadow-md);
  }

  /* Overlay shown on top of body when dragging over */
  .cfa__drop-overlay {
    position: absolute;
    inset: 1rem 0 0 0; /* below the tab */
    border-radius: 0 var(--radius-md) var(--radius-md) var(--radius-md);
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
  }

  .cfa__drop-label {
    font-size: var(--text-xs);
    font-weight: var(--font-weight-semibold);
    color: var(--brand-default);
    background: color-mix(in srgb, var(--brand-default) 12%, var(--surface-card));
    padding: 0.2rem 0.65rem;
    border-radius: var(--radius-full);
    border: 1px solid color-mix(in srgb, var(--brand-default) 35%, transparent);
    letter-spacing: 0.01em;
    backdrop-filter: blur(4px);
  }

  @keyframes cfa-pulse {
    from {
      opacity: 0.7;
    }
    to {
      opacity: 1;
    }
  }

  /* ─── Hover (link or clickable div) ─────────────────────── */
  a.cfa:hover .cfa__tab,
  .cfa--clickable:hover .cfa__tab {
    background: color-mix(in srgb, var(--brand-default) 7%, var(--brand-subtle));
    border-color: color-mix(in srgb, var(--brand-default) 35%, var(--border-default));
  }

  a.cfa:hover .cfa__body,
  .cfa--clickable:hover .cfa__body {
    background: var(--surface-elevated);
    border-color: color-mix(in srgb, var(--brand-default) 30%, var(--border-default));
    box-shadow: var(--shadow-sm);
  }

  a.cfa:hover .cfa__brand-badge,
  a.cfa:hover .cfa__brand-extra,
  .cfa--clickable:hover .cfa__brand-badge,
  .cfa--clickable:hover .cfa__brand-extra {
    border-color: var(--surface-elevated);
  }

  .cfa--clickable {
    cursor: pointer;
  }
</style>
