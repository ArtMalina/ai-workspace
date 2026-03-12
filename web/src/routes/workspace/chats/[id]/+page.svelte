<script lang="ts">
  import { page } from "$app/stores";
  import { MessageSquare } from "@lucide/svelte";
  import { WorkspacePanel } from "$lib/widgets";
  import { LlmBrandIcon } from "$lib/features/llm-brand-icon";
  import { chats, renameChat, updateChatSubtitle } from "$lib/entities/workspace";
  import { MessageInput } from "$lib/features/chat";

  const chat = $derived(chats.find((c) => c.id === $page.params.id));

  const modelLabels: Record<string, string> = {
    openai: "ChatGPT",
    claude: "Claude",
    qwen: "Qwen",
    llama: "Llama",
    mistral: "Mistral",
  };

  // ─── Subtitle edit ───────────────────────────────────────
  let editingSubtitle = $state(false);
  let subtitleDraft = $state("");
  let subtitleEl = $state<HTMLTextAreaElement | null>(null);

  function startSubtitleEdit() {
    subtitleDraft = chat?.subtitle ?? "";
    editingSubtitle = true;
  }

  $effect(() => {
    if (editingSubtitle && subtitleEl) subtitleEl.focus();
  });

  function commitSubtitle() {
    if (chat) updateChatSubtitle(chat.id, subtitleDraft.trim());
    editingSubtitle = false;
  }

  function onSubtitleKeyDown(e: KeyboardEvent) {
    if (e.key === "Escape") editingSubtitle = false;
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) commitSubtitle();
  }
</script>

<WorkspacePanel
  title={chat?.title ?? "Chat"}
  onrename={chat ? (t) => renameChat(chat.id, t) : undefined}
>
  {#snippet footer()}
    {#if chat}
      <MessageInput />
    {/if}
  {/snippet}
  {#if chat}
    <!-- Model badge -->
    <div class="cp__model-row">
      <div class="cp__model-icon">
        {#if chat.model}
          <LlmBrandIcon brand={chat.model} size={16} />
        {:else}
          <MessageSquare class="cp__icon-fallback" />
        {/if}
      </div>
      <span class="cp__model-name">
        {chat.model ? (modelLabels[chat.model] ?? chat.model) : "No model"}
      </span>
    </div>

    <!-- Description -->
    <section class="cp__section">
      <h3 class="cp__section-heading">Description</h3>

      {#if editingSubtitle}
        <textarea
          bind:this={subtitleEl}
          bind:value={subtitleDraft}
          class="cp__subtitle-input"
          rows={4}
          placeholder="Add a description…"
          onblur={commitSubtitle}
          onkeydown={onSubtitleKeyDown}
        ></textarea>
        <p class="cp__hint">Ctrl+Enter to save &middot; Esc to cancel</p>
      {:else}
        <button class="cp__subtitle-field" onclick={startSubtitleEdit}>
          {#if chat.subtitle}
            <span class="cp__subtitle-text">{chat.subtitle}</span>
          {:else}
            <span class="cp__subtitle-placeholder">Add a description…</span>
          {/if}
        </button>
      {/if}
    </section>

    <!-- Messages -->
    <section class="cp__section">
      <h3 class="cp__section-heading">Messages</h3>
      <div class="cp__messages-empty">
        <div class="cp__messages-empty-icon-wrap">
          <MessageSquare class="cp__messages-empty-icon" />
        </div>
        <p class="cp__messages-empty-title">No messages yet</p>
        <p class="cp__messages-empty-hint">Start a conversation to see it here</p>
      </div>
    </section>
  {:else}
    <div class="cp__not-found">
      <p>Chat not found</p>
    </div>
  {/if}
</WorkspacePanel>

<style>
  /* ── Model row ────────────────────────────────────── */
  .cp__model-row {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.3125rem var(--spacing-3);
    margin-bottom: var(--spacing-6);
    background: var(--surface-overlay);
    border: 1px solid var(--border-default);
    border-radius: var(--radius-full);
  }

  :global([data-theme="dark"]) .cp__model-row {
    background: var(--color-neutral-700);
    border-color: var(--color-neutral-600);
  }

  .cp__model-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.125rem;
    height: 1.125rem;
  }

  :global(.cp__icon-fallback) {
    width: 0.875rem;
    height: 0.875rem;
    color: var(--text-subtle);
  }

  .cp__model-name {
    font-size: var(--text-xs);
    font-weight: var(--font-weight-semibold);
    color: var(--text-secondary);
    line-height: 1;
  }

  :global([data-theme="dark"]) .cp__model-name {
    color: var(--color-neutral-300);
  }

  /* ── Section ──────────────────────────────────────── */
  .cp__section {
    margin-bottom: var(--spacing-8);
  }

  .cp__section-heading {
    display: flex;
    align-items: center;
    gap: var(--spacing-3);
    margin: 0 0 var(--spacing-3);
    font-size: var(--text-xs);
    font-weight: var(--font-weight-semibold);
    color: var(--text-subtle);
    text-transform: uppercase;
    letter-spacing: 0.07em;
  }

  .cp__section-heading::after {
    content: "";
    flex: 1;
    height: 1px;
    background: var(--border-default);
  }

  :global([data-theme="dark"]) .cp__section-heading {
    color: var(--color-neutral-500);
  }

  :global([data-theme="dark"]) .cp__section-heading::after {
    background: var(--color-neutral-700);
  }

  /* ── Subtitle field ───────────────────────────────── */
  .cp__subtitle-field {
    display: block;
    width: 100%;
    padding: var(--spacing-3) var(--spacing-4);
    background: var(--surface-overlay);
    border: 1px solid var(--border-default);
    border-radius: var(--radius-lg);
    cursor: text;
    text-align: left;
    transition:
      border-color var(--duration-fast) var(--ease-default),
      background var(--duration-fast) var(--ease-default);
  }

  .cp__subtitle-field:hover {
    border-color: var(--border-strong);
    background: var(--surface-overlay);
  }

  :global([data-theme="dark"]) .cp__subtitle-field {
    background: var(--color-neutral-700);
    border-color: var(--color-neutral-600);
  }

  :global([data-theme="dark"]) .cp__subtitle-field:hover {
    border-color: var(--color-neutral-500);
    background: var(--color-neutral-700);
  }

  .cp__subtitle-text {
    font-size: var(--text-sm);
    color: var(--text-secondary);
    line-height: var(--leading-normal);
  }

  :global([data-theme="dark"]) .cp__subtitle-text {
    color: var(--color-neutral-300);
  }

  .cp__subtitle-placeholder {
    font-size: var(--text-sm);
    color: var(--text-muted);
  }

  :global([data-theme="dark"]) .cp__subtitle-placeholder {
    color: var(--color-neutral-500);
  }

  .cp__subtitle-input {
    width: 100%;
    padding: var(--spacing-3) var(--spacing-4);
    font-size: var(--text-sm);
    color: var(--text-primary);
    background: var(--surface-overlay);
    border: 1.5px solid var(--brand-default);
    border-radius: var(--radius-lg);
    outline: none;
    resize: vertical;
    font-family: inherit;
    line-height: var(--leading-normal);
    caret-color: var(--brand-default);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--brand-default) 15%, transparent);
  }

  :global([data-theme="dark"]) .cp__subtitle-input {
    background: var(--color-neutral-700);
    color: var(--color-neutral-100);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--brand-default) 20%, transparent);
  }

  .cp__hint {
    margin: var(--spacing-2) 0 0;
    font-size: var(--text-xs);
    color: var(--text-muted);
  }

  :global([data-theme="dark"]) .cp__hint {
    color: var(--color-neutral-500);
  }

  /* ── Messages empty ───────────────────────────────── */
  .cp__messages-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-2);
    padding: var(--spacing-8) var(--spacing-4);
    background: var(--surface-overlay);
    border: 1px dashed var(--border-default);
    border-radius: var(--radius-lg);
    text-align: center;
  }

  :global([data-theme="dark"]) .cp__messages-empty {
    background: var(--color-neutral-700);
    border-color: var(--color-neutral-600);
  }

  .cp__messages-empty-icon-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    border-radius: var(--radius-md);
    background: var(--surface-card);
    border: 1px solid var(--border-default);
    margin-bottom: var(--spacing-1);
  }

  :global([data-theme="dark"]) .cp__messages-empty-icon-wrap {
    background: var(--color-neutral-800);
    border-color: var(--color-neutral-600);
  }

  :global(.cp__messages-empty-icon) {
    width: 1.125rem;
    height: 1.125rem;
    color: var(--text-subtle);
  }

  .cp__messages-empty-title {
    font-size: var(--text-sm);
    font-weight: var(--font-weight-medium);
    color: var(--text-secondary);
    margin: 0;
  }

  :global([data-theme="dark"]) .cp__messages-empty-title {
    color: var(--color-neutral-400);
  }

  .cp__messages-empty-hint {
    font-size: var(--text-xs);
    color: var(--text-muted);
    margin: 0;
  }

  :global([data-theme="dark"]) .cp__messages-empty-hint {
    color: var(--color-neutral-500);
  }

  /* ── Not found ────────────────────────────────────── */
  .cp__not-found {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 8rem;
    font-size: var(--text-sm);
    color: var(--text-muted);
  }
</style>
