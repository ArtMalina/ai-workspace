<script lang="ts">
  import {
    FolderOpen,
    FileText,
    Layers,
    Plus,
    EllipsisVertical,
    FolderMinus,
    Trash2,
    ChevronsRight,
    ChevronsLeft,
  } from "@lucide/svelte";
  import { LlmIcon } from "$lib/shared/ui";
  import {
    type FolderItem,
    type FolderChat,
    removeChatFromFolder,
    deleteFolderChat,
  } from "$lib/entities/workspace";

  interface Props {
    folder: FolderItem;
    activeChatId?: string;
    onchatselect?: (chat: FolderChat) => void;
  }

  const { folder, activeChatId, onchatselect }: Props = $props();

  const BRAND_LABELS: Record<string, string> = {
    openai: "ChatGPT",
    claude: "Claude",
    qwen: "Qwen",
    llama: "Llama",
    mistral: "Mistral",
  };

  // ── Collapsed state (local only) ────────────────────────
  let collapsed = $state(false);

  // ── Context menu ────────────────────────────────────────
  let openMenuId = $state<string | null>(null);
  let menuX = $state(0);
  let menuY = $state(0);

  function openMenu(e: MouseEvent, id: string) {
    e.stopPropagation();
    if (openMenuId === id) {
      openMenuId = null;
      return;
    }
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    menuX = rect.right;
    menuY = rect.bottom + 4;
    openMenuId = id;
  }

  function closeMenu() {
    openMenuId = null;
  }

  function onWindowPointerDown(e: PointerEvent) {
    if (!openMenuId) return;
    if (!(e.target as HTMLElement).closest("[data-chat-menu]")) closeMenu();
  }

  function handleRemove(chatId: string) {
    removeChatFromFolder(chatId, folder.id);
    closeMenu();
  }

  function handleDelete(chatId: string) {
    deleteFolderChat(chatId, folder.id);
    closeMenu();
  }
</script>

<svelte:window onpointerdown={onWindowPointerDown} />

<div class="fs" class:fs--collapsed={collapsed}>
  <!-- ── Header ──────────────────────────────────────────── -->
  <div class="fs__header">
    {#if !collapsed}
      <div class="fs__header-icon">
        <FolderOpen class="fs__folder-svg" />
      </div>
      <span class="fs__header-title">{folder.title}</span>
    {/if}

    <button
      class="fs__collapse-btn"
      class:fs__collapse-btn--solo={collapsed}
      onclick={() => (collapsed = !collapsed)}
      aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      title={collapsed ? "Expand" : "Collapse"}
      type="button"
    >
      {#if collapsed}
        <ChevronsLeft class="fs__collapse-icon" />
      {:else}
        <ChevronsRight class="fs__collapse-icon" />
      {/if}
    </button>
  </div>

  {#if collapsed}
    <!-- ── Collapsed: icon-only chat list ─────────────────── -->
    <ul class="fs__icon-list">
      {#each folder.chats as chat (chat.id)}
        <li
          class="fs__icon-item"
          class:fs__icon-item--active={activeChatId === chat.id}
          title={chat.title}
        >
          <button
            class="fs__icon-btn"
            type="button"
            onclick={() => onchatselect?.(chat)}
            aria-label={chat.title}
          >
            <LlmIcon brand={chat.model ?? "openai"} size={15} />
          </button>
        </li>
      {/each}
    </ul>
  {:else}
    <!-- ── Models ──────────────────────────────────────────── -->
    <section class="fs__section">
      <h4 class="fs__section-label">Models</h4>
      {#if folder.llmBrands.length > 0}
        <div class="fs__brands">
          {#each folder.llmBrands as brand (brand)}
            <div class="fs__brand-chip">
              <LlmIcon {brand} size={13} class="fs__brand-svg" />
              <span>{BRAND_LABELS[brand] ?? brand}</span>
            </div>
          {/each}
        </div>
      {:else}
        <p class="fs__muted">No models assigned</p>
      {/if}
    </section>

    <!-- ── Resources ───────────────────────────────────────── -->
    <section class="fs__section">
      <h4 class="fs__section-label">Resources</h4>
      <div class="fs__resources">
        <div class="fs__res-card">
          <FileText class="fs__res-icon" />
          <span class="fs__res-val">{folder.filesCount}</span>
          <span class="fs__res-label">Files</span>
        </div>
        <div class="fs__res-card">
          <Layers class="fs__res-icon" />
          <span class="fs__res-val">{folder.collectionsCount}</span>
          <span class="fs__res-label">Collections</span>
        </div>
      </div>
    </section>

    <!-- ── Chats ────────────────────────────────────────────── -->
    <section class="fs__section fs__section--grow">
      <div class="fs__chats-header">
        <h4 class="fs__section-label">Chats · {folder.chats.length}</h4>
        <button class="fs__chats-add" aria-label="New chat" type="button">
          <Plus class="fs__chats-add-icon" />
        </button>
      </div>

      {#if folder.chats.length > 0}
        <ul class="fs__chat-list">
          {#each folder.chats as chat (chat.id)}
            <li
              class="fs__chat-item"
              class:fs__chat-item--active={activeChatId === chat.id}
              class:fs__chat-item--menu-open={openMenuId === chat.id}
            >
              <button class="fs__chat-row" type="button" onclick={() => onchatselect?.(chat)}>
                <div class="fs__chat-model-icon">
                  <LlmIcon brand={chat.model ?? "openai"} size={13} />
                </div>
                <span class="fs__chat-title">{chat.title}</span>
              </button>

              <button
                class="fs__chat-menu-btn"
                type="button"
                aria-label="Chat options"
                aria-haspopup="menu"
                aria-expanded={openMenuId === chat.id}
                data-chat-menu
                onclick={(e) => openMenu(e, chat.id)}
              >
                <EllipsisVertical class="fs__chat-menu-icon" />
              </button>
            </li>
          {/each}
        </ul>
      {:else}
        <p class="fs__muted">No chats yet</p>
      {/if}
    </section>
  {/if}
</div>

<!-- ── Context menu popover (fixed, avoids overflow clipping) ── -->
{#if openMenuId}
  <div class="fs__menu" role="menu" data-chat-menu style:left="{menuX}px" style:top="{menuY}px">
    <button
      class="fs__menu-item"
      role="menuitem"
      type="button"
      data-chat-menu
      onclick={() => handleRemove(openMenuId!)}
    >
      <FolderMinus class="fs__menu-icon" />
      <span>Move to Desktop</span>
    </button>
    <hr class="fs__menu-divider" />
    <button
      class="fs__menu-item fs__menu-item--danger"
      role="menuitem"
      type="button"
      data-chat-menu
      onclick={() => handleDelete(openMenuId!)}
    >
      <Trash2 class="fs__menu-icon" />
      <span>Delete</span>
    </button>
  </div>
{/if}

<style>
  /* ── Shell ─────────────────────────────────────────── */
  .fs {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 22rem;
    flex-shrink: 0;
    overflow: hidden;
    transition: width 240ms cubic-bezier(0.4, 0, 0.2, 1);
  }

  .fs--collapsed {
    width: 3.25rem;
  }

  /* ── Header ────────────────────────────────────────── */
  .fs__header {
    display: flex;
    align-items: center;
    gap: var(--spacing-3);
    padding: var(--spacing-3) var(--spacing-3);
    min-height: 4rem;
    flex-shrink: 0;
    background: var(--color-neutral-50);
    border-bottom: 1px solid var(--color-neutral-200);
    border-radius: var(--radius-xl) var(--radius-xl) 0 0;
  }

  :global([data-theme="dark"]) .fs__header {
    background: var(--color-neutral-900);
    border-bottom-color: var(--color-neutral-700);
  }

  .fs__header-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 2rem;
    height: 2rem;
    border-radius: var(--radius-md);
    background: var(--color-neutral-100);
    border: 1px solid var(--color-neutral-200);
    color: var(--text-muted);
  }

  :global([data-theme="dark"]) .fs__header-icon {
    background: var(--color-neutral-800);
    border-color: var(--color-neutral-700);
  }

  :global(.fs__folder-svg) {
    width: 1rem;
    height: 1rem;
  }

  .fs__header-title {
    flex: 1;
    min-width: 0;
    font-size: var(--text-sm);
    font-weight: var(--font-weight-semibold);
    color: var(--text-primary);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* ── Collapse toggle ────────────────────────────────── */
  .fs__collapse-btn {
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.75rem;
    height: 1.75rem;
    border: none;
    border-radius: var(--radius-md);
    background: transparent;
    color: var(--text-subtle);
    cursor: pointer;
    transition:
      background var(--duration-fast) var(--ease-default),
      color var(--duration-fast) var(--ease-default);
  }

  /* In collapsed mode the button is the only header element — center it */
  .fs__collapse-btn--solo {
    margin: 0 auto;
  }

  .fs__collapse-btn:hover {
    background: var(--color-neutral-100);
    color: var(--text-primary);
  }

  :global([data-theme="dark"]) .fs__collapse-btn:hover {
    background: var(--color-neutral-700);
    color: var(--color-neutral-200);
  }

  :global(.fs__collapse-icon) {
    width: 0.9rem;
    height: 0.9rem;
  }

  /* ── Collapsed icon list ────────────────────────────── */
  .fs__icon-list {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    overflow-x: hidden;
    list-style: none;
    margin: 0;
    padding: var(--spacing-2) 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    /* hide scrollbar but allow scroll */
    scrollbar-width: none;
  }

  .fs__icon-list::-webkit-scrollbar {
    display: none;
  }

  .fs__icon-item {
    width: 2.25rem;
    height: 2.25rem;
    flex-shrink: 0;
    border-radius: var(--radius-md);
    transition: background var(--duration-fast) var(--ease-default);
  }

  .fs__icon-item:hover {
    background: var(--color-neutral-100);
  }

  :global([data-theme="dark"]) .fs__icon-item:hover {
    background: var(--color-neutral-700);
  }

  .fs__icon-item--active {
    background: color-mix(in srgb, var(--brand-default) 12%, transparent);
  }

  .fs__icon-item--active:hover {
    background: color-mix(in srgb, var(--brand-default) 18%, transparent);
  }

  :global([data-theme="dark"]) .fs__icon-item--active {
    background: color-mix(in srgb, var(--brand-default) 16%, transparent);
  }

  .fs__icon-btn {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    border-radius: var(--radius-md);
    background: transparent;
    cursor: pointer;
    padding: 0;
  }

  /* ── Sections ──────────────────────────────────────── */
  .fs__section {
    padding: var(--spacing-4) var(--spacing-4) 0;
    flex-shrink: 0;
  }

  .fs__section + .fs__section {
    margin-top: var(--spacing-4);
  }

  .fs__section--grow {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    padding-bottom: var(--spacing-4);
  }

  .fs__section-label {
    margin: 0 0 var(--spacing-2);
    font-size: var(--text-xs);
    font-weight: var(--font-weight-semibold);
    color: var(--text-subtle);
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  :global([data-theme="dark"]) .fs__section-label {
    color: var(--color-neutral-500);
  }

  .fs__muted {
    margin: 0;
    font-size: var(--text-xs);
    color: var(--text-muted);
  }

  /* ── Model chips ───────────────────────────────────── */
  .fs__brands {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-2);
  }

  .fs__brand-chip {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    padding: 0.25rem var(--spacing-3);
    font-size: var(--text-xs);
    font-weight: var(--font-weight-medium);
    color: var(--text-secondary);
    background: var(--color-neutral-50);
    border: 1px solid var(--color-neutral-200);
    border-radius: var(--radius-full);
  }

  :global([data-theme="dark"]) .fs__brand-chip {
    background: var(--color-neutral-700);
    border-color: var(--color-neutral-600);
    color: var(--color-neutral-300);
  }

  :global(.fs__brand-svg) {
    width: 0.8125rem;
    height: 0.8125rem;
    flex-shrink: 0;
  }

  /* ── Resources cards ───────────────────────────────── */
  .fs__resources {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--spacing-2);
  }

  .fs__res-card {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-1);
    padding: var(--spacing-3);
    background: var(--color-neutral-50);
    border: 1px solid var(--color-neutral-200);
    border-radius: var(--radius-lg);
  }

  :global([data-theme="dark"]) .fs__res-card {
    background: var(--color-neutral-700);
    border-color: var(--color-neutral-600);
  }

  :global(.fs__res-icon) {
    width: 0.875rem;
    height: 0.875rem;
    color: var(--text-subtle);
    flex-shrink: 0;
  }
  :global([data-theme="dark"]) .fs__res-icon {
    color: var(--color-neutral-500);
  }

  .fs__res-val {
    font-size: var(--text-base);
    font-weight: var(--font-weight-semibold);
    color: var(--text-primary);
    line-height: 1.2;
    font-variant-numeric: tabular-nums;
  }

  :global([data-theme="dark"]) .fs__res-val {
    color: var(--color-neutral-100);
  }

  .fs__res-label {
    font-size: var(--text-xs);
    color: var(--text-muted);
    line-height: 1;
  }
  :global([data-theme="dark"]) .fs__res-label {
    color: var(--color-neutral-500);
  }

  /* ── Chats header row ──────────────────────────────── */
  .fs__chats-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: var(--spacing-2);
  }

  .fs__chats-header .fs__section-label {
    margin: 0;
  }

  .fs__chats-add {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.375rem;
    height: 1.375rem;
    border-radius: var(--radius-sm);
    border: none;
    background: transparent;
    color: var(--text-muted);
    cursor: pointer;
    transition:
      background var(--duration-fast) var(--ease-default),
      color var(--duration-fast) var(--ease-default);
  }

  .fs__chats-add:hover {
    background: var(--color-neutral-100);
    color: var(--text-primary);
  }
  :global([data-theme="dark"]) .fs__chats-add:hover {
    background: var(--color-neutral-700);
    color: var(--color-neutral-200);
  }
  :global(.fs__chats-add-icon) {
    width: 0.875rem;
    height: 0.875rem;
  }

  /* ── Chat list ─────────────────────────────────────── */
  .fs__chat-list {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .fs__chat-item {
    position: relative;
    display: flex;
    align-items: center;
    padding-right: var(--spacing-2);
    border-radius: var(--radius-md);
    transition: background var(--duration-fast) var(--ease-default);
  }

  .fs__chat-item:hover,
  .fs__chat-item--menu-open {
    background: var(--color-neutral-100);
  }

  .fs__chat-item--active {
    background: color-mix(in srgb, var(--brand-default) 10%, transparent);
  }

  .fs__chat-item--active:hover {
    background: color-mix(in srgb, var(--brand-default) 15%, transparent);
  }

  :global([data-theme="dark"]) .fs__chat-item:hover,
  :global([data-theme="dark"]) .fs__chat-item--menu-open {
    background: var(--color-neutral-700);
  }

  :global([data-theme="dark"]) .fs__chat-item--active {
    background: color-mix(in srgb, var(--brand-default) 15%, transparent);
  }

  /* Row button — takes all space left of the menu trigger */
  .fs__chat-row {
    flex: 1;
    min-width: 0;
    display: flex;
    align-items: center;
    gap: var(--spacing-2);
    padding: var(--spacing-2) 0 var(--spacing-2) var(--spacing-2);
    background: transparent;
    border: none;
    border-radius: var(--radius-md);
    cursor: pointer;
    text-align: left;
    outline: none;
  }

  .fs__chat-model-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 1.5rem;
    height: 1.5rem;
    border-radius: var(--radius-sm);
    background: var(--color-neutral-100);
    border: 1px solid var(--color-neutral-200);
  }

  :global([data-theme="dark"]) .fs__chat-model-icon {
    background: var(--color-neutral-700);
    border-color: var(--color-neutral-600);
  }

  .fs__chat-title {
    flex: 1;
    min-width: 0;
    font-size: var(--text-xs);
    color: var(--text-secondary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.4;
  }

  :global([data-theme="dark"]) .fs__chat-title {
    color: var(--color-neutral-400);
  }

  .fs__chat-item--active .fs__chat-title {
    color: var(--brand-default);
    font-weight: var(--font-weight-medium);
  }

  /* ── Context menu trigger ──────────────────────────── */
  .fs__chat-menu-btn {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.375rem;
    height: 1.375rem;
    border: none;
    border-radius: var(--radius-sm);
    background: transparent;
    color: var(--text-muted);
    cursor: pointer;
    opacity: 0;
    transition:
      opacity var(--duration-fast) var(--ease-default),
      background var(--duration-fast) var(--ease-default),
      color var(--duration-fast) var(--ease-default);
  }

  .fs__chat-item:hover .fs__chat-menu-btn,
  .fs__chat-item--menu-open .fs__chat-menu-btn {
    opacity: 1;
  }

  .fs__chat-menu-btn:hover {
    background: var(--color-neutral-200);
    color: var(--text-primary);
  }
  :global([data-theme="dark"]) .fs__chat-menu-btn:hover {
    background: var(--color-neutral-600);
    color: var(--color-neutral-200);
  }
  :global(.fs__chat-menu-icon) {
    width: 0.875rem;
    height: 0.875rem;
  }

  /* ── Popover menu ──────────────────────────────────── */
  .fs__menu {
    position: fixed;
    z-index: 200;
    transform: translateX(-100%);
    min-width: 11rem;
    padding: var(--spacing-1);
    background: var(--surface-card);
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius-lg);
    box-shadow:
      0 4px 6px -1px rgb(0 0 0 / 0.08),
      0 10px 20px -4px rgb(0 0 0 / 0.12);
    animation: fs-menu-in var(--duration-fast) var(--ease-default) both;
  }

  :global([data-theme="dark"]) .fs__menu {
    background: var(--color-neutral-800);
    border-color: var(--color-neutral-700);
    box-shadow:
      0 4px 8px -2px rgb(0 0 0 / 0.4),
      0 12px 24px -6px rgb(0 0 0 / 0.5);
  }

  @keyframes fs-menu-in {
    from {
      opacity: 0;
      transform: translateX(-100%) translateY(-4px);
    }
    to {
      opacity: 1;
      transform: translateX(-100%) translateY(0);
    }
  }

  .fs__menu-divider {
    border: none;
    border-top: 1px solid var(--border-subtle);
    margin: var(--spacing-1) 0;
  }

  :global([data-theme="dark"]) .fs__menu-divider {
    border-top-color: var(--color-neutral-700);
  }

  .fs__menu-item {
    display: flex;
    align-items: center;
    gap: var(--spacing-2);
    width: 100%;
    padding: var(--spacing-2);
    border: none;
    border-radius: var(--radius-md);
    background: transparent;
    font-size: var(--text-xs);
    font-weight: var(--font-weight-medium);
    color: var(--text-secondary);
    cursor: pointer;
    text-align: left;
    transition:
      background var(--duration-fast) var(--ease-default),
      color var(--duration-fast) var(--ease-default);
  }

  .fs__menu-item:hover {
    background: var(--color-neutral-100);
    color: var(--text-primary);
  }
  :global([data-theme="dark"]) .fs__menu-item:hover {
    background: var(--color-neutral-700);
    color: var(--color-neutral-100);
  }

  .fs__menu-item--danger {
    color: var(--color-red-600, #dc2626);
  }
  .fs__menu-item--danger:hover {
    background: color-mix(in srgb, var(--color-red-600, #dc2626) 10%, transparent);
    color: var(--color-red-600, #dc2626);
  }

  :global([data-theme="dark"]) .fs__menu-item--danger {
    color: var(--color-red-400, #f87171);
  }
  :global([data-theme="dark"]) .fs__menu-item--danger:hover {
    background: color-mix(in srgb, var(--color-red-500, #ef4444) 15%, transparent);
    color: var(--color-red-400, #f87171);
  }

  :global(.fs__menu-icon) {
    width: 0.875rem;
    height: 0.875rem;
    flex-shrink: 0;
  }
</style>
