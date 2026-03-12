<script lang="ts">
  import { FolderOpen, MessageSquare, FileText, Layers } from "@lucide/svelte";
  import { LlmIcon } from "$lib/shared/ui";
  import type { FolderItem } from "$lib/entities/workspace";

  interface Props {
    folder: FolderItem;
  }

  const { folder }: Props = $props();

  const BRAND_LABELS: Record<string, string> = {
    openai: "ChatGPT",
    claude: "Claude",
    qwen: "Qwen",
    llama: "Llama",
    mistral: "Mistral",
  };

  const stats = $derived([
    { label: "Chats", value: folder.chatsCount, Icon: MessageSquare },
    { label: "Files", value: folder.filesCount, Icon: FileText },
    { label: "Collections", value: folder.collectionsCount, Icon: Layers },
  ]);
</script>

<div class="fs">
  <!-- Header -->
  <div class="fs__header">
    <div class="fs__header-icon">
      <FolderOpen class="fs__folder-svg" />
    </div>
    <span class="fs__header-title">{folder.title}</span>
  </div>

  <!-- Models -->
  <section class="fs__section">
    <h4 class="fs__section-label">Models</h4>
    {#if folder.llmBrands.length > 0}
      <div class="fs__brands">
        {#each folder.llmBrands as brand (brand)}
          <div class="fs__brand-chip">
            <LlmIcon {brand} size={13} class="fs__brand-svg" />
            <span>{BRAND_LABELS[brand] ?? brand}</span>
          </div>
        {/each}
      </div>
    {:else}
      <p class="fs__muted">No models assigned</p>
    {/if}
  </section>

  <!-- Contents stats -->
  <section class="fs__section">
    <h4 class="fs__section-label">Contents</h4>
    <div class="fs__stats">
      {#each stats as s (s.label)}
        <div class="fs__stat">
          <div class="fs__stat-icon-wrap">
            <s.Icon class="fs__stat-icon" />
          </div>
          <span class="fs__stat-name">{s.label}</span>
          <span class="fs__stat-val">{s.value}</span>
        </div>
      {/each}
    </div>
  </section>
</div>

<style>
  /* ── Shell ─────────────────────────────────────────── */
  .fs {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  /* ── Header ────────────────────────────────────────── */
  .fs__header {
    display: flex;
    align-items: center;
    gap: var(--spacing-3);
    padding: var(--spacing-3) var(--spacing-4);
    min-height: 4rem;
    flex-shrink: 0;
    background: var(--color-neutral-50);
    border-bottom: 1px solid var(--color-neutral-200);
    border-radius: var(--radius-xl) var(--radius-xl) 0 0;
  }

  :global([data-theme="dark"]) .fs__header {
    background: var(--color-neutral-900);
    border-bottom-color: var(--color-neutral-700);
  }

  .fs__header-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 2rem;
    height: 2rem;
    border-radius: var(--radius-md);
    background: var(--color-neutral-100);
    border: 1px solid var(--color-neutral-200);
    color: var(--text-muted);
  }

  :global([data-theme="dark"]) .fs__header-icon {
    background: var(--color-neutral-800);
    border-color: var(--color-neutral-700);
  }

  :global(.fs__folder-svg) {
    width: 1rem;
    height: 1rem;
  }

  .fs__header-title {
    flex: 1;
    min-width: 0;
    font-size: var(--text-sm);
    font-weight: var(--font-weight-semibold);
    color: var(--text-primary);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* ── Sections ──────────────────────────────────────── */
  .fs__section {
    padding: var(--spacing-4) var(--spacing-4) 0;
  }

  .fs__section + .fs__section {
    margin-top: var(--spacing-4);
  }

  .fs__section-label {
    margin: 0 0 var(--spacing-2);
    font-size: var(--text-xs);
    font-weight: var(--font-weight-semibold);
    color: var(--text-subtle);
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  :global([data-theme="dark"]) .fs__section-label {
    color: var(--color-neutral-500);
  }

  .fs__muted {
    margin: 0;
    font-size: var(--text-xs);
    color: var(--text-muted);
  }

  /* ── Model chips ───────────────────────────────────── */
  .fs__brands {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-2);
  }

  .fs__brand-chip {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    padding: 0.25rem var(--spacing-3);
    font-size: var(--text-xs);
    font-weight: var(--font-weight-medium);
    color: var(--text-secondary);
    background: var(--color-neutral-50);
    border: 1px solid var(--color-neutral-200);
    border-radius: var(--radius-full);
  }

  :global([data-theme="dark"]) .fs__brand-chip {
    background: var(--color-neutral-700);
    border-color: var(--color-neutral-600);
    color: var(--color-neutral-300);
  }

  :global(.fs__brand-svg) {
    width: 0.8125rem;
    height: 0.8125rem;
    flex-shrink: 0;
  }

  /* ── Stats ─────────────────────────────────────────── */
  .fs__stats {
    display: flex;
    flex-direction: column;
    gap: 2px;
    border-radius: var(--radius-lg);
    overflow: hidden;
    border: 1px solid var(--color-neutral-200);
  }

  :global([data-theme="dark"]) .fs__stats {
    border-color: var(--color-neutral-700);
  }

  .fs__stat {
    display: flex;
    align-items: center;
    gap: var(--spacing-3);
    padding: var(--spacing-2) var(--spacing-3);
    background: var(--color-neutral-50);
  }

  :global([data-theme="dark"]) .fs__stat {
    background: var(--color-neutral-700);
  }

  .fs__stat-icon-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.5rem;
    height: 1.5rem;
    border-radius: var(--radius-sm);
    background: #ffffff;
    border: 1px solid var(--color-neutral-200);
    flex-shrink: 0;
  }

  :global([data-theme="dark"]) .fs__stat-icon-wrap {
    background: var(--color-neutral-800);
    border-color: var(--color-neutral-600);
  }

  :global(.fs__stat-icon) {
    width: 0.75rem;
    height: 0.75rem;
    color: var(--text-subtle);
  }

  .fs__stat-name {
    flex: 1;
    font-size: var(--text-xs);
    color: var(--text-secondary);
  }

  :global([data-theme="dark"]) .fs__stat-name {
    color: var(--color-neutral-400);
  }

  .fs__stat-val {
    font-size: var(--text-xs);
    font-weight: var(--font-weight-semibold);
    color: var(--text-primary);
    font-variant-numeric: tabular-nums;
    min-width: 1.5rem;
    text-align: right;
  }

  :global([data-theme="dark"]) .fs__stat-val {
    color: var(--color-neutral-200);
  }
</style>
