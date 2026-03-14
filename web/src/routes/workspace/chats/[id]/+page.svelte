<script lang="ts">
  import { page } from "$app/stores";
  import { LoaderCircle } from "@lucide/svelte";
  import { ChatPanel, MessageThread, MessageThreadAlt, chatViewState } from "$lib/widgets";
  import {
    chats,
    renameChat,
    updateChatSubtitle,
    updateChatModel,
    fetchChat,
  } from "$lib/entities/workspace";
  import type { ChatSession } from "$lib/entities/chat";

  const id = $derived($page.params.id as string | undefined);

  // chatShort is available immediately if workspace was already loaded
  const chatShort = $derived(id ? $chats.find((c) => c.id === id) : undefined);

  // ─── Full session — loaded on id change ──────────────────────────────────────
  let chatSession = $state<ChatSession | undefined>(undefined);
  let loading = $state(false);

  $effect(() => {
    const currentId = id;
    if (!currentId) {
      chatSession = undefined;
      return;
    }

    loading = true;
    fetchChat(currentId)
      .then((session) => {
        if (id === currentId) chatSession = session;
      })
      .finally(() => {
        if (id === currentId) loading = false;
      });
  });

  // Prefer session data (authoritative) — fall back to chatShort (optimistic)
  const title = $derived(chatSession?.title ?? chatShort?.title ?? "Chat");
  const model = $derived(chatSession?.model ?? chatShort?.model);
  const subtitle = $derived(chatSession?.subtitle ?? chatShort?.subtitle);
</script>

<ChatPanel
  {title}
  {model}
  {subtitle}
  onrename={chatShort ? (t) => renameChat(chatShort.id, t) : undefined}
  onsubtitle={chatShort ? (s) => updateChatSubtitle(chatShort.id, s) : undefined}
  onmodelchange={chatShort ? (m) => updateChatModel(chatShort.id, m) : undefined}
>
  {#if loading}
    <div class="cp__loading" aria-label="Loading chat">
      <LoaderCircle size={20} class="cp__loading-icon" />
    </div>
  {:else if chatSession}
    {#if chatViewState.mode === "alt"}
      <MessageThreadAlt messages={chatSession.messages} {model} />
    {:else}
      <MessageThread messages={chatSession.messages} {model} />
    {/if}
  {:else}
    <p class="cp__not-found">Chat not found</p>
  {/if}
</ChatPanel>

<style>
  .cp__not-found {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: var(--text-sm);
    color: var(--text-muted);
  }

  /* ── Loading state ────────────────────────────────────── */
  .cp__loading {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-muted);
  }

  :global(.cp__loading-icon) {
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
</style>
