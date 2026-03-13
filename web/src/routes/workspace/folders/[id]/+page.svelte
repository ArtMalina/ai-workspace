<script lang="ts">
  import { page } from "$app/stores";
  import { ChatPanel, FolderSidebar, MessageThreadAlt } from "$lib/widgets";
  import { folders, renameFolder, type FolderChat } from "$lib/entities/workspace";
  import type { LlmBrandTypes } from "$lib/entities/llm";

  const folder = $derived(folders.find((f) => f.id === $page.params.id));

  // Active chat inside the folder (defaults to first chat)
  let activeFolderChat = $state<FolderChat | undefined>(undefined);

  $effect(() => {
    if (folder) {
      // If activeFolderChat is gone (deleted/removed), reset to first
      const still = folder.chats.find((c) => c.id === activeFolderChat?.id);
      activeFolderChat = still ?? folder.chats[0];
    }
  });

  const activeModel = $derived<LlmBrandTypes | undefined>(
    activeFolderChat?.model ?? (folder?.llmBrands[0] as LlmBrandTypes | undefined),
  );
</script>

<ChatPanel
  title={activeFolderChat?.title ?? folder?.title ?? "Folder"}
  model={activeModel}
  onrename={folder ? (t) => renameFolder(folder.id, t) : undefined}
  onsend={() => {}}
>
  {#if folder}
    <MessageThreadAlt messages={activeFolderChat?.messages} model={activeModel} />
  {:else}
    <p class="fp__not-found">Folder not found</p>
  {/if}

  {#snippet sidebar()}
    {#if folder}
      <FolderSidebar
        {folder}
        activeChatId={activeFolderChat?.id}
        onchatselect={(c) => { activeFolderChat = c; }}
        onrename={(t) => renameFolder(folder.id, t)}
      />
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
