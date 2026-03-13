<script lang="ts">
  import { renameFolder } from "$lib/entities/workspace";
  import { tick } from "svelte";

  interface Props {
    folderId: string;
    title: string;
    onEditingChange?: (editing: boolean) => void;
  }

  let { folderId, title, onEditingChange }: Props = $props();

  let editing = $state(false);
  let editValue = $state(title);
  let inputEl = $state<HTMLInputElement | null>(null);

  $effect(() => {
    if (editing && inputEl) {
      inputEl.focus();
      inputEl.select();
    }
  });

  // ─── Click-outside: commit when mousedown lands outside the input ──────────
  // Runs in capture phase — fires before any handler can call e.preventDefault(),
  // which would otherwise block the natural blur event on the input.
  $effect(() => {
    if (!editing) return;

    function onDocMouseDown(e: MouseEvent) {
      if (e.target !== inputEl) commit();
    }

    document.addEventListener("mousedown", onDocMouseDown, true);
    return () => document.removeEventListener("mousedown", onDocMouseDown, true);
  });

  function startEdit(e: MouseEvent) {
    e.stopPropagation();
    editValue = title;
    editing = true;
    onEditingChange?.(true);
  }

  async function commit() {
    if (!editing) return; // guard: blur may fire after capture-phase commit
    const trimmed = editValue.trim();
    if (trimmed) renameFolder(folderId, trimmed);
    editing = false;
    setTimeout(() => {
      onEditingChange?.(false);
    }, 100);
  }

  async function onKeyDown(e: KeyboardEvent) {
    if (e.key === "Enter") commit();
    if (e.key === "Escape") {
      if (!editing) return;
      editing = false;
      onEditingChange?.(false);
    }
  }
</script>

{#if editing}
  <input
    bind:this={inputEl}
    bind:value={editValue}
    class="fct__input"
    onblur={commit}
    onkeydown={onKeyDown}
    onclick={(e) => e.stopPropagation()}
    onmousedown={(e) => e.stopPropagation()}
  />
{:else}
  <button
    type="button"
    class="fct__title"
    ondblclick={startEdit}
    onclick={(e) => e.stopPropagation()}
    onmousedown={(e) => e.stopPropagation()}
  >
    {title}
  </button>
{/if}

<style>
  .fct__title {
    display: block;
    width: 100%;
    text-align: left;
    font-size: var(--text-sm);
    font-weight: var(--font-weight-semibold);
    color: var(--text-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: text;
    background: none;
    border: none;
    padding: 0;
    transition: color var(--duration-fast) var(--ease-default);
  }

  .fct__title:hover {
    color: var(--brand-text);
  }

  .fct__input {
    display: block;
    width: 100%;
    font-size: var(--text-sm);
    font-weight: var(--font-weight-semibold);
    color: var(--text-primary);
    background: transparent;
    border: none;
    border-bottom: 1px solid var(--brand-default);
    outline: none;
    padding: 0;
    caret-color: var(--brand-default);
  }
</style>
