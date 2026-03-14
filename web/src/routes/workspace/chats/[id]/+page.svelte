<script lang="ts">
  import { page } from "$app/stores";
  import { ChatPanel, MessageThread, MessageThreadAlt, chatViewState } from "$lib/widgets";
  import { chats, renameChat, updateChatSubtitle, updateChatModel } from "$lib/entities/workspace";
  import type { ChatSession, fetchChatSession } from "$lib/entities/chat";

  const chatShort = $derived($chats.find((c) => c.id === $page.params.id));
  const chat = $state<ChatSession>();
</script>

<ChatPanel
  title={chatShort?.title ?? "Chat"}
  model={chatShort?.model}
  subtitle={chatShort?.subtitle}
  onrename={chatShort ? (t) => renameChat(chatShort.id, t) : undefined}
  onsubtitle={chatShort ? (s) => updateChatSubtitle(chatShort.id, s) : undefined}
  onmodelchange={chatShort ? (m) => updateChatModel(chatShort.id, m) : undefined}
>
  {#if chat}
    {#if chatViewState.mode === "alt"}
      <MessageThreadAlt messages={chat.messages} model={chat.model} />
    {:else}
      <MessageThread messages={chat.messages} model={chat.model} />
    {/if}
  {:else}
    <div class="pg__not-found"><p>Chat not found</p></div>
  {/if}
</ChatPanel>

<style>
  .pg__not-found {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: var(--text-sm);
    color: var(--text-muted);
  }
</style>
