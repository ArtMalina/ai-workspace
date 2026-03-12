<script lang="ts">
  import { page } from "$app/stores";
  import { ChatPanel, FolderSidebar, MessageThread } from "$lib/widgets";
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
  {#if folder}
    <MessageThread model={activeModel} />
  {:else}
    <p class="fp__not-found">Folder not found</p>
  {/if}

  {#snippet sidebar()}
    {#if folder}
      <FolderSidebar {folder} />
    {/if}
  {/snippet}
</ChatPanel>

<style>
  .fp__not-found {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: var(--text-sm);
    color: var(--text-muted);
  }
</style>
