<script lang="ts">
  import type { Snippet } from "svelte";
  import type { LlmBrandTypes } from "$lib/entities/llm";
  import { Pencil, MessageSquare } from "@lucide/svelte";
  import { CloseButton } from "$lib/shared/ui";
  import { MessageInput } from "$lib/features/chat";
  import { LlmBrandIcon } from "$lib/features/llm-brand-icon";
  import { PanelExpandButton, panelExpandState } from "$lib/features/panel-expand";
  import { goto } from "$app/navigation";
  import { fly } from "svelte/transition";

  interface Props {
    title: string;
    model?: LlmBrandTypes;
    subtitle?: string;
    children?: Snippet;
    /** Optional side panel rendered to the right of the chat window */
    sidebar?: Snippet;
    onrename?: (newTitle: string) => void;
    onsubtitle?: (newSubtitle: string) => void;
    onmodelchange?: (model: LlmBrandTypes) => void;
    onclose?: () => void;
    onsend?: (message: string) => void;
  }

  let {
    title,
    model,
    subtitle,
    children,
    sidebar,
    onrename,
    onsubtitle,
    onmodelchange,
    onclose,
    onsend,
  }: Props = $props();

  // ─── Close ───────────────────────────────────────────────
  function close() {
    onclose ? onclose() : goto("/workspace");
  }

  // ─── Title editing ───────────────────────────────────────
  let editingTitle = $state(false);
  let titleDraft = $state("");
  let titleInputEl = $state<HTMLInputElement | null>(null);

  function startTitleEdit() {
    titleDraft = title;
    editingTitle = true;
  }

  $effect(() => {
    if (editingTitle && titleInputEl) {
      titleInputEl.focus();
      titleInputEl.select();
    }
  });

  function commitTitle() {
    const t = titleDraft.trim();
    if (t) onrename?.(t);
    editingTitle = false;
  }

  function onTitleKeyDown(e: KeyboardEvent) {
    if (e.key === "Enter") commitTitle();
    if (e.key === "Escape") editingTitle = false;
  }

  // ─── Subtitle editing ────────────────────────────────────
  let editingSubtitle = $state(false);
  let subtitleDraft = $state("");
  let subtitleInputEl = $state<HTMLInputElement | null>(null);

  function startSubtitleEdit() {
    if (!onsubtitle) return;
    subtitleDraft = subtitle ?? "";
    editingSubtitle = true;
  }

  $effect(() => {
    if (editingSubtitle && subtitleInputEl) subtitleInputEl.focus();
  });

  function commitSubtitle() {
    onsubtitle?.(subtitleDraft.trim());
    editingSubtitle = false;
  }

  function onSubtitleKeyDown(e: KeyboardEvent) {
    if (e.key === "Enter") commitSubtitle();
    if (e.key === "Escape") editingSubtitle = false;
  }
</script>

<!-- ─── Inner panel content (reused in both layouts) ──── -->
{#snippet panelInner()}
  <!-- ══ Header ══ -->
  <div class="cp__header">
    <!-- LLM icon -->
    <div class="cp__llm-icon" class:cp__llm-icon--fallback={!model}>
      {#if model}
        <LlmBrandIcon brand={model} />
      {:else}
        <MessageSquare class="cp__llm-fallback-svg" />
      {/if}
    </div>

    <!-- Title + subtitle column -->
    <div class="cp__header-meta">
      <div class="cp__title-row">
        {#if onrename}
          {#if editingTitle}
            <input
              bind:this={titleInputEl}
              bind:value={titleDraft}
              class="cp__title-input"
              onblur={commitTitle}
              onkeydown={onTitleKeyDown}
            />
          {:else}
            <button class="cp__title-btn" onclick={startTitleEdit} aria-label="Rename">
              <span class="cp__title">{title}</span>
              <Pencil class="cp__title-pencil" />
            </button>
          {/if}
        {:else}
          <span class="cp__title">{title}</span>
        {/if}
      </div>

      {#if onsubtitle || subtitle}
        <div class="cp__subtitle-row">
          {#if editingSubtitle}
            <input
              bind:this={subtitleInputEl}
              bind:value={subtitleDraft}
              class="cp__subtitle-input"
              placeholder="Add description…"
              onblur={commitSubtitle}
              onkeydown={onSubtitleKeyDown}
            />
          {:else}
            <button class="cp__subtitle-btn" onclick={startSubtitleEdit} disabled={!onsubtitle}>
              {#if subtitle}
                <span class="cp__subtitle-text">{subtitle}</span>
              {:else}
                <span class="cp__subtitle-placeholder">Add description…</span>
              {/if}
            </button>
          {/if}
        </div>
      {/if}
    </div>

    <div class="cp__header-right">
      <PanelExpandButton />
      <CloseButton onclick={close} />
    </div>
  </div>

  <!-- ══ Messages body ══ -->
  <div class="cp__body">
    {@render children?.()}
  </div>

  <!-- ══ Input ══ -->
  <MessageInput {onsend} {model} {onmodelchange} />
{/snippet}

<!-- ─── Layout: with sidebar OR standalone ────────────── -->
{#if sidebar}
  <div
    class="cp-frame"
    class:cp-frame--expanded={panelExpandState.expanded}
    transition:fly={{ y: 20, duration: 220 }}
  >
    <div class="cp cp--framed" class:cp--expanded={panelExpandState.expanded}>
      {@render panelInner()}
    </div>
    <aside class="cp-aside">
      {@render sidebar()}
    </aside>
  </div>
{:else}
  <div
    class="cp"
    class:cp--wide={panelExpandState.expanded}
    transition:fly={{ y: 20, duration: 220 }}
  >
    {@render panelInner()}
  </div>
{/if}

<style>
  /* ══ Frame (chat + sidebar side by side) ══════════════════ */

  .cp-frame {
    position: fixed;
    top: 1rem;
    bottom: 1rem;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: stretch;
    gap: 0.75rem;
    z-index: 100;
    /* smooth width transition */
    transition: width 260ms cubic-bezier(0.4, 0, 0.2, 1);
  }

  .cp-frame--expanded {
    width: calc(100vw - 6rem);
  }

  /* ══ Shell ════════════════════════════════════════════════ */

  .cp {
    position: fixed;
    left: 50%;
    transform: translateX(-50%);
    width: clamp(34rem, 68vw, 86rem);
    top: 1rem;
    bottom: 1rem;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    z-index: 100;
    background: #ffffff;
    border: 1px solid var(--color-neutral-200);
    border-radius: var(--radius-xl);
    box-shadow:
      0 0 0 1px rgb(0 0 0 / 0.02),
      0 4px 8px -2px rgb(0 0 0 / 0.06),
      0 16px 32px -8px rgb(0 0 0 / 0.14),
      0 40px 72px -16px rgb(0 0 0 / 0.12);
    transition: width 260ms cubic-bezier(0.4, 0, 0.2, 1);
  }

  .cp--wide {
    width: calc(100vw - 6rem);
  }

  /* When inside the frame: position is handled by frame */
  .cp--framed {
    position: relative;
    left: unset;
    top: unset;
    bottom: unset;
    transform: none;
    width: clamp(30rem, 56vw, 70rem);
    flex-shrink: 0;
    transition: width 260ms cubic-bezier(0.4, 0, 0.2, 1);
  }

  /* In expanded mode the chat panel takes all remaining space */
  .cp--expanded {
    flex: 1;
    min-width: 0;
    width: auto;
  }

  :global([data-theme="dark"]) .cp {
    background: var(--color-neutral-800);
    border-color: var(--color-neutral-700);
    box-shadow:
      0 0 0 1px rgb(255 255 255 / 0.04),
      0 4px 8px -2px rgb(0 0 0 / 0.4),
      0 16px 32px -8px rgb(0 0 0 / 0.55),
      0 40px 72px -16px rgb(0 0 0 / 0.65);
  }

  /* ══ Sidebar ══════════════════════════════════════════════ */

  .cp-aside {
    width: 22rem;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    border-radius: var(--radius-xl);
    background: #ffffff;
    border: 1px solid var(--color-neutral-200);
    box-shadow:
      0 0 0 1px rgb(0 0 0 / 0.02),
      0 4px 8px -2px rgb(0 0 0 / 0.06),
      0 16px 32px -8px rgb(0 0 0 / 0.14),
      0 40px 72px -16px rgb(0 0 0 / 0.12);
  }

  :global([data-theme="dark"]) .cp-aside {
    background: var(--color-neutral-800);
    border-color: var(--color-neutral-700);
    box-shadow:
      0 0 0 1px rgb(255 255 255 / 0.04),
      0 4px 8px -2px rgb(0 0 0 / 0.4),
      0 16px 32px -8px rgb(0 0 0 / 0.55),
      0 40px 72px -16px rgb(0 0 0 / 0.65);
  }

  /* ══ Header ═══════════════════════════════════════════════ */

  .cp__header {
    display: flex;
    align-items: center;
    gap: var(--spacing-3);
    padding: var(--spacing-3) var(--spacing-3) var(--spacing-3) var(--spacing-4);
    min-height: 4rem;
    flex-shrink: 0;
    background: var(--color-neutral-50);
    border-bottom: 1px solid var(--color-neutral-200);
    border-radius: var(--radius-xl) var(--radius-xl) 0 0;
  }

  :global([data-theme="dark"]) .cp__header {
    background: var(--color-neutral-900);
    border-bottom-color: var(--color-neutral-700);
  }

  /* ── LLM icon ───────────────────────────────────────────── */

  .cp__llm-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 2rem;
    height: 2rem;
    border-radius: var(--radius-md);
    background: var(--color-neutral-100);
    border: 1px solid var(--color-neutral-200);
  }

  :global([data-theme="dark"]) .cp__llm-icon {
    background: var(--color-neutral-800);
    border-color: var(--color-neutral-700);
  }

  :global(.cp__llm-icon svg) {
    width: 1.125rem;
    height: 1.125rem;
  }

  :global(.cp__llm-fallback-svg) {
    width: 1rem;
    height: 1rem;
    color: var(--text-subtle);
  }

  /* ── Header meta ────────────────────────────────────────── */

  .cp__header-meta {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 0.125rem;
  }

  /* ── Title ──────────────────────────────────────────────── */

  .cp__title-row {
    display: flex;
    align-items: center;
    min-width: 0;
  }

  .cp__title {
    font-size: var(--text-base);
    font-weight: var(--font-weight-semibold);
    color: var(--text-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.25;
  }

  .cp__title-btn {
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

  .cp__title-btn:hover {
    background: var(--color-neutral-100);
  }
  :global([data-theme="dark"]) .cp__title-btn:hover {
    background: var(--color-neutral-800);
  }

  :global(.cp__title-pencil) {
    width: 0.75rem;
    height: 0.75rem;
    color: var(--text-subtle);
    flex-shrink: 0;
    opacity: 0;
    transition: opacity var(--duration-fast) var(--ease-default);
  }

  .cp__title-btn:hover :global(.cp__title-pencil) {
    opacity: 1;
  }

  .cp__title-input {
    flex: 1;
    min-width: 0;
    width: 100%;
    font-size: var(--text-base);
    font-weight: var(--font-weight-semibold);
    color: var(--text-primary);
    background: #ffffff;
    border: 1.5px solid var(--brand-default);
    border-radius: var(--radius-sm);
    outline: none;
    padding: 0.125rem var(--spacing-1);
    caret-color: var(--brand-default);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--brand-default) 12%, transparent);
  }

  :global([data-theme="dark"]) .cp__title-input {
    background: var(--color-neutral-800);
    color: var(--color-neutral-50);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--brand-default) 22%, transparent);
  }

  /* ── Subtitle ───────────────────────────────────────────── */

  .cp__subtitle-row {
    display: flex;
    align-items: center;
    min-width: 0;
  }

  .cp__subtitle-btn {
    display: inline-flex;
    align-items: center;
    max-width: 100%;
    min-width: 0;
    background: transparent;
    border: none;
    border-radius: var(--radius-sm);
    padding: 0;
    cursor: text;
    text-align: left;
  }

  .cp__subtitle-btn:disabled {
    cursor: default;
    pointer-events: none;
  }

  .cp__subtitle-text {
    font-size: var(--text-xs);
    color: var(--text-muted);
    line-height: 1.4;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 40ch;
  }

  :global([data-theme="dark"]) .cp__subtitle-text {
    color: var(--color-neutral-500);
  }

  .cp__subtitle-placeholder {
    font-size: var(--text-xs);
    color: var(--text-subtle);
    line-height: 1.4;
    opacity: 0;
    transition: opacity var(--duration-fast) var(--ease-default);
  }

  .cp__subtitle-btn:hover .cp__subtitle-placeholder {
    opacity: 1;
  }
  :global([data-theme="dark"]) .cp__subtitle-placeholder {
    color: var(--color-neutral-600);
  }

  .cp__subtitle-input {
    flex: 1;
    min-width: 0;
    width: 28ch;
    font-size: var(--text-xs);
    color: var(--text-primary);
    font-family: inherit;
    background: #ffffff;
    border: 1px solid var(--brand-default);
    border-radius: var(--radius-sm);
    outline: none;
    padding: 0.125rem var(--spacing-1);
    caret-color: var(--brand-default);
    box-shadow: 0 0 0 2px color-mix(in srgb, var(--brand-default) 12%, transparent);
  }

  :global([data-theme="dark"]) .cp__subtitle-input {
    background: var(--color-neutral-800);
    color: var(--color-neutral-100);
  }

  /* ── Header right ───────────────────────────────────────── */

  .cp__header-right {
    display: flex;
    align-items: center;
    gap: var(--spacing-1);
    flex-shrink: 0;
  }

  /* ══ Body ═════════════════════════════════════════════════ */

  .cp__body {
    flex: 1;
    overflow-y: auto;
    padding: var(--spacing-6) var(--spacing-6) var(--spacing-4);
    background: #ffffff;
    display: flex;
    flex-direction: column;
  }

  :global([data-theme="dark"]) .cp__body {
    background: var(--color-neutral-800);
  }
</style>
