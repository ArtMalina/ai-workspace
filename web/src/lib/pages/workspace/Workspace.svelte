<script lang="ts">
  import { CardFolderAlt, CardChat } from "$lib/widgets";
  import { CreateFolder } from "$lib/features/folder";
  import { CreateChat } from "$lib/features/chat";
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
  } from "$lib/entities/workspace";

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

  .workspace__actions {
    position: absolute;
    bottom: var(--spacing-4);
    right: var(--spacing-4);
    display: flex;
    gap: var(--spacing-2);
  }
</style>
