<script lang="ts">
  import { CardFolder, CardChat } from "$lib/widgets";
  import { CreateFolder } from "$lib/features/folder";
  import { CreateChat } from "$lib/features/chat";
  import type { LlmBrandTypes } from "$lib/entities/llm";

  interface FolderItem {
    id: string;
    title: string;
    llmBrand?: LlmBrandTypes;
    description: string;
    x: number;
    y: number;
  }

  interface ChatItem {
    id: string;
    title: string;
    model?: LlmBrandTypes;
    subtitle?: string;
    x: number;
    y: number;
  }

  let folders = $state<FolderItem[]>([
    {
      id: crypto.randomUUID(),
      title: "Ideas",
      description: "2 chats",
      llmBrand: "openai",
      x: 40,
      y: 48,
    },
    {
      id: crypto.randomUUID(),
      title: "Project Alpha",
      description: "12 files, 2 collections",
      llmBrand: "claude",
      x: 320,
      y: 48,
    },
    {
      id: crypto.randomUUID(),
      title: "Finance Reports",
      description: "4 files, 3 collections",
      llmBrand: "llama",
      x: 320,
      y: 208,
    },
  ]);

  let chats = $state<ChatItem[]>([
    {
      id: crypto.randomUUID(),
      title: "Draft email",
      model: "claude",
      x: 40,
      y: 208,
    },
    {
      id: crypto.randomUUID(),
      title: "Code review",
      model: "openai",
      x: 600,
      y: 48,
    },
    {
      id: crypto.randomUUID(),
      title: "Translate article",
      model: "qwen",
      x: 600,
      y: 180,
    },
  ]);

  // ─── Drag ───────────────────────────────────────────────
  type DragType = "folder" | "chat";

  let draggingId = $state<string | null>(null);
  let draggingType = $state<DragType | null>(null);
  // non-reactive — used only during drag calculations
  let dragOffset = { x: 0, y: 0 };

  function onMouseDown(e: MouseEvent, id: string, type: DragType) {
    e.preventDefault();
    draggingId = id;
    draggingType = type;
    const items = type === "folder" ? folders : chats;
    const item = items.find((i) => i.id === id)!;
    dragOffset = { x: e.clientX - item.x, y: e.clientY - item.y };
  }

  function onMouseMove(e: MouseEvent) {
    if (!draggingId || !draggingType) return;
    const items = draggingType === "folder" ? folders : chats;
    const idx = items.findIndex((i) => i.id === draggingId);
    if (idx === -1) return;
    items[idx].x = e.clientX - dragOffset.x;
    items[idx].y = e.clientY - dragOffset.y;
  }

  function onMouseUp() {
    draggingId = null;
    draggingType = null;
  }

  // ─── Mutations ──────────────────────────────────────────
  function renameFolder(id: string, newTitle: string) {
    const idx = folders.findIndex((f) => f.id === id);
    if (idx !== -1) folders[idx].title = newTitle;
  }

  function renameChat(id: string, newTitle: string) {
    const idx = chats.findIndex((c) => c.id === id);
    if (idx !== -1) chats[idx].title = newTitle;
  }

  function createFolder() {
    folders.push({
      id: crypto.randomUUID(),
      title: "New Folder",
      description: "",
      x: 48 + Math.random() * 300,
      y: 48 + Math.random() * 200,
    });
  }

  function createChat() {
    chats.push({
      id: crypto.randomUUID(),
      title: "New Chat",
      x: 48 + Math.random() * 400,
      y: 48 + Math.random() * 300,
    });
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
      role="none"
    >
      <CardFolder
        title={folder.title}
        description={folder.description}
        llmBrand={folder.llmBrand}
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
