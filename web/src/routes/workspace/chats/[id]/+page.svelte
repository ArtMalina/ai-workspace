<script lang="ts">
  import { page } from "$app/stores";
  import { MessageSquare } from "@lucide/svelte";
  import { WorkspacePanel } from "$lib/widgets";
  import { LlmBrandIcon } from "$lib/features/llm-brand-icon";
  import { chats, renameChat, updateChatSubtitle } from "$lib/entities/workspace";

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
  {#if chat}
    <!-- Model -->
    <div class="cp__hero">
      <div class="cp__model-icon">
        {#if chat.model}
          <LlmBrandIcon brand={chat.model} size={24} />
        {:else}
          <MessageSquare class="cp__icon-fallback" />
        {/if}
      </div>
      {#if chat.model}
        <span class="cp__model-badge">{modelLabels[chat.model] ?? chat.model}</span>
      {:else}
        <span class="cp__model-badge cp__model-badge--none">No model</span>
      {/if}
    </div>

    <div class="cp__divider"></div>

    <!-- Description -->
    <div class="cp__section">
      <p class="cp__section-label">Description</p>
      {#if editingSubtitle}
        <textarea
          bind:this={subtitleEl}
          bind:value={subtitleDraft}
          class="cp__subtitle-input"
          rows={3}
          placeholder="Add a description…"
          onblur={commitSubtitle}
          onkeydown={onSubtitleKeyDown}
        ></textarea>
        <p class="cp__hint">Ctrl+Enter · Esc to cancel</p>
      {:else}
        <button class="cp__subtitle-field" onclick={startSubtitleEdit}>
          {#if chat.subtitle}
            <span class="cp__subtitle-text">{chat.subtitle}</span>
          {:else}
            <span class="cp__subtitle-placeholder">Add a description…</span>
          {/if}
        </button>
      {/if}
    </div>

    <div class="cp__divider"></div>

    <!-- Messages placeholder -->
    <div class="cp__section">
      <p class="cp__section-label">Messages</p>
      <div class="cp__messages-empty">
        <MessageSquare class="cp__messages-empty-icon" />
        <p class="cp__messages-empty-text">No messages yet</p>
      </div>
    </div>
  {:else}
    <p class="cp__not-found">Chat not found</p>
  {/if}
</WorkspacePanel>

<style>
  /* ── Model hero ───────────────────────────────────── */
  .cp__hero {
    display: flex;
    align-items: center;
    gap: var(--spacing-2-5);
    margin-bottom: var(--spacing-4);
  }

  .cp__model-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    border-radius: var(--radius-md);
    background: var(--surface-elevated);
    border: 1px solid var(--border-subtle);
    flex-shrink: 0;
  }

  :global(.cp__icon-fallback) {
    width: 1rem;
    height: 1rem;
    color: var(--brand-default);
  }

  .cp__model-badge {
    font-size: var(--text-xs);
    font-weight: var(--font-weight-medium);
    color: var(--brand-text, var(--brand-default));
    background: var(--brand-subtle);
    border-radius: var(--radius-full);
    padding: 3px var(--spacing-2-5);
  }

  .cp__model-badge--none {
    color: var(--text-muted);
    background: var(--surface-elevated);
  }

  /* ── Divider ──────────────────────────────────────── */
  .cp__divider {
    height: 1px;
    background: var(--border-subtle);
    margin: 0 calc(-1 * var(--spacing-4));
    margin-bottom: var(--spacing-4);
  }

  /* ── Sections ─────────────────────────────────────── */
  .cp__section {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-2);
    margin-bottom: var(--spacing-4);
  }

  .cp__section-label {
    font-size: var(--text-xs);
    font-weight: var(--font-weight-medium);
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin: 0;
  }

  /* ── Subtitle ─────────────────────────────────────── */
  .cp__subtitle-field {
    display: flex;
    align-items: flex-start;
    width: 100%;
    padding: var(--spacing-2-5) var(--spacing-3);
    background: var(--surface-elevated);
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius-md);
    cursor: text;
    text-align: left;
    transition:
      border-color var(--duration-fast) var(--ease-default),
      background var(--duration-fast) var(--ease-default);
  }

  .cp__subtitle-field:hover {
    border-color: var(--border-default);
    background: var(--surface-overlay);
  }

  .cp__subtitle-text {
    font-size: var(--text-sm);
    color: var(--text-secondary);
    line-height: 1.5;
  }

  .cp__subtitle-placeholder {
    font-size: var(--text-sm);
    color: var(--text-muted);
  }

  .cp__subtitle-input {
    width: 100%;
    padding: var(--spacing-2-5) var(--spacing-3);
    font-size: var(--text-sm);
    color: var(--text-primary);
    background: var(--surface-elevated);
    border: 1px solid var(--brand-default);
    border-radius: var(--radius-md);
    outline: none;
    resize: vertical;
    font-family: inherit;
    line-height: 1.5;
    caret-color: var(--brand-default);
  }

  .cp__hint {
    font-size: var(--text-xs);
    color: var(--text-muted);
    margin: 0;
  }

  /* ── Messages empty ───────────────────────────────── */
  .cp__messages-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-2);
    padding: var(--spacing-6) 0;
    border-radius: var(--radius-md);
    background: var(--surface-elevated);
    border: 1px dashed var(--border-subtle);
  }

  :global(.cp__messages-empty-icon) {
    width: 1.5rem;
    height: 1.5rem;
    color: var(--text-muted);
  }

  .cp__messages-empty-text {
    font-size: var(--text-sm);
    color: var(--text-muted);
    margin: 0;
  }

  /* ── Not found ────────────────────────────────────── */
  .cp__not-found {
    font-size: var(--text-sm);
    color: var(--text-muted);
    text-align: center;
    padding: var(--spacing-8) 0;
    margin: 0;
  }
</style>
