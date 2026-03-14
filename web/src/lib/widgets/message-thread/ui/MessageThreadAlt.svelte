<script lang="ts">
  import { resolveLabel, type ThreadProps } from "../lib/constants";
  import MessageCodeBlock from "./MessageCodeBlock.svelte";
  import MessageRoleLabel from "./MessageRoleLabel.svelte";
  import MessageEmpty from "./MessageEmpty.svelte";

  const { messages = [], model = "claude", modelLabel }: ThreadProps = $props();

  const displayLabel = $derived(resolveLabel(model, modelLabel));
</script>

{#if messages.length > 0}
  <div class="mta">
    {#each messages as msg, i (msg.id)}
      {@const isUser = msg.role === "user"}
      <div class="mta__row mta__row--{msg.role}" class:mta__row--first={i === 0}>
        <!-- Role strip (left column) -->
        <div class="mta__role">
          <MessageRoleLabel role={msg.role} {model} {displayLabel} />
        </div>

        <!-- Content (right column) -->
        <div class="mta__content">
          {#each msg.blocks as block, bi (bi)}
            {#if block.type === "text"}
              <p class="mta__text" class:mta__text--user={isUser}>{block.content}</p>
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
  .mta {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  /* ── Row ────────────────────────────────────────────── */
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

  .mta__row--assistant:hover {
    background: var(--color-neutral-50);
  }

  .mta__row--user {
    background: color-mix(in srgb, var(--brand-default) 7%, transparent);
    box-shadow: inset 3px 0 0 var(--brand-default);
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

  /* ── Role strip (right-aligned in left column) ───────── */
  .mta__role {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    padding-top: 0.15rem; /* optical align to first line of text */
    flex-shrink: 0;
  }

  /* ── Content ────────────────────────────────────────── */
  .mta__content {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-3);
    min-width: 0;
  }

  /* ── Text ───────────────────────────────────────────── */
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
</style>
