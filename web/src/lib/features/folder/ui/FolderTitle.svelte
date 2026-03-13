<script lang="ts">
  import { Pencil } from "@lucide/svelte";
  import { renameFolder } from "$lib/entities/workspace";

  interface Props {
    folderId: string;
    title: string;
  }

  let { folderId, title }: Props = $props();

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
    const t = draft.trim();
    if (t) renameFolder(folderId, t);
    editing = false;
  }

  function onKeyDown(e: KeyboardEvent) {
    if (e.key === "Enter") commit();
    if (e.key === "Escape") editing = false;
  }
</script>

{#if editing}
  <input
    bind:this={inputEl}
    bind:value={draft}
    class="ft__input"
    onblur={commit}
    onkeydown={onKeyDown}
  />
{:else}
  <button class="ft__btn" onclick={startEdit} type="button" aria-label="Rename folder">
    <span class="ft__title">{title}</span>
    <Pencil class="ft__pencil" />
  </button>
{/if}

<style>
  /* ── Edit button ─────────────────────────────────────── */
  .ft__btn {
    display: flex;
    align-items: center;
    gap: var(--spacing-2);
    max-width: 100%;
    min-width: 0;
    background: transparent;
    border: none;
    border-radius: var(--radius-sm);
    padding: 0.125rem var(--spacing-1);
    margin-left: calc(-1 * var(--spacing-1));
    cursor: text;
    text-align: left;
    transition: background var(--duration-fast) var(--ease-default);
  }

  .ft__btn:hover {
    background: var(--color-neutral-100);
  }

  :global([data-theme="dark"]) .ft__btn:hover {
    background: var(--color-neutral-700);
  }

  /* ── Title text ──────────────────────────────────────── */
  .ft__title {
    font-size: var(--text-sm);
    font-weight: var(--font-weight-semibold);
    color: var(--text-primary);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    min-width: 0;
  }

  /* ── Pencil icon ─────────────────────────────────────── */
  :global(.ft__pencil) {
    width: 0.6875rem;
    height: 0.6875rem;
    color: var(--text-subtle);
    flex-shrink: 0;
    opacity: 0;
    transition: opacity var(--duration-fast) var(--ease-default);
  }

  .ft__btn:hover :global(.ft__pencil) {
    opacity: 1;
  }

  /* ── Input ───────────────────────────────────────────── */
  .ft__input {
    flex: 1;
    min-width: 0;
    width: 100%;
    font-size: var(--text-sm);
    font-weight: var(--font-weight-semibold);
    color: var(--text-primary);
    font-family: inherit;
    background: #ffffff;
    border: 1.5px solid var(--brand-default);
    border-radius: var(--radius-sm);
    outline: none;
    padding: 0.125rem var(--spacing-2);
    caret-color: var(--brand-default);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--brand-default) 12%, transparent);
  }

  :global([data-theme="dark"]) .ft__input {
    background: var(--color-neutral-800);
    color: var(--color-neutral-50);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--brand-default) 22%, transparent);
  }
</style>
