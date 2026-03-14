<script lang="ts">
  import { page } from "$app/stores";
  import { Loader2 } from "@lucide/svelte";
  import {
    ChatPanel,
    FolderSidebar,
    MessageThread,
    MessageThreadAlt,
    chatViewState,
  } from "$lib/widgets";
  import { folders, renameFolder, fetchFolder, fetchChat } from "$lib/entities/workspace";
  import type { ChatShort, ChatSession } from "$lib/entities/chat";
  import type { LlmBrandTypes } from "$lib/entities/llm";

  const id = $derived($page.params.id as string | undefined);
  const folder = $derived(id ? $folders.find((f) => f.id === id) : undefined);

  // ─── Loading — reacts to id changes (navigation between folders) ─────────────
  let loading = $state(false);

  $effect(() => {
    const currentId = id;
    if (!currentId) return;

    loading = true;
    fetchFolder(currentId).finally(() => {
      // Guard: ignore stale response if id changed while awaiting
      if (id === currentId) loading = false;
    });
  });

  // ─── Active chat — ID is the source of truth ─────────────────────────────────
  let activeFolderChatId = $state<string | undefined>(undefined);

  // Derived: full ChatShort object for the active ID
  const activeFolderChat = $derived<ChatShort | undefined>(
    folder?.chats.find((c) => c.id === activeFolderChatId),
  );

  // Sync: when folder changes, keep the ID valid or fall back to first chat
  $effect(() => {
    if (folder) {
      const valid = folder.chats.some((c) => c.id === activeFolderChatId);
      if (!valid) activeFolderChatId = folder.chats[0]?.id;
    }
  });

  // ─── Active chat session — full session with messages ────────────────────────
  let activeChatSession = $state<ChatSession | undefined>(undefined);
  let loadingChat = $state(false);

  $effect(() => {
    const chatId = activeFolderChatId;
    if (!chatId) {
      activeChatSession = undefined;
      return;
    }

    loadingChat = true;
    fetchChat(chatId).then((session) => {
      // Guard: ignore stale response if selection changed while awaiting
      if (activeFolderChatId === chatId) activeChatSession = session;
    }).finally(() => {
      if (activeFolderChatId === chatId) loadingChat = false;
    });
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
  {#if loading}
    <div class="fp__loading" aria-label="Loading folder">
      <Loader2 size={20} class="fp__loading-icon" />
    </div>
  {:else if folder}
    {#if loadingChat}
      <div class="fp__loading" aria-label="Loading chat">
        <Loader2 size={20} class="fp__loading-icon" />
      </div>
    {:else if chatViewState.mode === "alt"}
      <MessageThreadAlt messages={activeChatSession?.messages} model={activeModel} />
    {:else}
      <MessageThread messages={activeChatSession?.messages} model={activeModel} />
    {/if}
  {:else}
    <p class="fp__not-found">Folder not found</p>
  {/if}

  {#snippet sidebar()}
    <FolderSidebar
      {folder}
      {loading}
      activeChatId={activeFolderChat?.id}
      onchatselect={(c) => {
        activeFolderChatId = c.id;
      }}
    />
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

  /* ── Loading state ────────────────────────────────────── */
  .fp__loading {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-muted);
  }

  :global(.fp__loading-icon) {
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
</style>
