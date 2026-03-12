<script lang="ts">
  import { page } from "$app/stores";
  import { FileText, Layers, MessageSquare, FolderOpen } from "@lucide/svelte";
  import { ChatPanel } from "$lib/widgets";
  import { LlmIcon } from "$lib/shared/ui";
  import { folders, renameFolder } from "$lib/entities/workspace";
  import type { LlmBrandTypes } from "$lib/entities/llm";

  const folder = $derived(folders.find((f) => f.id === $page.params.id));

  let activeModel = $state<LlmBrandTypes | undefined>(undefined);

  $effect(() => {
    if (folder && !activeModel) {
      activeModel = folder.llmBrands[0] as LlmBrandTypes | undefined;
    }
  });

  const brandLabels: Record<string, string> = {
    openai: "ChatGPT",
    claude: "Claude",
    qwen:   "Qwen",
    llama:  "Llama",
    mistral:"Mistral",
  };
</script>

<ChatPanel
  title={folder?.title ?? "Folder"}
  model={activeModel}
  onrename={folder ? (t) => renameFolder(folder.id, t) : undefined}
  onmodelchange={(m) => { activeModel = m; }}
  onsend={() => {}}
>

  <!-- ── Main body: messages ──────────────────────────────── -->
  {#if folder}
    <div class="fp__empty-state">
      <div class="fp__empty-icon-wrap">
        <MessageSquare class="fp__empty-icon" />
      </div>
      <p class="fp__empty-title">No messages yet</p>
      <p class="fp__empty-hint">Start a conversation in this folder</p>
    </div>
  {:else}
    <div class="fp__not-found"><p>Folder not found</p></div>
  {/if}

  <!-- ── Sidebar ───────────────────────────────────────────── -->
  {#snippet sidebar()}
    {#if folder}
      <div class="fps__inner">

        <!-- Header -->
        <div class="fps__header">
          <div class="fps__header-icon">
            <FolderOpen class="fps__folder-icon" />
          </div>
          <span class="fps__header-title">{folder.title}</span>
        </div>

        <!-- Models section -->
        <section class="fps__section">
          <h4 class="fps__section-label">Models</h4>
          {#if folder.llmBrands.length > 0}
            <div class="fps__brands">
              {#each folder.llmBrands as brand (brand)}
                <div class="fps__brand-chip">
                  <LlmIcon {brand} size={13} class="fps__brand-svg" />
                  <span>{brandLabels[brand] ?? brand}</span>
                </div>
              {/each}
            </div>
          {:else}
            <p class="fps__empty-text">No models assigned</p>
          {/if}
        </section>

        <!-- Stats section -->
        <section class="fps__section">
          <h4 class="fps__section-label">Contents</h4>
          <div class="fps__stats">
            <div class="fps__stat">
              <div class="fps__stat-icon-wrap">
                <MessageSquare class="fps__stat-icon" />
              </div>
              <span class="fps__stat-name">Chats</span>
              <span class="fps__stat-val">{folder.chatsCount}</span>
            </div>
            <div class="fps__stat">
              <div class="fps__stat-icon-wrap">
                <FileText class="fps__stat-icon" />
              </div>
              <span class="fps__stat-name">Files</span>
              <span class="fps__stat-val">{folder.filesCount}</span>
            </div>
            <div class="fps__stat">
              <div class="fps__stat-icon-wrap">
                <Layers class="fps__stat-icon" />
              </div>
              <span class="fps__stat-name">Collections</span>
              <span class="fps__stat-val">{folder.collectionsCount}</span>
            </div>
          </div>
        </section>

      </div>
    {/if}
  {/snippet}

</ChatPanel>

<style>
  /* ── Messages empty state ───────────────────────────────── */
  .fp__empty-state {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-2);
    text-align: center;
    padding: var(--spacing-8);
    min-height: 12rem;
  }

  .fp__empty-icon-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 3rem;
    height: 3rem;
    border-radius: var(--radius-xl);
    background: var(--color-neutral-100);
    margin-bottom: var(--spacing-2);
  }

  :global([data-theme="dark"]) .fp__empty-icon-wrap {
    background: var(--color-neutral-700);
  }

  :global(.fp__empty-icon) {
    width: 1.25rem;
    height: 1.25rem;
    color: var(--text-subtle);
  }

  .fp__empty-title {
    margin: 0;
    font-size: var(--text-sm);
    font-weight: var(--font-weight-medium);
    color: var(--text-secondary);
  }

  :global([data-theme="dark"]) .fp__empty-title {
    color: var(--color-neutral-400);
  }

  .fp__empty-hint {
    margin: 0;
    font-size: var(--text-xs);
    color: var(--text-muted);
    max-width: 22ch;
    line-height: 1.5;
  }

  :global([data-theme="dark"]) .fp__empty-hint {
    color: var(--color-neutral-500);
  }

  .fp__not-found {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: var(--text-sm);
    color: var(--text-muted);
  }

  /* ══ Sidebar inner ════════════════════════════════════════ */

  .fps__inner {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  /* ── Sidebar header ─────────────────────────────────────── */

  .fps__header {
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

  :global([data-theme="dark"]) .fps__header {
    background: var(--color-neutral-900);
    border-bottom-color: var(--color-neutral-700);
  }

  .fps__header-icon {
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

  :global([data-theme="dark"]) .fps__header-icon {
    background: var(--color-neutral-800);
    border-color: var(--color-neutral-700);
  }

  :global(.fps__folder-icon) {
    width: 1rem;
    height: 1rem;
  }

  .fps__header-title {
    font-size: var(--text-sm);
    font-weight: var(--font-weight-semibold);
    color: var(--text-primary);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* ── Sections ───────────────────────────────────────────── */

  .fps__section {
    padding: var(--spacing-4) var(--spacing-4) 0;
  }

  .fps__section + .fps__section {
    margin-top: var(--spacing-4);
  }

  .fps__section-label {
    margin: 0 0 var(--spacing-2);
    font-size: var(--text-xs);
    font-weight: var(--font-weight-semibold);
    color: var(--text-subtle);
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  :global([data-theme="dark"]) .fps__section-label {
    color: var(--color-neutral-500);
  }

  .fps__empty-text {
    margin: 0;
    font-size: var(--text-xs);
    color: var(--text-muted);
  }

  /* ── Model chips ────────────────────────────────────────── */

  .fps__brands {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-2);
  }

  .fps__brand-chip {
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

  :global([data-theme="dark"]) .fps__brand-chip {
    background: var(--color-neutral-700);
    border-color: var(--color-neutral-600);
    color: var(--color-neutral-300);
  }

  :global(.fps__brand-svg) {
    width: 0.8125rem;
    height: 0.8125rem;
    flex-shrink: 0;
  }

  /* ── Stats list ─────────────────────────────────────────── */

  .fps__stats {
    display: flex;
    flex-direction: column;
    gap: 2px;
    border-radius: var(--radius-lg);
    overflow: hidden;
    border: 1px solid var(--color-neutral-200);
  }

  :global([data-theme="dark"]) .fps__stats {
    border-color: var(--color-neutral-700);
  }

  .fps__stat {
    display: flex;
    align-items: center;
    gap: var(--spacing-3);
    padding: var(--spacing-2) var(--spacing-3);
    background: var(--color-neutral-50);
  }

  :global([data-theme="dark"]) .fps__stat {
    background: var(--color-neutral-700);
  }

  .fps__stat-icon-wrap {
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

  :global([data-theme="dark"]) .fps__stat-icon-wrap {
    background: var(--color-neutral-800);
    border-color: var(--color-neutral-600);
  }

  :global(.fps__stat-icon) {
    width: 0.75rem;
    height: 0.75rem;
    color: var(--text-subtle);
  }

  .fps__stat-name {
    flex: 1;
    font-size: var(--text-xs);
    color: var(--text-secondary);
  }

  :global([data-theme="dark"]) .fps__stat-name {
    color: var(--color-neutral-400);
  }

  .fps__stat-val {
    font-size: var(--text-xs);
    font-weight: var(--font-weight-semibold);
    color: var(--text-primary);
    font-variant-numeric: tabular-nums;
    min-width: 1.5rem;
    text-align: right;
  }

  :global([data-theme="dark"]) .fps__stat-val {
    color: var(--color-neutral-200);
  }
</style>
