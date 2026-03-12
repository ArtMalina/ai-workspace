<script lang="ts">
  import type { Snippet } from "svelte";
  import { Pencil } from "@lucide/svelte";
  import { CloseButton } from "$lib/shared/ui";
  import { MessageInput } from "$lib/features/chat";
  import { goto } from "$app/navigation";
  import { fly } from "svelte/transition";

  interface Props {
    title: string;
    children?: Snippet;
    onrename?: (newTitle: string) => void;
    onclose?: () => void;
    onsend?: (message: string) => void;
  }

  let { title, children, onrename, onclose, onsend }: Props = $props();

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

<div class="cp" transition:fly={{ y: 20, duration: 220 }}>
  <!-- Header -->
  <div class="cp__header">
    <div class="cp__header-left">
      {#if onrename}
        {#if editing}
          <input
            bind:this={inputEl}
            bind:value={draft}
            class="cp__title-input"
            onblur={commit}
            onkeydown={onKeyDown}
          />
        {:else}
          <button class="cp__title-btn" onclick={startEdit} aria-label="Rename">
            <span class="cp__title">{title}</span>
            <Pencil class="cp__title-pencil" />
          </button>
        {/if}
      {:else}
        <span class="cp__title">{title}</span>
      {/if}
    </div>

    <CloseButton onclick={close} />
  </div>

  <!-- Messages / body -->
  <div class="cp__body">
    {@render children?.()}
  </div>

  <!-- Input — pinned to bottom, overlays workspace quick-input -->
  <MessageInput {onsend} />
</div>

<style>
  /* ══ Shell ════════════════════════════════════════════════ */

  .cp {
    position: absolute;
    /* horizontal: half-screen, centered */
    left: 50%;
    transform: translateX(-50%);
    width: clamp(28rem, 50%, 64rem);
    /* vertical: top-inset to same bottom as workspace__quick */
    top: 0.5rem;
    bottom: var(--spacing-12, 3rem);
    /* layout */
    display: flex;
    flex-direction: column;
    overflow: hidden;
    z-index: 20;
    /* light */
    background: #ffffff;
    border: 1px solid var(--color-neutral-200);
    border-radius: var(--radius-xl);
    box-shadow:
      0 0 0 1px rgb(0 0 0 / 0.02),
      0 4px 8px -2px rgb(0 0 0 / 0.06),
      0 16px 32px -8px rgb(0 0 0 / 0.12),
      0 32px 56px -12px rgb(0 0 0 / 0.1);
  }

  :global([data-theme="dark"]) .cp {
    background: var(--color-neutral-800);
    border-color: var(--color-neutral-700);
    box-shadow:
      0 0 0 1px rgb(255 255 255 / 0.04),
      0 4px 8px -2px rgb(0 0 0 / 0.4),
      0 16px 32px -8px rgb(0 0 0 / 0.5),
      0 32px 56px -12px rgb(0 0 0 / 0.6);
  }

  /* ══ Header ═══════════════════════════════════════════════ */

  .cp__header {
    display: flex;
    align-items: center;
    gap: var(--spacing-2);
    padding: 0 var(--spacing-3) 0 var(--spacing-4);
    height: 3.25rem;
    flex-shrink: 0;
    background: var(--color-neutral-50);
    border-bottom: 1px solid var(--color-neutral-200);
    border-radius: var(--radius-xl) var(--radius-xl) 0 0;
  }

  :global([data-theme="dark"]) .cp__header {
    background: var(--color-neutral-900);
    border-bottom-color: var(--color-neutral-700);
  }

  .cp__header-left {
    flex: 1;
    min-width: 0;
    display: flex;
    align-items: center;
  }

  /* ── Title static ──────────────────────────────────────── */

  .cp__title {
    font-size: var(--text-base);
    font-weight: var(--font-weight-semibold);
    color: var(--text-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.25;
  }

  /* ── Title button (editable) ───────────────────────────── */

  .cp__title-btn {
    display: flex;
    align-items: center;
    gap: var(--spacing-2);
    max-width: 100%;
    min-width: 0;
    background: transparent;
    border: none;
    border-radius: var(--radius-md);
    padding: var(--spacing-1) var(--spacing-2);
    margin-left: calc(-1 * var(--spacing-2));
    cursor: text;
    text-align: left;
    transition: background var(--duration-fast) var(--ease-default);
  }

  .cp__title-btn:hover {
    background: var(--color-neutral-100);
  }

  :global([data-theme="dark"]) .cp__title-btn:hover {
    background: var(--color-neutral-800);
  }

  .cp__title-btn .cp__title {
    flex: 1;
  }

  :global(.cp__title-pencil) {
    width: 0.8125rem;
    height: 0.8125rem;
    color: var(--text-subtle);
    flex-shrink: 0;
    opacity: 0;
    transition: opacity var(--duration-fast) var(--ease-default);
  }

  .cp__title-btn:hover :global(.cp__title-pencil) {
    opacity: 1;
  }

  /* ── Title input ───────────────────────────────────────── */

  .cp__title-input {
    flex: 1;
    min-width: 0;
    width: 100%;
    font-size: var(--text-base);
    font-weight: var(--font-weight-semibold);
    color: var(--text-primary);
    background: #ffffff;
    border: 1.5px solid var(--brand-default);
    border-radius: var(--radius-md);
    outline: none;
    padding: var(--spacing-1) var(--spacing-2);
    caret-color: var(--brand-default);
    box-shadow:
      0 0 0 3px color-mix(in srgb, var(--brand-default) 12%, transparent),
      0 1px 3px rgb(0 0 0 / 0.06);
  }

  :global([data-theme="dark"]) .cp__title-input {
    background: var(--color-neutral-800);
    color: var(--color-neutral-50);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--brand-default) 22%, transparent);
  }

  /* ══ Body ═════════════════════════════════════════════════ */

  .cp__body {
    flex: 1;
    overflow-y: auto;
    padding: var(--spacing-6);
    background: #ffffff;
  }

  :global([data-theme="dark"]) .cp__body {
    background: var(--color-neutral-800);
  }
</style>
