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
  <div class="mt">
    {#each messages as msg, i (msg.id)}
      {@const isUser = msg.role === "user"}
      <div class="mt__row mt__row--{msg.role}" class:mt__row--first={i === 0}>

        <!-- ── Label row ───────────────────────────────── -->
        <div class="mt__header">
          {#if isUser}
            <span class="mt__label mt__label--you">You</span>
          {:else}
            <span class="mt__label mt__label--model">
              <span class="mt__model-icon">
                <LlmIcon brand={model} size={12} />
              </span>
              <span class="mt__model-name">{displayLabel}</span>
            </span>
          {/if}
        </div>

        <!-- ── Content ────────────────────────────────── -->
        <div class="mt__content">
          {#each msg.blocks as block, bi (bi)}
            {#if block.type === "text"}
              <p class="mt__text" class:mt__text--user={isUser}>{block.content}</p>
            {:else}
              <div class="mt__code-wrap">
                <div class="mt__code-header">
                  <span class="mt__code-lang">{block.lang ?? "code"}</span>
                  <span class="mt__code-dots">
                    <span></span><span></span><span></span>
                  </span>
                </div>
                <pre class="mt__code"><code>{block.content}</code></pre>
              </div>
            {/if}
          {/each}
        </div>

      </div>
    {/each}
  </div>
{:else}
  <div class="mt__empty">
    <span class="mt__empty-text">No messages yet</span>
  </div>
{/if}

<style>
  /* ── Shell ──────────────────────────────────────────── */
  .mt {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  /* ── Empty ──────────────────────────────────────────── */
  .mt__empty {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 8rem;
  }
  .mt__empty-text {
    font-size: var(--text-sm);
    color: var(--text-muted);
  }

  /* ── Row ────────────────────────────────────────────── */
  .mt__row {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-2);
    padding: var(--spacing-3) var(--spacing-4);
    border-top: 1px solid var(--color-neutral-100);
    transition: background var(--duration-fast) var(--ease-default);
  }

  .mt__row--first {
    border-top: none;
  }

  /* assistant: no background, subtle hover */
  .mt__row--assistant:hover {
    background: var(--color-neutral-50);
  }

  /* user: left accent stripe + tinted background */
  .mt__row--user {
    background: color-mix(in srgb, var(--brand-default) 6%, transparent);
    box-shadow: inset 3px 0 0 var(--brand-default);
  }
  .mt__row--user:hover {
    background: color-mix(in srgb, var(--brand-default) 10%, transparent);
  }

  :global([data-theme="dark"]) .mt__row {
    border-top-color: var(--color-neutral-800);
  }
  :global([data-theme="dark"]) .mt__row--assistant:hover {
    background: color-mix(in srgb, white 2%, transparent);
  }
  :global([data-theme="dark"]) .mt__row--user {
    background: color-mix(in srgb, var(--brand-default) 10%, transparent);
    box-shadow: inset 3px 0 0 var(--brand-default);
  }
  :global([data-theme="dark"]) .mt__row--user:hover {
    background: color-mix(in srgb, var(--brand-default) 14%, transparent);
  }

  /* ── Label row ──────────────────────────────────────── */
  .mt__header {
    display: flex;
    align-items: center;
  }

  /* YOU chip */
  .mt__label--you {
    display: inline-flex;
    align-items: center;
    padding: 0.15rem 0.45rem;
    background: color-mix(in srgb, var(--brand-default) 14%, transparent);
    color: var(--brand-default);
    border-radius: var(--radius-sm);
    font-size: 0.625rem;
    font-weight: var(--font-weight-bold);
    letter-spacing: 0.07em;
    text-transform: uppercase;
    user-select: none;
  }

  :global([data-theme="dark"]) .mt__label--you {
    background: var(--brand-default);
    color: #fff;
  }

  /* Model chip */
  .mt__label--model {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    padding: 0.15rem 0.45rem 0.15rem 0.3rem;
    background: var(--color-neutral-100);
    border: 1px solid var(--color-neutral-200);
    border-radius: var(--radius-sm);
    user-select: none;
  }

  :global([data-theme="dark"]) .mt__label--model {
    background: var(--color-neutral-700);
    border-color: var(--color-neutral-600);
  }

  .mt__model-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 1rem;
    height: 1rem;
    border-radius: 3px;
    background: transparent;
  }

  :global([data-theme="dark"]) .mt__model-icon {
    background: rgb(255 255 255 / 0.1);
  }

  .mt__model-name {
    font-size: 0.625rem;
    font-weight: var(--font-weight-bold);
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--text-subtle);
    white-space: nowrap;
  }

  :global([data-theme="dark"]) .mt__model-name {
    color: var(--color-neutral-400);
  }

  /* ── Content ────────────────────────────────────────── */
  .mt__content {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-3);
    min-width: 0;
  }

  /* ── Text ───────────────────────────────────────────── */
  .mt__text {
    margin: 0;
    font-size: var(--text-sm);
    line-height: 1.7;
    color: var(--text-primary);
    white-space: pre-line;
  }

  .mt__text--user {
    color: var(--text-secondary);
  }

  :global([data-theme="dark"]) .mt__text {
    color: var(--color-neutral-200);
  }
  :global([data-theme="dark"]) .mt__text--user {
    color: var(--color-neutral-400);
  }

  /* ── Code block ─────────────────────────────────────── */
  .mt__code-wrap {
    overflow: hidden;
    background: var(--color-neutral-950);
  }

  :global([data-theme="dark"]) .mt__code-wrap {
    background: #0d0d0f;
    outline: 1px solid var(--color-neutral-800);
  }

  .mt__code-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.375rem var(--spacing-4);
    background: var(--color-neutral-900);
    border-bottom: 1px solid var(--color-neutral-800);
  }

  .mt__code-lang {
    font-size: 0.625rem;
    font-family: var(--font-mono);
    font-weight: var(--font-weight-semibold);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--color-neutral-400);
  }

  /* decorative traffic-light dots */
  .mt__code-dots {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
  }
  .mt__code-dots span {
    display: block;
    width: 0.4375rem;
    height: 0.4375rem;
    border-radius: 50%;
    background: var(--color-neutral-700);
  }
  .mt__code-dots span:nth-child(1) { background: #ff5f57; }
  .mt__code-dots span:nth-child(2) { background: #febc2e; }
  .mt__code-dots span:nth-child(3) { background: #28c840; }

  .mt__code {
    margin: 0;
    padding: var(--spacing-4);
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    line-height: 1.7;
    color: #cdd6f4;
    overflow-x: auto;
    white-space: pre;
  }

  .mt__code::-webkit-scrollbar        { height: 4px; }
  .mt__code::-webkit-scrollbar-track  { background: var(--color-neutral-900); }
  .mt__code::-webkit-scrollbar-thumb  { background: var(--color-neutral-700); border-radius: 2px; }
</style>
