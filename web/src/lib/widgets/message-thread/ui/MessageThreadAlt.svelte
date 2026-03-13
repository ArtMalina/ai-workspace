<script lang="ts">
  import { LlmIcon } from "$lib/shared/ui";
  import type { LlmBrandTypes } from "$lib/entities/llm";
  import type { ChatMessage } from "$lib/entities/workspace";

  interface Props {
    messages?: ChatMessage[];
    model?: LlmBrandTypes;
    modelLabel?: string;
  }

  const { messages = [], model = "claude", modelLabel }: Props = $props();

  const MODEL_LABELS: Record<string, string> = {
    openai: "ChatGPT",
    claude: "Claude",
    qwen: "Qwen",
    llama: "Llama",
    mistral: "Mistral",
  };

  const displayLabel = $derived(modelLabel ?? MODEL_LABELS[model] ?? model);
</script>

{#if messages.length > 0}
  <div class="mta">
    {#each messages as msg, i (msg.id)}
      {@const isUser = msg.role === "user"}
      {@const isFirst = i === 0}
      <div class="mta__row mta__row--{msg.role}" class:mta__row--first={isFirst}>
        <!-- Role strip -->
        <div class="mta__role">
          {#if isUser}
            <span class="mta__role-you">You</span>
          {:else}
            <span class="mta__role-model">
              <span class="mta__model-icon">
                <LlmIcon brand={model} size={12} />
              </span>
              <span class="mta__model-label">{displayLabel}</span>
            </span>
          {/if}
        </div>

        <!-- Content -->
        <div class="mta__content">
          {#each msg.blocks as block, bi (bi)}
            {#if block.type === "text"}
              <p class="mta__text" class:mta__text--user={isUser}>{block.content}</p>
            {:else}
              <div class="mta__code-wrap">
                <div class="mta__code-header">
                  <span class="mta__code-lang">{block.lang ?? "code"}</span>
                  <span class="mta__code-dots">
                    <span></span><span></span><span></span>
                  </span>
                </div>
                <pre class="mta__code"><code>{block.content}</code></pre>
              </div>
            {/if}
          {/each}
        </div>
      </div>
    {/each}
  </div>
{:else}
  <div class="mta__empty">
    <span class="mta__empty-text">No messages yet</span>
  </div>
{/if}

<style>
  /* ── Shell ──────────────────────────────────────────────────── */
  .mta {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  /* ── Empty ──────────────────────────────────────────────────── */
  .mta__empty {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 8rem;
  }
  .mta__empty-text {
    font-size: var(--text-sm);
    color: var(--text-muted);
  }

  /* ── Row ────────────────────────────────────────────────────── */
  .mta__row {
    display: grid;
    grid-template-columns: 5.5rem 1fr;
    gap: 0 var(--spacing-4);
    padding: var(--spacing-4) 0;
    border-top: 1px solid var(--color-neutral-100);
    transition: background var(--duration-fast) var(--ease-default);
  }

  .mta__row--first {
    border-top: none;
  }

  /* assistant: no background, subtle hover */
  .mta__row--assistant:hover {
    background: var(--color-neutral-50);
  }

  /* user: left accent stripe + tinted background */
  .mta__row--user {
    background: color-mix(in srgb, var(--brand-default) 7%, transparent);
    box-shadow: inset 3px 0 0 var(--brand-default);
    padding-left: var(--spacing-2);
  }
  .mta__row--user:hover {
    background: color-mix(in srgb, var(--brand-default) 10%, transparent);
  }

  :global([data-theme="dark"]) .mta__row {
    border-top-color: var(--color-neutral-800);
  }
  :global([data-theme="dark"]) .mta__row--assistant:hover {
    background: color-mix(in srgb, white 2%, transparent);
  }
  :global([data-theme="dark"]) .mta__row--user {
    background: color-mix(in srgb, var(--brand-default) 10%, transparent);
    box-shadow: inset 3px 0 0 var(--brand-default);
  }
  :global([data-theme="dark"]) .mta__row--user:hover {
    background: color-mix(in srgb, var(--brand-default) 14%, transparent);
  }

  /* ── Role strip ─────────────────────────────────────────────── */
  .mta__role {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    padding-top: 0.15rem; /* optical align to first line of text */
    flex-shrink: 0;
  }

  /* YOU — light: tinted brand bg, dark text; dark: solid brand */
  .mta__role-you {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.2rem 0.5rem;
    background: color-mix(in srgb, var(--brand-default) 14%, transparent);
    color: var(--brand-default);
    border-radius: var(--radius-sm);
    font-size: 0.625rem;
    font-weight: var(--font-weight-bold);
    letter-spacing: 0.07em;
    text-transform: uppercase;
    user-select: none;
  }

  :global([data-theme="dark"]) .mta__role-you {
    background: var(--brand-default);
    color: #fff;
  }

  /* model chip — light: muted neutral; dark: filled dark */
  .mta__role-model {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    padding: 0.2rem 0.45rem 0.2rem 0.3rem;
    background: var(--color-neutral-100);
    border: 1px solid var(--color-neutral-200);
    border-radius: var(--radius-sm);
    user-select: none;
  }

  :global([data-theme="dark"]) .mta__role-model {
    background: var(--color-neutral-700);
    border-color: var(--color-neutral-600);
  }

  .mta__model-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 1rem;
    height: 1rem;
    border-radius: 3px;
    /* light: transparent; dark: subtle white overlay */
    background: transparent;
  }

  :global([data-theme="dark"]) .mta__model-icon {
    background: rgb(255 255 255 / 0.1);
  }

  .mta__model-label {
    font-size: 0.625rem;
    font-weight: var(--font-weight-bold);
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--text-subtle);
    white-space: nowrap;
  }

  :global([data-theme="dark"]) .mta__model-label {
    color: var(--color-neutral-400);
  }

  /* ── Content ────────────────────────────────────────────────── */
  .mta__content {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-3);
    min-width: 0;
  }

  /* ── Text ───────────────────────────────────────────────────── */
  .mta__text {
    margin: 0;
    font-size: var(--text-sm);
    line-height: 1.7;
    color: var(--text-primary);
    white-space: pre-line;
  }

  .mta__text--user {
    color: var(--text-secondary);
  }

  :global([data-theme="dark"]) .mta__text {
    color: var(--color-neutral-200);
  }
  :global([data-theme="dark"]) .mta__text--user {
    color: var(--color-neutral-400);
  }

  /* ── Code block ─────────────────────────────────────────────── */
  .mta__code-wrap {
    overflow: hidden;
    background: var(--color-neutral-950);
    /* flat — no border-radius */
  }

  :global([data-theme="dark"]) .mta__code-wrap {
    background: #0d0d0f;
    outline: 1px solid var(--color-neutral-800);
  }

  .mta__code-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.375rem var(--spacing-4);
    background: var(--color-neutral-900);
    border-bottom: 1px solid var(--color-neutral-800);
  }

  :global([data-theme="dark"]) .mta__code-header {
    background: var(--color-neutral-900);
    border-bottom-color: var(--color-neutral-800);
  }

  .mta__code-lang {
    font-size: 0.625rem;
    font-family: var(--font-mono);
    font-weight: var(--font-weight-semibold);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--color-neutral-400);
  }

  /* decorative traffic-light dots */
  .mta__code-dots {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
  }
  .mta__code-dots span {
    display: block;
    width: 0.4375rem;
    height: 0.4375rem;
    border-radius: 50%;
    background: var(--color-neutral-700);
  }
  .mta__code-dots span:nth-child(1) {
    background: #ff5f57;
  }
  .mta__code-dots span:nth-child(2) {
    background: #febc2e;
  }
  .mta__code-dots span:nth-child(3) {
    background: #28c840;
  }

  .mta__code {
    margin: 0;
    padding: var(--spacing-4) var(--spacing-4);
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    line-height: 1.7;
    color: #cdd6f4;
    overflow-x: auto;
    white-space: pre;
  }

  /* scrollbar inside code */
  .mta__code::-webkit-scrollbar {
    height: 4px;
  }
  .mta__code::-webkit-scrollbar-track {
    background: var(--color-neutral-900);
  }
  .mta__code::-webkit-scrollbar-thumb {
    background: var(--color-neutral-700);
    border-radius: 2px;
  }
</style>
