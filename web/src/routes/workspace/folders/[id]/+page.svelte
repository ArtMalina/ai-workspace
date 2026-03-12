<script lang="ts">
  import { page } from "$app/stores";
  import { FileText, Layers, MessageSquare } from "@lucide/svelte";
  import { WorkspacePanel } from "$lib/widgets";
  import { LlmBrandIcon } from "$lib/features/llm-brand-icon";
  import { folders, renameFolder } from "$lib/entities/workspace";

  const folder = $derived(folders.find((f) => f.id === $page.params.id));

  const brandLabels: Record<string, string> = {
    openai: "ChatGPT",
    claude: "Claude",
    qwen: "Qwen",
    llama: "Llama",
    mistral: "Mistral",
  };
</script>

<WorkspacePanel
  title={folder?.title ?? "Folder"}
  onrename={folder ? (t) => renameFolder(folder.id, t) : undefined}
>
  {#if folder}
    <!-- Models -->
    <section class="fp__section">
      <h3 class="fp__section-heading">Models</h3>
      {#if folder.llmBrands.length > 0}
        <div class="fp__brands">
          {#each folder.llmBrands as brand (brand)}
            <div class="fp__brand-chip">
              <LlmBrandIcon {brand} />
              <span>{brandLabels[brand] ?? brand}</span>
            </div>
          {/each}
        </div>
      {:else}
        <p class="fp__empty">No models assigned yet</p>
      {/if}
    </section>

    <!-- Resources -->
    <section class="fp__section">
      <h3 class="fp__section-heading">Resources</h3>
      <div class="fp__stats">
        <div class="fp__stat">
          <div class="fp__stat-icon-wrap">
            <MessageSquare class="fp__stat-icon" />
          </div>
          <span class="fp__stat-name">Chats</span>
          <span class="fp__stat-value">{folder.chatsCount}</span>
        </div>
        <div class="fp__stat">
          <div class="fp__stat-icon-wrap">
            <FileText class="fp__stat-icon" />
          </div>
          <span class="fp__stat-name">Files</span>
          <span class="fp__stat-value">{folder.filesCount}</span>
        </div>
        <div class="fp__stat">
          <div class="fp__stat-icon-wrap">
            <Layers class="fp__stat-icon" />
          </div>
          <span class="fp__stat-name">Collections</span>
          <span class="fp__stat-value">{folder.collectionsCount}</span>
        </div>
      </div>
    </section>
  {:else}
    <div class="fp__not-found">
      <p>Folder not found</p>
    </div>
  {/if}
</WorkspacePanel>

<style>
  /* ── Section ──────────────────────────────────────── */
  .fp__section {
    margin-bottom: var(--spacing-8);
  }

  .fp__section-heading {
    display: flex;
    align-items: center;
    gap: var(--spacing-3);
    margin: 0 0 var(--spacing-3);
    font-size: var(--text-xs);
    font-weight: var(--font-weight-semibold);
    color: var(--text-subtle);
    text-transform: uppercase;
    letter-spacing: 0.07em;
  }

  .fp__section-heading::after {
    content: "";
    flex: 1;
    height: 1px;
    background: var(--border-default);
  }

  :global([data-theme="dark"]) .fp__section-heading {
    color: var(--color-neutral-500);
  }

  :global([data-theme="dark"]) .fp__section-heading::after {
    background: var(--color-neutral-700);
  }

  /* ── Brands ───────────────────────────────────────── */
  .fp__brands {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-2);
  }

  .fp__brand-chip {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.375rem var(--spacing-3);
    font-size: var(--text-xs);
    font-weight: var(--font-weight-medium);
    color: var(--text-secondary);
    background: var(--surface-overlay);
    border: 1px solid var(--border-default);
    border-radius: var(--radius-full);
    transition:
      background var(--duration-fast) var(--ease-default),
      border-color var(--duration-fast) var(--ease-default);
  }

  :global([data-theme="dark"]) .fp__brand-chip {
    background: var(--color-neutral-700);
    border-color: var(--color-neutral-600);
    color: var(--color-neutral-300);
  }

  .fp__empty {
    font-size: var(--text-sm);
    color: var(--text-muted);
    margin: 0;
  }

  /* ── Stats ────────────────────────────────────────── */
  .fp__stats {
    display: flex;
    flex-direction: column;
    gap: 2px;
    border-radius: var(--radius-lg);
    overflow: hidden;
    border: 1px solid var(--border-default);
  }

  :global([data-theme="dark"]) .fp__stats {
    border-color: var(--color-neutral-700);
  }

  .fp__stat {
    display: flex;
    align-items: center;
    gap: var(--spacing-3);
    padding: var(--spacing-3) var(--spacing-4);
    background: var(--surface-overlay);
  }

  :global([data-theme="dark"]) .fp__stat {
    background: var(--color-neutral-700);
  }

  .fp__stat-icon-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.75rem;
    height: 1.75rem;
    border-radius: var(--radius-md);
    background: var(--surface-card);
    flex-shrink: 0;
  }

  :global([data-theme="dark"]) .fp__stat-icon-wrap {
    background: var(--color-neutral-800);
  }

  :global(.fp__stat-icon) {
    width: 0.875rem;
    height: 0.875rem;
    color: var(--text-subtle);
  }

  .fp__stat-name {
    flex: 1;
    font-size: var(--text-sm);
    color: var(--text-secondary);
  }

  :global([data-theme="dark"]) .fp__stat-name {
    color: var(--color-neutral-400);
  }

  .fp__stat-value {
    font-size: var(--text-sm);
    font-weight: var(--font-weight-semibold);
    color: var(--text-primary);
    font-variant-numeric: tabular-nums;
    min-width: 1.5rem;
    text-align: right;
  }

  /* ── Not found ────────────────────────────────────── */
  .fp__not-found {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 8rem;
    font-size: var(--text-sm);
    color: var(--text-muted);
  }
</style>
