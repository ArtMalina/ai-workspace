<script lang="ts">
  import type { Snippet } from "svelte";
  import { Pencil } from "@lucide/svelte";
  import { CloseButton } from "$lib/shared/ui";
  import { goto } from "$app/navigation";
  import { fly } from "svelte/transition";

  interface Props {
    title: string;
    children?: Snippet;
    footer?: Snippet;
    onrename?: (newTitle: string) => void;
    onclose?: () => void;
  }

  let { title, children, footer, onrename, onclose }: Props = $props();

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
    <div class="wp__header-left">
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
    </div>

    <CloseButton onclick={close} />
  </div>

  <div class="wp__body">
    {@render children?.()}
  </div>

  {#if footer}
    {@render footer()}
  {/if}
</div>

<style>
  /* ══ Shell ════════════════════════════════════════════════ */

  /* Light — белое "парящее" окно с мягкой диффузной тенью */
  .wp {
    position: absolute;
    inset: 1rem;
    display: flex;
    flex-direction: column;
    background: #ffffff;
    border: 1px solid var(--color-neutral-200);
    border-radius: var(--radius-xl);
    box-shadow:
      0 0 0 1px rgb(0 0 0 / 0.02),
      0 2px 4px -1px rgb(0 0 0 / 0.04),
      0 8px 20px -4px rgb(0 0 0 / 0.08),
      0 24px 48px -8px rgb(0 0 0 / 0.1);
    overflow: hidden;
    z-index: 20;
  }

  /* Dark — глубокий, чуть светлее страницы, акцентная тень */
  :global([data-theme="dark"]) .wp {
    background: var(--color-neutral-800);
    border-color: var(--color-neutral-700);
    box-shadow:
      0 0 0 1px rgb(255 255 255 / 0.04),
      0 4px 8px -2px rgb(0 0 0 / 0.4),
      0 16px 32px -8px rgb(0 0 0 / 0.5),
      0 32px 56px -12px rgb(0 0 0 / 0.6);
  }

  /* ══ Header ═══════════════════════════════════════════════ */

  /* Light — чуть теплее белого, чёткий разделитель снизу */
  .wp__header {
    display: flex;
    align-items: center;
    gap: var(--spacing-2);
    padding: 0 var(--spacing-3) 0 var(--spacing-4);
    height: 3.25rem;
    flex-shrink: 0;
    background: var(--color-neutral-50);
    border-bottom: 1px solid var(--color-neutral-200);
  }

  /* Dark — заглублённый chrome-header, создаёт иерархию глубины */
  :global([data-theme="dark"]) .wp__header {
    background: var(--color-neutral-900);
    border-bottom-color: var(--color-neutral-700);
  }

  /* ══ Header layout ════════════════════════════════════════ */

  .wp__header-left {
    flex: 1;
    min-width: 0;
    display: flex;
    align-items: center;
  }

  /* ══ Title — static ═══════════════════════════════════════ */

  .wp__title {
    font-size: var(--text-base);
    font-weight: var(--font-weight-semibold);
    color: var(--text-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.25;
  }

  /* ══ Title — editable button ══════════════════════════════ */

  .wp__title-btn {
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

  /* Light hover — neutral-100, мягко */
  .wp__title-btn:hover {
    background: var(--color-neutral-100);
  }

  /* Dark hover — neutral-800, чуть светлее chrome-фона */
  :global([data-theme="dark"]) .wp__title-btn:hover {
    background: var(--color-neutral-800);
  }

  .wp__title-btn .wp__title {
    flex: 1;
  }

  :global(.wp__title-pencil) {
    width: 0.8125rem;
    height: 0.8125rem;
    color: var(--text-subtle);
    flex-shrink: 0;
    opacity: 0;
    transition: opacity var(--duration-fast) var(--ease-default);
  }

  .wp__title-btn:hover :global(.wp__title-pencil) {
    opacity: 1;
  }

  /* ══ Title — input ════════════════════════════════════════ */

  /* Light — белый input, акцентная рамка + мягкое ring-glow */
  .wp__title-input {
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
    transition: box-shadow var(--duration-fast) var(--ease-default);
  }

  /* Dark — чуть темнее chrome-фона, более яркий ring */
  :global([data-theme="dark"]) .wp__title-input {
    background: var(--color-neutral-800);
    color: var(--color-neutral-50);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--brand-default) 22%, transparent);
  }

  /* ══ Body ═════════════════════════════════════════════════ */

  /* Light — чистый белый, слегка больше padding сверху */
  .wp__body {
    flex: 1;
    overflow: auto;
    padding: var(--spacing-6);
    background: #ffffff;
  }

  /* Dark — тело светлее chrome-заголовка, создаёт нужную иерархию */
  :global([data-theme="dark"]) .wp__body {
    background: var(--color-neutral-800);
  }
</style>
