<script lang="ts">
  import { ArrowUp, Plus, Globe, Code2, FileText } from "@lucide/svelte";
  import { ToggleButton } from "$lib/shared/ui";

  interface Props {
    onsend?: (message: string) => void;
    variant?: "panel" | "card";
  }

  let { onsend, variant = "panel" }: Props = $props();

  let value = $state("");
  let textareaEl = $state<HTMLTextAreaElement | null>(null);

  // ─── Tools state ────────────────────────────────────────
  let tools = $state([
    { id: "web", label: "Web Search", active: false },
    { id: "code", label: "Code", active: false },
    { id: "files", label: "Files", active: false },
  ]);

  function toggleTool(id: string) {
    const t = tools.find((t) => t.id === id);
    if (t) t.active = !t.active;
  }

  // ─── Send ────────────────────────────────────────────────
  function submit() {
    const trimmed = value.trim();
    if (!trimmed) return;
    onsend?.(trimmed);
    value = "";
    if (textareaEl) textareaEl.style.height = "auto";
  }

  function onKeyDown(e: KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  }

  function autoResize() {
    if (!textareaEl) return;
    textareaEl.style.height = "auto";
    textareaEl.style.height = `${textareaEl.scrollHeight}px`;
  }

  const canSend = $derived(value.trim().length > 0);
</script>

<div class="mi" class:mi--card={variant === "card"}>
  <div class="mi__box">
    <!-- Textarea area -->
    <div class="mi__text-area">
      <textarea
        bind:this={textareaEl}
        bind:value
        class="mi__textarea"
        placeholder="Ask anything…"
        rows={3}
        onkeydown={onKeyDown}
        oninput={autoResize}
      ></textarea>
    </div>

    <!-- Toolbar row -->
    <div class="mi__toolbar">
      <!-- Left: attach + tools -->
      <div class="mi__toolbar-left">
        <button class="mi__attach" aria-label="Attach" type="button">
          <Plus class="mi__attach-icon" />
        </button>

        <div class="mi__tools">
          {#each tools as tool (tool.id)}
            <ToggleButton
              label={tool.label}
              active={tool.active}
              onclick={() => toggleTool(tool.id)}
            >
              {#snippet icon()}
                {#if tool.id === "web"}<Globe />{/if}
                {#if tool.id === "code"}<Code2 />{/if}
                {#if tool.id === "files"}<FileText />{/if}
              {/snippet}
            </ToggleButton>
          {/each}
        </div>
      </div>

      <!-- Right: send -->
      <button
        class="mi__send"
        class:mi__send--active={canSend}
        onclick={submit}
        disabled={!canSend}
        aria-label="Send"
        type="button"
      >
        <ArrowUp class="mi__send-icon" />
      </button>
    </div>
  </div>
</div>

<style>
  /* ── Shell ─────────────────────────────────────────── */
  .mi {
    padding: var(--spacing-4) var(--spacing-6) var(--spacing-4);
    border-top: 1px solid var(--color-neutral-200);
    background: #ffffff;
    flex-shrink: 0;
  }

  :global([data-theme="dark"]) .mi {
    background: var(--color-neutral-800);
    border-top-color: var(--color-neutral-700);
  }

  .mi--card {
    padding: 0;
    border-top: none;
    background: transparent;
  }

  :global([data-theme="dark"]) .mi--card {
    background: transparent;
    border-top-color: transparent;
  }

  /* ── Outer box (border + focus ring) ────────────────── */
  .mi__box {
    display: flex;
    flex-direction: column;
    background: var(--color-neutral-50);
    border: 1.5px solid var(--color-neutral-200);
    border-radius: var(--radius-xl);
    transition:
      border-color var(--duration-fast) var(--ease-default),
      box-shadow var(--duration-fast) var(--ease-default);
    overflow: hidden;
  }

  .mi__box:focus-within {
    border-color: var(--brand-default);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--brand-default) 12%, transparent);
  }

  :global([data-theme="dark"]) .mi__box {
    background: var(--color-neutral-700);
    border-color: var(--color-neutral-600);
  }

  :global([data-theme="dark"]) .mi__box:focus-within {
    border-color: var(--brand-default);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--brand-default) 20%, transparent);
  }

  /* ── Textarea area ──────────────────────────────────── */
  .mi__text-area {
    padding: var(--spacing-3) var(--spacing-4) var(--spacing-2);
  }

  .mi__textarea {
    display: block;
    width: 100%;
    min-height: 4.5rem;
    max-height: 14rem;
    background: transparent;
    border: none;
    outline: none;
    resize: none;
    overflow-y: auto;
    font-family: inherit;
    font-size: var(--text-sm);
    line-height: var(--leading-relaxed);
    color: var(--text-primary);
    caret-color: var(--brand-default);
    padding: 0;
  }

  .mi__textarea::placeholder {
    color: var(--text-muted);
  }

  :global([data-theme="dark"]) .mi__textarea {
    color: var(--color-neutral-100);
  }

  :global([data-theme="dark"]) .mi__textarea::placeholder {
    color: var(--color-neutral-500);
  }

  /* ── Toolbar row ────────────────────────────────────── */
  .mi__toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--spacing-2) var(--spacing-2) var(--spacing-2) var(--spacing-2);
    border-top: 1px solid var(--color-neutral-200);
    gap: var(--spacing-2);
  }

  :global([data-theme="dark"]) .mi__toolbar {
    border-top-color: var(--color-neutral-600);
  }

  .mi__toolbar-left {
    display: flex;
    align-items: center;
    gap: var(--spacing-2);
    min-width: 0;
    overflow: hidden;
  }

  /* ── Attach button ──────────────────────────────────── */
  .mi__attach {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 1.75rem;
    height: 1.75rem;
    border-radius: var(--radius-full, 9999px);
    border: 1px solid var(--color-neutral-300);
    background: transparent;
    color: var(--text-muted);
    cursor: pointer;
    transition:
      background var(--duration-fast) var(--ease-default),
      border-color var(--duration-fast) var(--ease-default),
      color var(--duration-fast) var(--ease-default);
  }

  .mi__attach:hover {
    background: var(--color-neutral-100);
    border-color: var(--color-neutral-400);
    color: var(--text-primary);
  }

  :global([data-theme="dark"]) .mi__attach {
    border-color: var(--color-neutral-600);
    color: var(--color-neutral-400);
  }

  :global([data-theme="dark"]) .mi__attach:hover {
    background: var(--color-neutral-600);
    border-color: var(--color-neutral-500);
    color: var(--color-neutral-200);
  }

  :global(.mi__attach-icon) {
    width: 0.875rem;
    height: 0.875rem;
  }

  /* ── Tools list ─────────────────────────────────────── */
  .mi__tools {
    display: flex;
    align-items: center;
    gap: var(--spacing-1);
    flex-wrap: nowrap;
    overflow: hidden;
  }

  /* ── Send button ────────────────────────────────────── */
  .mi__send {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 2rem;
    height: 2rem;
    border-radius: var(--radius-lg);
    border: none;
    background: var(--color-neutral-200);
    color: var(--color-neutral-400);
    cursor: not-allowed;
    transition:
      background var(--duration-fast) var(--ease-default),
      color var(--duration-fast) var(--ease-default),
      transform var(--duration-fast) var(--ease-default);
  }

  .mi__send--active {
    background: var(--brand-default);
    color: #ffffff;
    cursor: pointer;
  }

  .mi__send--active:hover {
    filter: brightness(1.08);
    transform: scale(1.04);
  }

  :global([data-theme="dark"]) .mi__send {
    background: var(--color-neutral-600);
    color: var(--color-neutral-400);
  }

  :global([data-theme="dark"]) .mi__send--active {
    background: var(--brand-default);
    color: #ffffff;
  }

  :global(.mi__send-icon) {
    width: 1rem;
    height: 1rem;
  }
</style>
