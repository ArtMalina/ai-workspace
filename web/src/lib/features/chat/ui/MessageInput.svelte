<script lang="ts">
  import type { LlmBrandTypes } from "$lib/entities/llm";
  import { ArrowUp, Plus, Globe, CodeXml, FileText, ChevronDown } from "@lucide/svelte";
  import {
    IconClaude,
    IconLlama,
    IconMistral,
    IconOpenAI,
    IconQwen,
    ToggleButton,
  } from "$lib/shared/ui";

  interface Props {
    onsend?: (message: string) => void;
    variant?: "panel" | "card";
    model?: LlmBrandTypes;
    onmodelchange?: (model: LlmBrandTypes) => void;
  }

  let { onsend, variant = "panel", model, onmodelchange }: Props = $props();

  // ─── Model list ──────────────────────────────────────────
  const MODEL_LIST: { id: LlmBrandTypes; label: string }[] = [
    { id: "openai", label: "ChatGPT" },
    { id: "claude", label: "Claude" },
    { id: "qwen", label: "Qwen" },
    { id: "llama", label: "Llama" },
    { id: "mistral", label: "Mistral" },
  ];

  const MODEL_ICONS: Record<LlmBrandTypes, typeof IconOpenAI> = {
    openai: IconOpenAI,
    claude: IconClaude,
    qwen: IconQwen,
    llama: IconLlama,
    mistral: IconMistral,
  };

  const currentModel = $derived(MODEL_LIST.find((m) => m.id === model));

  // ─── Picker ───────────────────────────────────────────────
  let showPicker = $state(false);
  let pickerAnchorEl = $state<HTMLDivElement | null>(null);

  function togglePicker(e: MouseEvent) {
    e.stopPropagation();
    showPicker = !showPicker;
  }

  function selectModel(id: LlmBrandTypes) {
    onmodelchange?.(id);
    showPicker = false;
  }

  $effect(() => {
    if (!showPicker) return;
    function onDocClick() {
      showPicker = false;
    }
    document.addEventListener("click", onDocClick, { once: true });
    return () => document.removeEventListener("click", onDocClick);
  });

  // ─── Tools state ──────────────────────────────────────────
  let tools = $state([
    { id: "web", label: "Web", active: false },
    { id: "code", label: "Code", active: false },
    { id: "files", label: "Files", active: false },
  ]);

  function toggleTool(id: string) {
    const t = tools.find((t) => t.id === id);
    if (t) t.active = !t.active;
  }

  // ─── Send ─────────────────────────────────────────────────
  let value = $state("");
  let textareaEl = $state<HTMLTextAreaElement | null>(null);

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
    <!-- Textarea -->
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

    <!-- Toolbar -->
    <div class="mi__toolbar">
      <!-- Left: attach + tools -->
      <div class="mi__toolbar-left">
        <button class="mi__attach" aria-label="Attach" type="button">
          <Plus class="mi__attach-icon" />
        </button>

        <div class="mi__separator"></div>

        <div class="mi__tools">
          {#each tools as tool (tool.id)}
            <ToggleButton
              label={tool.label}
              active={tool.active}
              onclick={() => toggleTool(tool.id)}
            >
              {#snippet icon()}
                {#if tool.id === "web"}<Globe />{/if}
                {#if tool.id === "code"}<CodeXml />{/if}
                {#if tool.id === "files"}<FileText />{/if}
              {/snippet}
            </ToggleButton>
          {/each}
        </div>
      </div>

      <!-- Right: model picker + send -->
      <div class="mi__toolbar-right">
        <!-- Model picker anchor -->
        <div class="mi__model-anchor" bind:this={pickerAnchorEl}>
          <!-- Picker popup -->
          {#if showPicker}
            <div class="mi__picker" role="listbox" aria-label="Select model">
              {#each MODEL_LIST as m (m.id)}
                {@const Icon = MODEL_ICONS[m.id]}
                <button
                  class="mi__picker-item"
                  class:mi__picker-item--active={model === m.id}
                  role="option"
                  aria-selected={model === m.id}
                  type="button"
                  onclick={(e) => {
                    e.stopPropagation();
                    selectModel(m.id);
                  }}
                >
                  <span class="mi__picker-icon"><Icon /></span>
                  <span class="mi__picker-label">{m.label}</span>
                  {#if model === m.id}
                    <span class="mi__picker-check">✓</span>
                  {/if}
                </button>
              {/each}
            </div>
          {/if}

          <!-- Model chip trigger -->
          <button
            class="mi__model-chip"
            class:mi__model-chip--set={!!model}
            type="button"
            aria-label="Select model"
            onclick={togglePicker}
          >
            {#if currentModel}
              {@const Icon = MODEL_ICONS[currentModel.id]}
              <span class="mi__model-chip-icon"><Icon /></span>
              <span class="mi__model-chip-label">{currentModel.label}</span>
            {:else}
              <span class="mi__model-chip-label mi__model-chip-label--empty">Model</span>
            {/if}
            <ChevronDown class="mi__model-chevron" />
          </button>
        </div>

        <!-- Send -->
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
  }

  /* ── Outer box ──────────────────────────────────────── */
  .mi__box {
    display: flex;
    flex-direction: column;
    background: var(--color-neutral-50);
    border: 1.5px solid var(--color-neutral-200);
    border-radius: var(--radius-xl);
    transition:
      border-color var(--duration-fast) var(--ease-default),
      box-shadow var(--duration-fast) var(--ease-default);
    overflow: visible; /* allow picker popup to escape */
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

  /* ── Toolbar ────────────────────────────────────────── */
  .mi__toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--spacing-2);
    border-top: 1px solid var(--color-neutral-200);
    gap: var(--spacing-2);
  }

  :global([data-theme="dark"]) .mi__toolbar {
    border-top-color: var(--color-neutral-600);
  }

  .mi__toolbar-left {
    display: flex;
    align-items: center;
    gap: var(--spacing-1);
    min-width: 0;
    overflow: hidden;
  }

  .mi__toolbar-right {
    display: flex;
    align-items: center;
    gap: var(--spacing-4);
    flex-shrink: 0;
  }

  /* ── Visual separator ───────────────────────────────── */
  .mi__separator {
    width: 1px;
    height: 1.125rem;
    background: var(--color-neutral-200);
    flex-shrink: 0;
    margin: 0 var(--spacing-1);
  }

  :global([data-theme="dark"]) .mi__separator {
    background: var(--color-neutral-600);
  }

  /* ── Attach button ──────────────────────────────────── */
  .mi__attach {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 1.75rem;
    height: 1.75rem;
    border-radius: var(--radius-full);
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

  /* ── Tools ──────────────────────────────────────────── */
  .mi__tools {
    display: flex;
    align-items: center;
    gap: var(--spacing-1);
    flex-wrap: nowrap;
    overflow: hidden;
  }

  /* ── Model anchor + picker ──────────────────────────── */
  .mi__model-anchor {
    position: relative;
  }

  .mi__picker {
    position: absolute;
    bottom: calc(100% + 0.5rem);
    right: 0;
    z-index: 200;
    min-width: 9rem;
    background: #ffffff;
    border: 1px solid var(--color-neutral-200);
    border-radius: var(--radius-lg);
    box-shadow:
      0 2px 8px -2px rgb(0 0 0 / 0.1),
      0 8px 24px -6px rgb(0 0 0 / 0.12);
    padding: var(--spacing-1);
    display: flex;
    flex-direction: column;
    gap: 1px;
  }

  :global([data-theme="dark"]) .mi__picker {
    background: var(--color-neutral-800);
    border-color: var(--color-neutral-600);
    box-shadow:
      0 2px 8px -2px rgb(0 0 0 / 0.4),
      0 8px 24px -6px rgb(0 0 0 / 0.5);
  }

  .mi__picker-item {
    display: flex;
    align-items: center;
    gap: var(--spacing-2);
    width: 100%;
    padding: var(--spacing-2) var(--spacing-2);
    border: none;
    border-radius: var(--radius-md);
    background: transparent;
    color: var(--text-secondary);
    font-family: inherit;
    font-size: var(--text-sm);
    cursor: pointer;
    text-align: left;
    transition: background var(--duration-fast) var(--ease-default);
  }

  .mi__picker-item:hover {
    background: var(--color-neutral-50);
    color: var(--text-primary);
  }

  .mi__picker-item--active {
    color: var(--brand-default);
    font-weight: var(--font-weight-medium);
  }

  .mi__picker-item--active:hover {
    background: color-mix(in srgb, var(--brand-default) 6%, transparent);
  }

  :global([data-theme="dark"]) .mi__picker-item:hover {
    background: var(--color-neutral-700);
    color: var(--color-neutral-100);
  }

  :global([data-theme="dark"]) .mi__picker-item--active {
    color: color-mix(in srgb, var(--brand-default) 80%, #ffffff);
  }

  :global([data-theme="dark"]) .mi__picker-item--active:hover {
    background: color-mix(in srgb, var(--brand-default) 14%, transparent);
  }

  .mi__picker-icon {
    display: inline-flex;
    align-items: center;
    flex-shrink: 0;
    width: 1rem;
    height: 1rem;
    line-height: 0;
  }

  :global(.mi__picker-icon svg) {
    width: 1rem;
    height: 1rem;
  }

  .mi__picker-label {
    flex: 1;
  }

  .mi__picker-check {
    font-size: var(--text-xs);
    color: var(--brand-default);
    margin-left: auto;
  }

  /* ── Model chip trigger ─────────────────────────────── */
  .mi__model-chip {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    height: 1.75rem;
    padding: 0 var(--spacing-2) 0 var(--spacing-2);
    border-radius: var(--radius-full);
    border: 1px solid var(--color-neutral-300);
    background: transparent;
    color: var(--text-muted);
    font-family: inherit;
    font-size: var(--text-xs);
    font-weight: var(--font-weight-medium);
    cursor: pointer;
    white-space: nowrap;
    transition:
      background var(--duration-fast) var(--ease-default),
      border-color var(--duration-fast) var(--ease-default),
      color var(--duration-fast) var(--ease-default);
  }

  .mi__model-chip:hover {
    background: var(--color-neutral-100);
    border-color: var(--color-neutral-400);
    color: var(--text-primary);
  }

  .mi__model-chip--set {
    border-color: color-mix(in srgb, var(--brand-default) 40%, transparent);
    background: color-mix(in srgb, var(--brand-default) 6%, transparent);
    color: var(--brand-default);
  }

  .mi__model-chip--set:hover {
    background: color-mix(in srgb, var(--brand-default) 12%, transparent);
    border-color: var(--brand-default);
  }

  :global([data-theme="dark"]) .mi__model-chip {
    border-color: var(--color-neutral-600);
    color: var(--color-neutral-400);
  }

  :global([data-theme="dark"]) .mi__model-chip:hover {
    background: var(--color-neutral-700);
    border-color: var(--color-neutral-500);
    color: var(--color-neutral-200);
  }

  :global([data-theme="dark"]) .mi__model-chip--set {
    border-color: color-mix(in srgb, var(--brand-default) 50%, transparent);
    background: color-mix(in srgb, var(--brand-default) 14%, transparent);
    color: color-mix(in srgb, var(--brand-default) 80%, #ffffff);
  }

  :global([data-theme="dark"]) .mi__model-chip--set:hover {
    background: color-mix(in srgb, var(--brand-default) 22%, transparent);
    border-color: var(--brand-default);
  }

  .mi__model-chip-icon {
    display: inline-flex;
    align-items: center;
    width: 0.875rem;
    height: 0.875rem;
    line-height: 0;
  }

  :global(.mi__model-chip-icon svg) {
    width: 0.875rem;
    height: 0.875rem;
  }

  .mi__model-chip-label--empty {
    color: var(--text-subtle);
  }

  :global(.mi__model-chevron) {
    width: 0.75rem;
    height: 0.75rem;
    opacity: 0.6;
    flex-shrink: 0;
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
