<script lang="ts">
  import type { LlmBrandTypes } from "$lib/entities/llm";
  import { CardFolderAlt, CardChat } from "$lib/widgets";
  import { CreateFolder } from "$lib/features/folder";
  import { CreateChat, MessageInput } from "$lib/features/chat";
  import { goto } from "$app/navigation";
  import {
    folders,
    chats,
    moveFolder,
    moveChat,
    renameFolder,
    renameChat,
    createFolder,
    createChat,
    createChatWithMessage,
  } from "$lib/entities/workspace";

  let quickModel = $state<LlmBrandTypes | undefined>(undefined);

  function handleQuickSend(message: string) {
    const id = createChatWithMessage(message, quickModel);
    goto(`/workspace/chats/${id}`);
  }

  // ─── Drag ───────────────────────────────────────────────
  type DragType = "folder" | "chat";

  let draggingId = $state<string | null>(null);
  let draggingType = $state<DragType | null>(null);
  let dragOffset = { x: 0, y: 0 };
  let didDrag = false;

  function onMouseDown(e: MouseEvent, id: string, type: DragType) {
    e.preventDefault();
    didDrag = false;
    draggingId = id;
    draggingType = type;
    const items = type === "folder" ? folders : chats;
    const item = items.find((i) => i.id === id)!;
    dragOffset = { x: e.clientX - item.x, y: e.clientY - item.y };
  }

  function onMouseMove(e: MouseEvent) {
    if (!draggingId || !draggingType) return;
    didDrag = true;
    if (draggingType === "folder") {
      moveFolder(draggingId, e.clientX - dragOffset.x, e.clientY - dragOffset.y);
    } else {
      moveChat(draggingId, e.clientX - dragOffset.x, e.clientY - dragOffset.y);
    }
  }

  function onMouseUp() {
    draggingId = null;
    draggingType = null;
  }
</script>

<div
  class="workspace"
  onmousemove={onMouseMove}
  onmouseup={onMouseUp}
  onmouseleave={onMouseUp}
  role="none"
>
  {#each folders as folder (folder.id)}
    <div
      class="workspace__item"
      class:workspace__item--dragging={draggingId === folder.id}
      style:left="{folder.x}px"
      style:top="{folder.y}px"
      onmousedown={(e) => onMouseDown(e, folder.id, "folder")}
      onclick={() => {
        if (!didDrag) goto(`/workspace/folders/${folder.id}`);
      }}
      role="none"
    >
      <CardFolderAlt
        title={folder.title}
        llmBrands={folder.llmBrands}
        filesCount={folder.filesCount}
        collectionsCount={folder.collectionsCount}
        chatsCount={folder.chatsCount}
        onrename={(newTitle) => renameFolder(folder.id, newTitle)}
      />
    </div>
  {/each}

  {#each chats as chat (chat.id)}
    <div
      class="workspace__item"
      class:workspace__item--dragging={draggingId === chat.id}
      style:left="{chat.x}px"
      style:top="{chat.y}px"
      onmousedown={(e) => onMouseDown(e, chat.id, "chat")}
      onclick={() => {
        if (!didDrag) goto(`/workspace/chats/${chat.id}`);
      }}
      role="none"
    >
      <CardChat
        title={chat.title}
        model={chat.model}
        subtitle={chat.subtitle}
        onrename={(newTitle) => renameChat(chat.id, newTitle)}
      />
    </div>
  {/each}

  <!-- Quick-start floating card -->
  <div class="workspace__quick">
    <p class="workspace__quick-label">Start a new chat</p>
    <MessageInput
      variant="card"
      onsend={handleQuickSend}
      model={quickModel}
      onmodelchange={(m) => { quickModel = m; }}
    />
  </div>

  <div class="workspace__actions">
    <CreateChat onCreate={createChat} />
    <CreateFolder onCreate={createFolder} />
  </div>
</div>

<style>
  .workspace {
    position: relative;
    height: 100%;
    overflow: hidden;
    user-select: none;
  }

  .workspace__item {
    position: absolute;
    cursor: pointer;
  }

  .workspace__item:active {
    cursor: grab;
  }

  .workspace__item--dragging {
    cursor: grabbing;
    z-index: 10;
    opacity: 0.85;
  }

  /* ── Quick-start card ──────────────────────────────── */
  .workspace__quick {
    position: absolute;
    bottom: var(--spacing-8);
    left: 50%;
    transform: translateX(-50%);
    width: min(48rem, calc(100% - var(--spacing-16)));
    background: #ffffff;
    border: 1px solid var(--color-neutral-200);
    border-radius: var(--radius-xl);
    box-shadow:
      0 0 0 1px rgb(0 0 0 / 0.02),
      0 4px 8px -2px rgb(0 0 0 / 0.06),
      0 12px 28px -6px rgb(0 0 0 / 0.1),
      0 24px 48px -10px rgb(0 0 0 / 0.08);
    padding: var(--spacing-3) var(--spacing-4) var(--spacing-4);
    user-select: none;
    pointer-events: all;
  }

  :global([data-theme="dark"]) .workspace__quick {
    background: var(--color-neutral-800);
    border-color: var(--color-neutral-700);
    box-shadow:
      0 0 0 1px rgb(255 255 255 / 0.04),
      0 4px 8px -2px rgb(0 0 0 / 0.4),
      0 16px 32px -8px rgb(0 0 0 / 0.5);
  }

  .workspace__quick-label {
    margin: 0 0 var(--spacing-2) var(--spacing-1);
    font-size: var(--text-xs);
    font-weight: var(--font-weight-medium);
    color: var(--text-muted);
    user-select: none;
  }

  :global([data-theme="dark"]) .workspace__quick-label {
    color: var(--color-neutral-500);
  }

  .workspace__actions {
    position: absolute;
    bottom: var(--spacing-4);
    right: var(--spacing-4);
    display: flex;
    gap: var(--spacing-2);
  }
</style>
