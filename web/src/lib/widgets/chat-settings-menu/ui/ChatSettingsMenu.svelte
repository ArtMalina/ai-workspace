<script lang="ts">
  import { SlidersHorizontal, Rows3, Columns2, ChevronDown } from "@lucide/svelte";
  import { chatViewState, setChatViewMode } from "../model/store.svelte";
  import type { ChatViewMode } from "../model/store.svelte";

  // ─── Dropdown open state ─────────────────────────────────
  let open = $state(false);
  let rootEl = $state<HTMLElement | null>(null);

  // Close on outside click (capture phase — works even when children call
  // e.stopPropagation internally)
  $effect(() => {
    if (!open) return;

    function onOutside(e: MouseEvent) {
      if (rootEl && !rootEl.contains(e.target as Node)) {
        open = false;
      }
    }

    document.addEventListener("mousedown", onOutside, true);
    return () => document.removeEventListener("mousedown", onOutside, true);
  });

  // ─── Sub-menu: Смена вида отображения ────────────────────
  let viewSubmenuOpen = $state(false);

  const VIEW_OPTIONS: { value: ChatViewMode; label: string; hint: string }[] = [
    { value: "thread", label: "Stacked", hint: "Label above content" },
    { value: "alt", label: "Columns", hint: "Label in left column" },
  ];

  function selectMode(mode: ChatViewMode) {
    setChatViewMode(mode);
    open = false;
    viewSubmenuOpen = false;
  }
</script>

<div class="csm" bind:this={rootEl}>
  <!-- Trigger button -->
  <button
    class="csm__trigger"
    class:csm__trigger--active={open}
    onclick={() => {
      open = !open;
    }}
    aria-expanded={open}
    aria-haspopup="menu"
    title="Settings"
    type="button"
  >
    <SlidersHorizontal class="csm__trigger-icon" />
  </button>

  <!-- Dropdown panel -->
  {#if open}
    <div class="csm__panel" role="menu">
      <!-- ── Section: Chat Settings ─────────────────────── -->
      <div class="csm__section">
        <span class="csm__section-label">Chat settings</span>

        <!-- Item: Смена вида отображения -->
        <button
          class="csm__item"
          class:csm__item--open={viewSubmenuOpen}
          onclick={() => {
            viewSubmenuOpen = !viewSubmenuOpen;
          }}
          aria-expanded={viewSubmenuOpen}
          type="button"
          role="menuitem"
        >
          <Rows3 class="csm__item-icon" />
          <span class="csm__item-label">Display mode</span>
          <ChevronDown class="csm__item-chevron" />
        </button>

        <!-- Sub-menu: view mode options -->
        {#if viewSubmenuOpen}
          <div class="csm__submenu" role="group" aria-label="Вид отображения">
            {#each VIEW_OPTIONS as opt (opt.value)}
              <button
                class="csm__option"
                class:csm__option--active={chatViewState.mode === opt.value}
                onclick={() => selectMode(opt.value)}
                type="button"
                role="menuitemradio"
                aria-checked={chatViewState.mode === opt.value}
              >
                <span class="csm__option-radio">
                  {#if chatViewState.mode === opt.value}
                    <span class="csm__option-dot"></span>
                  {/if}
                </span>
                <span class="csm__option-text">
                  <span class="csm__option-name">{opt.label}</span>
                  <span class="csm__option-hint">{opt.hint}</span>
                </span>
              </button>
            {/each}
          </div>
        {/if}
      </div>
    </div>
  {/if}
</div>

<style>
  /* ── Root ───────────────────────────────────────────────── */
  .csm {
    position: relative;
  }

  /* ── Trigger ────────────────────────────────────────────── */
  .csm__trigger {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    border: none;
    border-radius: var(--radius-md);
    background: transparent;
    color: var(--text-subtle);
    cursor: pointer;
    transition:
      background var(--duration-fast) var(--ease-default),
      color var(--duration-fast) var(--ease-default);
  }

  .csm__trigger:hover,
  .csm__trigger--active {
    background: var(--color-neutral-100);
    color: var(--text-primary);
  }

  :global([data-theme="dark"]) .csm__trigger:hover,
  :global([data-theme="dark"]) .csm__trigger--active {
    background: var(--color-neutral-700);
    color: var(--text-primary);
  }

  :global(.csm__trigger-icon) {
    width: 15px;
    height: 15px;
  }

  /* ── Dropdown panel ─────────────────────────────────────── */
  .csm__panel {
    position: absolute;
    top: calc(100% + 6px);
    right: 0;
    z-index: 200;
    min-width: 14rem;
    background: var(--surface-card);
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-lg);
    padding: 0.375rem;
    animation: csm-in 100ms var(--ease-default) both;
  }

  @keyframes csm-in {
    from {
      opacity: 0;
      transform: translateY(-4px) scale(0.97);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  :global([data-theme="dark"]) .csm__panel {
    background: var(--color-neutral-800);
    border-color: var(--color-neutral-700);
  }

  /* ── Section ────────────────────────────────────────────── */
  .csm__section {
    display: flex;
    flex-direction: column;
  }

  .csm__section-label {
    padding: 0.25rem 0.5rem 0.2rem;
    font-size: 0.625rem;
    font-weight: var(--font-weight-bold);
    letter-spacing: 0.07em;
    text-transform: uppercase;
    color: var(--text-muted);
    user-select: none;
  }

  /* ── Item ───────────────────────────────────────────────── */
  .csm__item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    width: 100%;
    padding: 0.4rem 0.5rem;
    border: none;
    border-radius: var(--radius-md);
    background: transparent;
    color: var(--text-primary);
    font-size: var(--text-sm);
    cursor: pointer;
    text-align: left;
    transition: background var(--duration-fast) var(--ease-default);
  }

  .csm__item:hover,
  .csm__item--open {
    background: var(--color-neutral-100);
  }

  :global([data-theme="dark"]) .csm__item:hover,
  :global([data-theme="dark"]) .csm__item--open {
    background: var(--color-neutral-700);
  }

  :global(.csm__item-icon) {
    width: 14px;
    height: 14px;
    flex-shrink: 0;
    color: var(--text-subtle);
  }

  .csm__item-label {
    flex: 1;
  }

  :global(.csm__item-chevron) {
    width: 12px;
    height: 12px;
    flex-shrink: 0;
    color: var(--text-muted);
    transition: transform var(--duration-fast) var(--ease-default);
  }

  .csm__item--open :global(.csm__item-chevron) {
    transform: rotate(180deg);
  }

  /* ── Sub-menu ───────────────────────────────────────────── */
  .csm__submenu {
    display: flex;
    flex-direction: column;
    gap: 1px;
    margin: 0.125rem 0 0.25rem 1rem;
    padding: 0.25rem;
    background: var(--color-neutral-50);
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius-md);
  }

  :global([data-theme="dark"]) .csm__submenu {
    background: var(--color-neutral-900);
    border-color: var(--color-neutral-700);
  }

  /* ── Option row ─────────────────────────────────────────── */
  .csm__option {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    width: 100%;
    padding: 0.35rem 0.5rem;
    border: none;
    border-radius: var(--radius-sm);
    background: transparent;
    cursor: pointer;
    text-align: left;
    transition: background var(--duration-fast) var(--ease-default);
  }

  .csm__option:hover {
    background: var(--color-neutral-100);
  }
  .csm__option--active {
    background: color-mix(in srgb, var(--brand-default) 10%, transparent);
  }
  .csm__option--active:hover {
    background: color-mix(in srgb, var(--brand-default) 15%, transparent);
  }

  :global([data-theme="dark"]) .csm__option:hover {
    background: var(--color-neutral-700);
  }
  :global([data-theme="dark"]) .csm__option--active {
    background: color-mix(in srgb, var(--brand-default) 12%, transparent);
  }

  /* radio indicator */
  .csm__option-radio {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 0.875rem;
    height: 0.875rem;
    border: 1.5px solid var(--border-default);
    border-radius: 50%;
    background: transparent;
    transition: border-color var(--duration-fast) var(--ease-default);
  }

  .csm__option--active .csm__option-radio {
    border-color: var(--brand-default);
  }

  .csm__option-dot {
    display: block;
    width: 0.375rem;
    height: 0.375rem;
    border-radius: 50%;
    background: var(--brand-default);
  }

  /* option text */
  .csm__option-text {
    display: flex;
    flex-direction: column;
    gap: 1px;
    min-width: 0;
  }

  .csm__option-name {
    font-size: var(--text-sm);
    font-weight: var(--font-weight-medium);
    color: var(--text-primary);
    line-height: 1.2;
  }

  .csm__option--active .csm__option-name {
    color: var(--brand-text);
  }

  :global([data-theme="dark"]) .csm__option--active .csm__option-name {
    color: var(--brand-default);
  }

  .csm__option-hint {
    font-size: 0.6875rem;
    color: var(--text-muted);
    line-height: 1.2;
  }
</style>
