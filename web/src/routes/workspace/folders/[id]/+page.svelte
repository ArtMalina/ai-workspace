<script lang="ts">
  import { page } from "$app/stores";
  import { MessageSquare } from "@lucide/svelte";
  import { ChatPanel, FolderSidebar } from "$lib/widgets";
  import { folders, renameFolder } from "$lib/entities/workspace";
  import type { LlmBrandTypes } from "$lib/entities/llm";

  const folder = $derived(folders.find((f) => f.id === $page.params.id));

  let activeModel = $state<LlmBrandTypes | undefined>(undefined);

  $effect(() => {
    if (folder && !activeModel) {
      activeModel = folder.llmBrands[0] as LlmBrandTypes | undefined;
    }
  });
</script>

<ChatPanel
  title={folder?.title ?? "Folder"}
  model={activeModel}
  onrename={folder ? (t) => renameFolder(folder.id, t) : undefined}
  onmodelchange={(m) => {
    activeModel = m;
  }}
  onsend={() => {}}
>
  <!-- Body: message list (empty state for now) -->
  {#if folder}
    <div class="fp__empty">
      <div class="fp__empty-icon-wrap">
        <MessageSquare class="fp__empty-icon" />
      </div>
      <p class="fp__empty-title">No messages yet</p>
      <p class="fp__empty-hint">Start a conversation in this folder</p>
    </div>
  {:else}
    <p class="fp__not-found">Folder not found</p>
  {/if}

  <!-- Sidebar -->
  {#snippet sidebar()}
    {#if folder}
      <FolderSidebar {folder} />
    {/if}
  {/snippet}
</ChatPanel>

<style>
  .fp__empty {
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
</style>
