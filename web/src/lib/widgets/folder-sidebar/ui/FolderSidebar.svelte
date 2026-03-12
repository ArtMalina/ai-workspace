<script lang="ts">
  import { FolderOpen, MessageSquare, FileText, Layers, Plus } from "@lucide/svelte";
  import { LlmIcon } from "$lib/shared/ui";
  import type { FolderItem } from "$lib/entities/workspace";
  import type { LlmBrandTypes } from "$lib/entities/llm";

  interface Props {
    folder: FolderItem;
  }

  const { folder }: Props = $props();

  const BRAND_LABELS: Record<string, string> = {
    openai: "ChatGPT",
    claude: "Claude",
    qwen: "Qwen",
    llama: "Llama",
    mistral: "Mistral",
  };

  // Placeholder chats — in future will be real folder-scoped data
  const MOCK_CHAT_MODELS: LlmBrandTypes[] = ["claude", "openai", "qwen", "llama", "mistral"];
  const MOCK_CHAT_TITLES = [
    "Draft email to client",
    "Code review notes",
    "Translate article",
    "Summarise meeting",
    "Research competitors",
    "Write test cases",
    "Refactor auth module",
  ];

  const mockChats = $derived(
    Array.from({ length: folder.chatsCount }, (_, i) => ({
      id: `mock-${i}`,
      title: MOCK_CHAT_TITLES[i % MOCK_CHAT_TITLES.length],
      model: MOCK_CHAT_MODELS[i % MOCK_CHAT_MODELS.length],
    })),
  );
</script>

<div class="fs">
  <!-- ── Header ──────────────────────────────────────────── -->
  <div class="fs__header">
    <div class="fs__header-icon">
      <FolderOpen class="fs__folder-svg" />
    </div>
    <span class="fs__header-title">{folder.title}</span>
  </div>

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
      <h4 class="fs__section-label">Chats</h4>
      <button class="fs__chats-add" aria-label="New chat" type="button">
        <Plus class="fs__chats-add-icon" />
      </button>
    </div>

    {#if mockChats.length > 0}
      <ul class="fs__chat-list">
        {#each mockChats as chat (chat.id)}
          <li class="fs__chat-item">
            <div class="fs__chat-model-icon">
              <LlmIcon brand={chat.model} size={13} />
            </div>
            <span class="fs__chat-title">{chat.title}</span>
          </li>
        {/each}
      </ul>
    {:else}
      <p class="fs__muted">No chats yet</p>
    {/if}
  </section>
</div>

<style>
  /* ── Shell ─────────────────────────────────────────── */
  .fs {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  /* ── Header ────────────────────────────────────────── */
  .fs__header {
    display: flex;
    align-items: center;
    gap: var(--spacing-3);
    padding: var(--spacing-3) var(--spacing-4);
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

  /* ── Sections ──────────────────────────────────────── */
  .fs__section {
    padding: var(--spacing-4) var(--spacing-4) 0;
    flex-shrink: 0;
  }

  .fs__section + .fs__section {
    margin-top: var(--spacing-4);
  }

  /* Chats section fills remaining height and scrolls */
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
    display: flex;
    align-items: center;
    gap: var(--spacing-2);
    padding: var(--spacing-2) var(--spacing-2);
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: background var(--duration-fast) var(--ease-default);
  }

  .fs__chat-item:hover {
    background: var(--color-neutral-100);
  }

  :global([data-theme="dark"]) .fs__chat-item:hover {
    background: var(--color-neutral-700);
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
</style>
