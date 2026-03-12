<script lang="ts">
  import { ArrowUp } from "@lucide/svelte";

  interface Props {
    onsend?: (message: string) => void;
    variant?: "panel" | "card";
  }

  let { onsend, variant = "panel" }: Props = $props();

  let value = $state("");
  let textareaEl = $state<HTMLTextAreaElement | null>(null);

  function submit() {
    const trimmed = value.trim();
    if (!trimmed) return;
    onsend?.(trimmed);
    value = "";
    // reset height after clearing
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
</script>

<div class="mi" class:mi--card={variant === "card"}>
  <div class="mi__inner">
    <textarea
      bind:this={textareaEl}
      bind:value
      class="mi__textarea"
      placeholder="Message…"
      rows={1}
      onkeydown={onKeyDown}
      oninput={autoResize}
    ></textarea>

    <button
      class="mi__send"
      class:mi__send--active={value.trim().length > 0}
      onclick={submit}
      disabled={value.trim().length === 0}
      aria-label="Send"
      type="button"
    >
      <ArrowUp class="mi__send-icon" />
    </button>
  </div>

  <p class="mi__hint">Enter to send &middot; Shift+Enter for new line</p>
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

  /* card variant — shell is provided by the parent wrapper */
  .mi--card {
    padding: 0;
    border-top: none;
    background: transparent;
  }

  :global([data-theme="dark"]) .mi--card {
    background: transparent;
    border-top-color: transparent;
  }

  /* ── Inner row ─────────────────────────────────────── */
  .mi__inner {
    display: flex;
    align-items: flex-end;
    gap: var(--spacing-2);
    padding: var(--spacing-2) var(--spacing-2) var(--spacing-2) var(--spacing-4);
    background: var(--color-neutral-50);
    border: 1.5px solid var(--color-neutral-200);
    border-radius: var(--radius-xl);
    min-height: 3rem;
    transition:
      border-color var(--duration-fast) var(--ease-default),
      box-shadow var(--duration-fast) var(--ease-default);
  }

  .mi__inner:focus-within {
    border-color: var(--brand-default);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--brand-default) 12%, transparent);
  }

  :global([data-theme="dark"]) .mi__inner {
    background: var(--color-neutral-700);
    border-color: var(--color-neutral-600);
  }

  :global([data-theme="dark"]) .mi__inner:focus-within {
    border-color: var(--brand-default);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--brand-default) 20%, transparent);
  }

  /* ── Textarea ──────────────────────────────────────── */
  .mi__textarea {
    flex: 1;
    min-width: 0;
    max-height: 10rem;
    background: transparent;
    border: none;
    outline: none;
    resize: none;
    overflow-y: auto;
    font-family: inherit;
    font-size: var(--text-sm);
    line-height: var(--leading-normal);
    color: var(--text-primary);
    caret-color: var(--brand-default);
    padding: var(--spacing-1) 0;
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

  /* ── Send button ───────────────────────────────────── */
  .mi__send {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    border-radius: var(--radius-lg);
    border: none;
    background: var(--color-neutral-200);
    color: var(--color-neutral-400);
    cursor: not-allowed;
    flex-shrink: 0;
    transition:
      background var(--duration-fast) var(--ease-default),
      color var(--duration-fast) var(--ease-default);
  }

  .mi__send--active {
    background: var(--brand-default);
    color: #ffffff;
    cursor: pointer;
  }

  .mi__send--active:hover {
    background: var(--brand-hover, var(--brand-default));
    filter: brightness(1.08);
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

  /* ── Hint ──────────────────────────────────────────── */
  .mi__hint {
    margin: var(--spacing-2) 0 0;
    font-size: var(--text-xs);
    color: var(--text-muted);
    text-align: center;
  }

  :global([data-theme="dark"]) .mi__hint {
    color: var(--color-neutral-500);
  }
</style>
