<script lang="ts">
  import type { HTMLButtonAttributes } from "svelte/elements";
  import type { Snippet } from "svelte";

  interface Props extends HTMLButtonAttributes {
    label: string;
    active?: boolean;
    icon?: Snippet;
    size?: "sm" | "md";
  }

  let { label, active = false, icon, size = "sm", ...restProps }: Props =
    $props();
</script>

<button
  class={["tb", `tb--${size}`, active ? "tb--active" : ""].filter(Boolean).join(" ")}
  type="button"
  role="switch"
  aria-checked={active}
  {...restProps}
>
  {#if icon}
    <span class="tb__icon">{@render icon()}</span>
  {/if}
  <span class="tb__label">{label}</span>
</button>

<style>
  /* ── Base ───────────────────────────────────────────── */
  .tb {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    border-radius: var(--radius-full, 9999px);
    border: 1px solid var(--color-neutral-200);
    background: transparent;
    color: var(--text-muted);
    font-family: inherit;
    font-weight: var(--font-weight-medium);
    cursor: pointer;
    white-space: nowrap;
    transition:
      background var(--duration-fast) var(--ease-default),
      border-color var(--duration-fast) var(--ease-default),
      color var(--duration-fast) var(--ease-default);
  }

  .tb:hover {
    background: var(--color-neutral-50);
    border-color: var(--color-neutral-300);
    color: var(--text-primary);
  }

  .tb:focus-visible {
    outline: 2px solid var(--brand-default);
    outline-offset: 2px;
  }

  /* ── Active ─────────────────────────────────────────── */
  .tb--active {
    background: color-mix(in srgb, var(--brand-default) 10%, transparent);
    border-color: color-mix(in srgb, var(--brand-default) 40%, transparent);
    color: var(--brand-default);
  }

  .tb--active:hover {
    background: color-mix(in srgb, var(--brand-default) 16%, transparent);
    border-color: var(--brand-default);
  }

  /* ── Dark theme ─────────────────────────────────────── */
  :global([data-theme="dark"]) .tb {
    border-color: var(--color-neutral-600);
    color: var(--color-neutral-400);
  }

  :global([data-theme="dark"]) .tb:hover {
    background: var(--color-neutral-700);
    border-color: var(--color-neutral-500);
    color: var(--color-neutral-200);
  }

  :global([data-theme="dark"]) .tb--active {
    background: color-mix(in srgb, var(--brand-default) 18%, transparent);
    border-color: color-mix(in srgb, var(--brand-default) 50%, transparent);
    color: color-mix(in srgb, var(--brand-default) 80%, #ffffff);
  }

  :global([data-theme="dark"]) .tb--active:hover {
    background: color-mix(in srgb, var(--brand-default) 25%, transparent);
    border-color: var(--brand-default);
  }

  /* ── Sizes ──────────────────────────────────────────── */
  .tb--sm {
    height: 1.75rem;
    padding: 0 var(--spacing-3);
    font-size: var(--text-xs);
  }

  .tb--md {
    height: 2.25rem;
    padding: 0 var(--spacing-4);
    font-size: var(--text-sm);
  }

  /* ── Icon slot ──────────────────────────────────────── */
  .tb__icon {
    display: inline-flex;
    align-items: center;
    flex-shrink: 0;
    line-height: 0;
  }

  :global(.tb__icon svg) {
    width: 0.875rem;
    height: 0.875rem;
  }
</style>
