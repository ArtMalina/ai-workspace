<script lang="ts">
  import { resolveLabel, type ThreadProps } from "../lib/constants";
  import MessageCodeBlock from "./MessageCodeBlock.svelte";
  import MessageRoleLabel from "./MessageRoleLabel.svelte";
  import MessageEmpty from "./MessageEmpty.svelte";

  const { messages = [], model = "claude", modelLabel }: ThreadProps = $props();

  const displayLabel = $derived(resolveLabel(model, modelLabel));
</script>

{#if messages.length > 0}
  <div class="mt">
    {#each messages as msg, i (msg.id)}
      {@const isUser = msg.role === "user"}
      <div class="mt__row mt__row--{msg.role}" class:mt__row--first={i === 0}>
        <!-- Label row (above content) -->
        <div class="mt__header">
          <MessageRoleLabel role={msg.role} {model} {displayLabel} />
        </div>

        <!-- Content -->
        <div class="mt__content">
          {#each msg.blocks as block, bi (bi)}
            {#if block.type === "text"}
              <p class="mt__text" class:mt__text--user={isUser}>{block.content}</p>
            {:else}
              <MessageCodeBlock lang={block.lang} content={block.content} />
            {/if}
          {/each}
        </div>
      </div>
    {/each}
  </div>
{:else}
  <MessageEmpty />
{/if}

<style>
  /* ── Shell ──────────────────────────────────────────── */
  .mt {
    display: flex;
    flex-direction: column;
    width: 100%;
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

  .mt__row--assistant:hover {
    background: var(--color-neutral-50);
  }

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

  /* ── Header (label above content) ───────────────────── */
  .mt__header {
    display: flex;
    align-items: center;
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
</style>
