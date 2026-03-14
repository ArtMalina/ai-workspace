<script lang="ts">
  import { LlmIcon } from "$lib/shared/ui";
  import type { LlmBrandTypes } from "$lib/entities/llm";

  interface Props {
    role: "user" | "assistant";
    model?: LlmBrandTypes;
    displayLabel?: string;
  }

  const { role, model = "claude", displayLabel = "" }: Props = $props();
</script>

{#if role === "user"}
  <span class="mrl__you">You</span>
{:else}
  <span class="mrl__model">
    <span class="mrl__icon">
      <LlmIcon brand={model} size={12} />
    </span>
    <span class="mrl__name">{displayLabel}</span>
  </span>
{/if}

<style>
  /* ── YOU chip ────────────────────────────────────────── */
  .mrl__you {
    display: inline-flex;
    align-items: center;
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

  :global([data-theme="dark"]) .mrl__you {
    background: var(--brand-default);
    color: #fff;
  }

  /* ── Model chip ──────────────────────────────────────── */
  .mrl__model {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    padding: 0.2rem 0.45rem 0.2rem 0.3rem;
    background: var(--color-neutral-100);
    border: 1px solid var(--color-neutral-200);
    border-radius: var(--radius-sm);
    user-select: none;
  }

  :global([data-theme="dark"]) .mrl__model {
    background: var(--color-neutral-700);
    border-color: var(--color-neutral-600);
  }

  /* ── Model icon ──────────────────────────────────────── */
  .mrl__icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 1rem;
    height: 1rem;
    border-radius: 3px;
    background: transparent;
  }

  :global([data-theme="dark"]) .mrl__icon {
    background: rgb(255 255 255 / 0.1);
  }

  /* ── Model name ──────────────────────────────────────── */
  .mrl__name {
    font-size: 0.625rem;
    font-weight: var(--font-weight-bold);
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--text-subtle);
    white-space: nowrap;
  }

  :global([data-theme="dark"]) .mrl__name {
    color: var(--color-neutral-400);
  }
</style>
