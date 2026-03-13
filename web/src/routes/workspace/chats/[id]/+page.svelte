<script lang="ts">
  import { page } from "$app/stores";
  import { ChatPanel, MessageThread } from "$lib/widgets";
  import { chats, renameChat, updateChatSubtitle, updateChatModel } from "$lib/entities/workspace";

  const chat = $derived(chats.find((c) => c.id === $page.params.id));
</script>

<ChatPanel
  title={chat?.title ?? "Chat"}
  model={chat?.model}
  subtitle={chat?.subtitle}
  onrename={chat ? (t) => renameChat(chat.id, t) : undefined}
  onsubtitle={chat ? (s) => updateChatSubtitle(chat.id, s) : undefined}
  onmodelchange={chat ? (m) => updateChatModel(chat.id, m) : undefined}
>
  {#if chat}
    <MessageThread messages={chat.messages} model={chat.model} />
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
