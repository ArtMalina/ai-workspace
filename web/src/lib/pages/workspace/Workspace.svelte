<script lang="ts">
  import { CardFolder } from "$lib/widgets";
  import { Button } from "$lib/shared/ui";

  interface FolderItem {
    id: string;
    title: string;
    description: string;
    x: number;
    y: number;
  }

  let folders = $state<FolderItem[]>([
    { id: crypto.randomUUID(), title: "Projects", description: "Getting started", x: 48, y: 48 },
    { id: crypto.randomUUID(), title: "Documents", description: "12 files", x: 280, y: 48 },
  ]);

  let draggingId = $state<string | null>(null);
  // non-reactive — used only during drag calculations
  let dragOffset = { x: 0, y: 0 };

  function onMouseDown(e: MouseEvent, id: string) {
    e.preventDefault();
    draggingId = id;
    const folder = folders.find((f) => f.id === id)!;
    dragOffset = { x: e.clientX - folder.x, y: e.clientY - folder.y };
  }

  function onMouseMove(e: MouseEvent) {
    if (!draggingId) return;
    const idx = folders.findIndex((f) => f.id === draggingId);
    if (idx === -1) return;
    folders[idx].x = e.clientX - dragOffset.x;
    folders[idx].y = e.clientY - dragOffset.y;
  }

  function onMouseUp() {
    draggingId = null;
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
      class="workspace__folder"
      class:workspace__folder--dragging={draggingId === folder.id}
      style:left="{folder.x}px"
      style:top="{folder.y}px"
      onmousedown={(e) => onMouseDown(e, folder.id)}
      role="none"
    >
      <CardFolder title={folder.title} description={folder.description} />
    </div>
  {/each}

  <div class="workspace__actions">
    <Button variant="ghost" size="sm" onclick={createFolder}>+ New Folder</Button>
  </div>
</div>

<style>
  .workspace {
    position: relative;
    height: 100%;
    overflow: hidden;
    user-select: none;
  }

  .workspace__folder {
    position: absolute;
    cursor: grab;
  }

  .workspace__folder--dragging {
    cursor: grabbing;
    z-index: 10;
    opacity: 0.85;
  }

  .workspace__actions {
    position: absolute;
    bottom: var(--spacing-4);
    right: var(--spacing-4);
  }
</style>
