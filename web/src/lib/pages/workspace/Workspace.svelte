<script lang="ts">
  import type { LlmBrandTypes } from "$lib/entities/llm";
  import { CardFolderAlt, CardChat } from "$lib/widgets";
  import { CreateFolder } from "$lib/features/folder";
  import { CreateChat, MessageInput } from "$lib/features/chat";
  import { goto } from "$app/navigation";
  import { Group, Ungroup } from "@lucide/svelte";
  import {
    folders,
    chats,
    moveFolder,
    moveChat,
    renameChat,
    createFolder,
    createChat,
    createChatWithMessage,
    moveChatToFolder,
  } from "$lib/entities/workspace";

  let quickModel = $state<LlmBrandTypes | undefined>(undefined);
  let grouped = $state(false);

  function handleQuickSend(message: string) {
    const id = createChatWithMessage(message, quickModel);
    goto(`/workspace/chats/${id}`);
  }

  // ─── Drag & Drop ────────────────────────────────────────
  type DragType = "folder" | "chat";

  let draggingId = $state<string | null>(null);
  let draggingType = $state<DragType | null>(null);
  let dropTargetId = $state<string | null>(null);
  let dragOffset = { x: 0, y: 0 };
  let didDrag = false;
  // Ghost position for grouped-mode drag (fixed viewport coords)
  let dragPos = $state({ x: 0, y: 0 });
  // Where inside the card the user clicked — keeps ghost anchored to grab point
  let grabOffset = { x: 0, y: 0 };
  // Size of the currently dragged item — used to clamp within workspace bounds
  let draggedItemSize = { w: 0, h: 0 };
  // Reference to workspace root element for bounds clamping
  let workspaceEl: HTMLElement;

  // ─── Folder title editing ────────────────────────────────
  // Tracks which folder cards are currently in title-edit mode.
  // Plain Set is enough — only read synchronously in event handlers.
  const editingFolderIds = new Set<string>();

  /** Returns the folder id whose card contains the given viewport point */
  function folderAtPoint(x: number, y: number): string | null {
    const els = document.querySelectorAll<HTMLElement>("[data-folder-id]");
    for (const el of els) {
      const r = el.getBoundingClientRect();
      if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) {
        return el.dataset.folderId!;
      }
    }
    return null;
  }

  function onMouseDown(e: MouseEvent, id: string, type: DragType) {
    e.preventDefault();
    didDrag = false;
    draggingId = id;
    draggingType = type;
    dropTargetId = null;
    if (!grouped) {
      // Canvas: compute offset to keep item under the grab point
      const el = e.currentTarget as HTMLElement;
      draggedItemSize = { w: el.offsetWidth, h: el.offsetHeight };
      const items = type === "folder" ? folders : chats;
      const item = items.find((i) => i.id === id)!;
      dragOffset = { x: e.clientX - item.x, y: e.clientY - item.y };
    } else {
      // Grouped: record where inside the card the user grabbed
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      grabOffset = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      dragPos.x = e.clientX;
      dragPos.y = e.clientY;
    }
  }

  function onMouseMove(e: MouseEvent) {
    if (!draggingId || !draggingType) return;
    didDrag = true;
    if (!grouped) {
      // Canvas: physically move items, clamped to workspace bounds
      const maxX = workspaceEl.clientWidth - draggedItemSize.w;
      const maxY = workspaceEl.clientHeight - draggedItemSize.h;
      const x = Math.max(0, Math.min(e.clientX - dragOffset.x, maxX));
      const y = Math.max(0, Math.min(e.clientY - dragOffset.y, maxY));
      if (draggingType === "folder") {
        moveFolder(draggingId, x, y);
        dropTargetId = null;
      } else {
        moveChat(draggingId, x, y);
        dropTargetId = folderAtPoint(e.clientX, e.clientY);
      }
    } else {
      // Grouped: track ghost position + highlight drop target
      dragPos.x = e.clientX;
      dragPos.y = e.clientY;
      dropTargetId = draggingType === "chat" ? folderAtPoint(e.clientX, e.clientY) : null;
    }
  }

  function onMouseUp() {
    if (draggingType === "chat" && draggingId && dropTargetId) {
      moveChatToFolder(draggingId, dropTargetId);
    }
    draggingId = null;
    draggingType = null;
    dropTargetId = null;
  }
</script>

<div
  class="workspace"
  class:workspace--grouped={grouped}
  bind:this={workspaceEl}
  onmousemove={onMouseMove}
  onmouseup={onMouseUp}
  onmouseleave={onMouseUp}
  role="none"
>
  {#if grouped}
    <!-- ── Grouped layout ───────────────────────────────── -->
    <div class="workspace__sections">
      {#if folders.length > 0}
        <section class="workspace__section">
          <h3 class="workspace__section-title">Folders</h3>
          <div class="workspace__section-items">
            {#each folders as folder (folder.id)}
              <!-- click handled here (not via href) so editing suppresses nav;
                   data-folder-id lives on CardFolderAlt's root .cfa element -->
              <div
                onclick={() => {
                  if (!editingFolderIds.has(folder.id)) {
                    goto(`/workspace/folders/${folder.id}`);
                  }
                }}
                role="none"
              >
                <CardFolderAlt
                  folderId={folder.id}
                  title={folder.title}
                  llmBrands={folder.llmBrands}
                  filesCount={folder.filesCount}
                  collectionsCount={folder.collectionsCount}
                  chatsCount={folder.chats.length}
                  isDropTarget={dropTargetId === folder.id}
                  clickable={true}
                  onEditingChange={(v) => {
                    if (v) editingFolderIds.add(folder.id);
                    else editingFolderIds.delete(folder.id);
                  }}
                />
              </div>
            {/each}
          </div>
        </section>
      {/if}

      {#if chats.length > 0}
        <section class="workspace__section">
          <h3 class="workspace__section-title">Chats</h3>
          <div class="workspace__section-items">
            {#each chats as chat (chat.id)}
              <div
                class="workspace__card-wrap"
                class:workspace__card-wrap--dragging={draggingId === chat.id}
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
          </div>
        </section>
      {/if}
    </div>
  {:else}
    <!-- ── Canvas layout ────────────────────────────────── -->
    {#each folders as folder (folder.id)}
      <div
        class="workspace__item"
        class:workspace__item--dragging={draggingId === folder.id}
        class:workspace__item--drop-target={dropTargetId === folder.id}
        style:left="{folder.x}px"
        style:top="{folder.y}px"
        onmousedown={(e) => {
          if (editingFolderIds.has(folder.id)) return;
          onMouseDown(e, folder.id, "folder");
        }}
        onclick={() => {
          if (!didDrag && !editingFolderIds.has(folder.id)) goto(`/workspace/folders/${folder.id}`);
        }}
        role="none"
      >
        <CardFolderAlt
          folderId={folder.id}
          title={folder.title}
          llmBrands={folder.llmBrands}
          filesCount={folder.filesCount}
          collectionsCount={folder.collectionsCount}
          chatsCount={folder.chats.length}
          isDropTarget={dropTargetId === folder.id}
          clickable={true}
          onEditingChange={(v) => {
            if (v) editingFolderIds.add(folder.id);
            else editingFolderIds.delete(folder.id);
          }}
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
  {/if}

  <!-- Quick-start floating card (always visible) -->
  <div class="workspace__quick">
    <p class="workspace__quick-label">Start a new chat</p>
    <MessageInput
      variant="card"
      onsend={handleQuickSend}
      model={quickModel}
      onmodelchange={(m) => {
        quickModel = m;
      }}
    />
  </div>

  <!-- Drag ghost — only in grouped mode, follows the cursor -->
  {#if grouped && draggingId && draggingType === "chat"}
    {@const ghost = chats.find((c) => c.id === draggingId)}
    {#if ghost}
      <div
        class="workspace__drag-ghost"
        style:left="{dragPos.x - grabOffset.x}px"
        style:top="{dragPos.y - grabOffset.y}px"
        aria-hidden="true"
      >
        <CardChat title={ghost.title} model={ghost.model} subtitle={ghost.subtitle} />
      </div>
    {/if}
  {/if}

  <!-- View controls: top-right, below the app header -->
  <div class="workspace__toolbar">
    <button
      class="workspace__tool-btn"
      class:workspace__tool-btn--active={grouped}
      onclick={() => (grouped = !grouped)}
      title={grouped ? "Switch to canvas" : "Group items"}
      type="button"
    >
      {#if grouped}
        <Ungroup size={15} />
      {:else}
        <Group size={15} />
      {/if}
    </button>
  </div>

  <!-- Create actions: bottom-right -->
  <div class="workspace__actions">
    <CreateChat onCreate={createChat} />
    <CreateFolder onCreate={createFolder} />
  </div>
</div>

<style>
  /* ── Base ──────────────────────────────────────────── */
  .workspace {
    position: relative;
    height: 100%;
    overflow: hidden;
    user-select: none;
  }

  /* ── Canvas items ──────────────────────────────────── */
  .workspace__item {
    position: absolute;
    cursor: grab;
  }

  .workspace__item--dragging {
    cursor: grabbing;
    z-index: 10;
    opacity: 0.85;
  }

  /* ── Grouped mode ──────────────────────────────────── */
  .workspace__sections {
    position: absolute;
    inset: 0;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-8);
    padding: var(--spacing-8) var(--spacing-8) 14rem;
  }

  .workspace__section-title {
    margin: 0 0 var(--spacing-3) 0;
    font-size: var(--text-xs);
    font-weight: var(--font-weight-semibold);
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--text-subtle);
  }

  .workspace__section-items {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-4);
    align-items: flex-start;
  }

  .workspace__card-wrap {
    cursor: grab;
  }

  .workspace__card-wrap--dragging {
    cursor: grabbing;
    opacity: 0.35;
  }

  /* ── Drag ghost (grouped mode) ─────────────────────── */
  .workspace__drag-ghost {
    position: fixed;
    pointer-events: none;
    z-index: 9999;
    transform: scale(1.05);
    opacity: 0.9;
    filter: drop-shadow(0 12px 28px rgb(0 0 0 / 0.22));
    transition: filter 80ms ease;
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

  /* ── View toolbar (top-right, below app header) ────── */
  .workspace__toolbar {
    position: absolute;
    top: var(--spacing-3);
    right: var(--spacing-4);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-1-5);
    z-index: 20;
  }

  .workspace__tool-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    border-radius: var(--radius-md);
    border: 1.5px solid var(--border-default);
    background: var(--surface-card);
    color: var(--text-secondary);
    cursor: pointer;
    transition:
      background var(--duration-fast) var(--ease-default),
      border-color var(--duration-fast) var(--ease-default),
      color var(--duration-fast) var(--ease-default);
  }

  .workspace__tool-btn:hover {
    background: var(--surface-elevated);
    border-color: var(--brand-default);
    color: var(--brand-default);
  }

  .workspace__tool-btn--active {
    background: color-mix(in srgb, var(--brand-default) 12%, var(--surface-card));
    border-color: var(--brand-default);
    color: var(--brand-default);
  }

  .workspace__tool-btn--active:hover {
    background: color-mix(in srgb, var(--brand-default) 20%, var(--surface-card));
  }

  /* ── Create actions (bottom-right) ─────────────────── */
  .workspace__actions {
    position: absolute;
    bottom: var(--spacing-4);
    right: var(--spacing-4);
    display: flex;
    gap: var(--spacing-2);
    align-items: center;
  }
</style>
