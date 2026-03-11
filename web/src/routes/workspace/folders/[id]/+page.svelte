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
    <!-- LLM brands -->
    <div class="fp__section">
      <p class="fp__section-label">Models</p>
      {#if folder.llmBrands.length > 0}
        <div class="fp__brands">
          {#each folder.llmBrands as brand (brand)}
            <div class="fp__brand-chip">
              <span class="fp__brand-icon"><LlmBrandIcon {brand} size={14} /></span>
              <span class="fp__brand-label">{brandLabels[brand] ?? brand}</span>
            </div>
          {/each}
        </div>
      {:else}
        <p class="fp__empty">No models yet</p>
      {/if}
    </div>

    <div class="fp__divider"></div>

    <!-- Stats -->
    <div class="fp__section">
      <p class="fp__section-label">Resources</p>
      <div class="fp__stats">
        <div class="fp__stat">
          <MessageSquare class="fp__stat-icon" />
          <span class="fp__stat-name">Chats</span>
          <span class="fp__stat-value">{folder.chatsCount}</span>
        </div>
        <div class="fp__stat">
          <FileText class="fp__stat-icon" />
          <span class="fp__stat-name">Files</span>
          <span class="fp__stat-value">{folder.filesCount}</span>
        </div>
        <div class="fp__stat">
          <Layers class="fp__stat-icon" />
          <span class="fp__stat-name">Collections</span>
          <span class="fp__stat-value">{folder.collectionsCount}</span>
        </div>
      </div>
    </div>
  {:else}
    <p class="fp__not-found">Folder not found</p>
  {/if}
</WorkspacePanel>

<style>
  .fp__section {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-2);
    margin-bottom: var(--spacing-4);
  }

  .fp__section-label {
    font-size: var(--text-xs);
    font-weight: var(--font-weight-medium);
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin: 0;
  }

  .fp__brands {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-2);
  }

  .fp__brand-chip {
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-1-5);
    padding: var(--spacing-1) var(--spacing-2-5);
    background: var(--surface-elevated);
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius-full);
  }

  .fp__brand-icon {
    display: flex;
    align-items: center;
  }

  .fp__brand-label {
    font-size: var(--text-xs);
    font-weight: var(--font-weight-medium);
    color: var(--text-secondary);
  }

  .fp__empty {
    font-size: var(--text-xs);
    color: var(--text-muted);
    margin: 0;
  }

  .fp__divider {
    height: 1px;
    background: var(--border-subtle);
    margin: 0 calc(-1 * var(--spacing-4));
    margin-bottom: var(--spacing-4);
  }

  .fp__stats {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-1);
  }

  .fp__stat {
    display: flex;
    align-items: center;
    gap: var(--spacing-2-5);
    padding: var(--spacing-2) var(--spacing-3);
    border-radius: var(--radius-md);
    background: var(--surface-elevated);
  }

  :global(.fp__stat-icon) {
    width: 1rem;
    height: 1rem;
    color: var(--text-muted);
    flex-shrink: 0;
  }

  .fp__stat-name {
    flex: 1;
    font-size: var(--text-sm);
    color: var(--text-secondary);
  }

  .fp__stat-value {
    font-size: var(--text-sm);
    font-weight: var(--font-weight-semibold);
    color: var(--text-primary);
    font-variant-numeric: tabular-nums;
  }

  .fp__not-found {
    font-size: var(--text-sm);
    color: var(--text-muted);
    text-align: center;
    padding: var(--spacing-8) 0;
    margin: 0;
  }
</style>
