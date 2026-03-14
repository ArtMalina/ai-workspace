<script lang="ts">
  import type { HTMLButtonAttributes } from "svelte/elements";
  import { X } from "@lucide/svelte";

  interface Props extends HTMLButtonAttributes {
    size?: "sm" | "md";
  }

  let { size = "md", ...restProps }: Props = $props();
</script>

<button
  class={["close-btn", `close-btn--${size}`].join(" ")}
  aria-label="Close"
  type="button"
  {...restProps}
>
  <X class="close-btn__icon" />
</button>

<style>
  .close-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    border: none;
    background: transparent;
    border-radius: var(--radius-md);
    color: var(--text-subtle);
    cursor: pointer;
    transition:
      background var(--duration-fast) var(--ease-default),
      color var(--duration-fast) var(--ease-default);
  }

  .close-btn:hover {
    background: var(--surface-overlay);
    color: var(--text-primary);
  }

  .close-btn:focus-visible {
    outline: 2px solid var(--brand-default);
    outline-offset: 1px;
  }

  /* sizes */
  .close-btn--sm {
    width: 1.5rem;
    height: 1.5rem;
  }

  .close-btn--md {
    width: 1.75rem;
    height: 1.75rem;
  }

  :global(.close-btn__icon) {
    width: 1rem;
    height: 1rem;
  }
</style>
