<script lang="ts">
  import { ArrowLeftRight, ArrowRightLeft } from "@lucide/svelte";
  import { expanded, toggleExpanded } from "../model/store.svelte";
</script>

<button
  class="peb"
  class:peb--active={expanded}
  onclick={toggleExpanded}
  aria-label={expanded ? "Collapse panel" : "Expand panel"}
  title={expanded ? "Collapse" : "Expand"}
  type="button"
>
  {#if expanded}
    <ArrowRightLeft class="peb__icon" />
  {:else}
    <ArrowLeftRight class="peb__icon" />
  {/if}
</button>

<style>
  .peb {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.75rem;
    height: 1.75rem;
    border: none;
    border-radius: var(--radius-md);
    background: transparent;
    color: var(--text-subtle);
    cursor: pointer;
    transition:
      background var(--duration-fast) var(--ease-default),
      color var(--duration-fast) var(--ease-default);
  }

  .peb:hover {
    background: var(--color-neutral-100);
    color: var(--text-primary);
  }

  .peb--active {
    background: color-mix(in srgb, var(--brand-default) 10%, transparent);
    color: var(--brand-default);
  }

  .peb--active:hover {
    background: color-mix(in srgb, var(--brand-default) 16%, transparent);
    color: var(--brand-default);
  }

  :global([data-theme="dark"]) .peb:hover {
    background: var(--color-neutral-700);
    color: var(--color-neutral-200);
  }

  :global([data-theme="dark"]) .peb--active {
    background: color-mix(in srgb, var(--brand-default) 18%, transparent);
    color: var(--brand-default);
  }

  :global(.peb__icon) {
    width: 0.875rem;
    height: 0.875rem;
  }
</style>
