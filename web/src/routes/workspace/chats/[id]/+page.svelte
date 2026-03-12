<script lang="ts">
  import { page } from "$app/stores";
  import { MessageSquare } from "@lucide/svelte";
  import { ChatPanel } from "$lib/widgets";
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
    <div class="pg__messages-empty">
      <div class="pg__empty-icon-wrap">
        <MessageSquare class="pg__empty-icon" />
      </div>
      <p class="pg__empty-title">No messages yet</p>
      <p class="pg__empty-hint">Type a message below to start the chat</p>
    </div>
  {:else}
    <div class="pg__not-found">
      <p>Chat not found</p>
    </div>
  {/if}
</ChatPanel>

<style>
  /* ── Empty state ──────────────────────────────────── */
  .pg__messages-empty {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-2);
    text-align: center;
    padding: var(--spacing-8) var(--spacing-4);
  }

  .pg__empty-icon-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 3rem;
    height: 3rem;
    border-radius: var(--radius-xl);
    background: var(--color-neutral-100);
    border: 1px solid var(--color-neutral-200);
    margin-bottom: var(--spacing-2);
  }

  :global([data-theme="dark"]) .pg__empty-icon-wrap {
    background: var(--color-neutral-700);
    border-color: var(--color-neutral-600);
  }

  :global(.pg__empty-icon) {
    width: 1.25rem;
    height: 1.25rem;
    color: var(--text-subtle);
  }

  .pg__empty-title {
    font-size: var(--text-sm);
    font-weight: var(--font-weight-medium);
    color: var(--text-secondary);
    margin: 0;
  }

  :global([data-theme="dark"]) .pg__empty-title {
    color: var(--color-neutral-400);
  }

  .pg__empty-hint {
    font-size: var(--text-xs);
    color: var(--text-muted);
    margin: 0;
  }

  :global([data-theme="dark"]) .pg__empty-hint {
    color: var(--color-neutral-500);
  }

  /* ── Not found ────────────────────────────────────── */
  .pg__not-found {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: var(--text-sm);
    color: var(--text-muted);
  }
</style>
