<script lang="ts">
  import type { Snippet } from "svelte";
  import { Pencil } from "@lucide/svelte";
  import { CloseButton } from "$lib/shared/ui";
  import { goto } from "$app/navigation";
  import { fly } from "svelte/transition";

  interface Props {
    title: string;
    children?: Snippet;
    onrename?: (newTitle: string) => void;
    onclose?: () => void;
  }

  let { title, children, onrename, onclose }: Props = $props();

  // ─── Close ───────────────────────────────────────────────
  function close() {
    onclose ? onclose() : goto("/workspace");
  }

  // ─── Title editing ───────────────────────────────────────
  let editing = $state(false);
  let draft = $state("");
  let inputEl = $state<HTMLInputElement | null>(null);

  function startEdit() {
    draft = title;
    editing = true;
  }

  $effect(() => {
    if (editing && inputEl) {
      inputEl.focus();
      inputEl.select();
    }
  });

  function commit() {
    const trimmed = draft.trim();
    if (trimmed) onrename?.(trimmed);
    editing = false;
  }

  function onKeyDown(e: KeyboardEvent) {
    if (e.key === "Enter") commit();
    if (e.key === "Escape") editing = false;
  }
</script>

<div class="wp" transition:fly={{ y: 12, duration: 200 }}>
  <div class="wp__header">
    {#if onrename}
      {#if editing}
        <input
          bind:this={inputEl}
          bind:value={draft}
          class="wp__title-input"
          onblur={commit}
          onkeydown={onKeyDown}
        />
      {:else}
        <button class="wp__title-btn" onclick={startEdit} aria-label="Rename">
          <span class="wp__title">{title}</span>
          <Pencil class="wp__title-pencil" />
        </button>
      {/if}
    {:else}
      <span class="wp__title">{title}</span>
    {/if}

    <CloseButton onclick={close} />
  </div>

  <div class="wp__body">
    {@render children?.()}
  </div>
</div>

<style>
  .wp {
    position: absolute;
    inset: 1rem;
    display: flex;
    flex-direction: column;
    background: var(--surface-card);
    border: 1px solid var(--border-default);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-xl);
    overflow: hidden;
    z-index: 20;
  }

  .wp__header {
    display: flex;
    align-items: center;
    gap: var(--spacing-2);
    padding: var(--spacing-3) var(--spacing-3) var(--spacing-3) var(--spacing-4);
    border-bottom: 1px solid var(--border-subtle);
    flex-shrink: 0;
    min-width: 0;
  }

  /* Static title */
  .wp__title {
    font-size: var(--text-sm);
    font-weight: var(--font-weight-semibold);
    color: var(--text-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* Editable title button */
  .wp__title-btn {
    flex: 1;
    display: flex;
    align-items: center;
    gap: var(--spacing-1-5);
    min-width: 0;
    background: transparent;
    border: none;
    border-radius: var(--radius-sm);
    padding: var(--spacing-1) var(--spacing-1-5);
    margin-left: calc(-1 * var(--spacing-1-5));
    cursor: text;
    text-align: left;
    transition: background var(--duration-fast) var(--ease-default);
  }

  .wp__title-btn:hover {
    background: var(--surface-overlay);
  }

  .wp__title-btn .wp__title {
    flex: 1;
  }

  :global(.wp__title-pencil) {
    width: 0.75rem;
    height: 0.75rem;
    color: var(--text-muted);
    flex-shrink: 0;
    opacity: 0;
    transition: opacity var(--duration-fast) var(--ease-default);
  }

  .wp__title-btn:hover :global(.wp__title-pencil) {
    opacity: 1;
  }

  /* Input replacing title */
  .wp__title-input {
    flex: 1;
    min-width: 0;
    font-size: var(--text-sm);
    font-weight: var(--font-weight-semibold);
    color: var(--text-primary);
    background: var(--surface-elevated);
    border: 1px solid var(--brand-default);
    border-radius: var(--radius-sm);
    outline: none;
    padding: var(--spacing-1) var(--spacing-2);
    caret-color: var(--brand-default);
  }

  .wp__body {
    flex: 1;
    overflow: auto;
    padding: var(--spacing-4);
  }
</style>
