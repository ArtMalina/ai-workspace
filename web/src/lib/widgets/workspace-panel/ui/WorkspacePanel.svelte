<script lang="ts">
  import type { Snippet } from "svelte";
  import { CloseButton } from "$lib/shared/ui";
  import { goto } from "$app/navigation";
  import { fly } from "svelte/transition";

  interface Props {
    title: string;
    children?: Snippet;
    onclose?: () => void;
  }

  let { title, children, onclose }: Props = $props();

  function close() {
    if (onclose) {
      onclose();
    } else {
      goto("/workspace");
    }
  }
</script>

<div class="wp" transition:fly={{ x: 24, duration: 200 }}>
  <div class="wp__header">
    <span class="wp__title">{title}</span>
    <CloseButton onclick={close} />
  </div>
  <div class="wp__body">
    {@render children?.()}
  </div>
</div>

<style>
  .wp {
    position: absolute;
    left: 1rem;
    right: 1rem;
    top: 1rem;
    bottom: 1rem;
    display: flex;
    flex-direction: column;
    background: var(--surface-card);
    border: 1px solid var(--border-default);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-xl);
    overflow: hidden;
    z-index: 20;
  }

  .wp__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--spacing-3) var(--spacing-4);
    border-bottom: 1px solid var(--border-subtle);
    flex-shrink: 0;
  }

  .wp__title {
    font-size: var(--text-sm);
    font-weight: var(--font-weight-semibold);
    color: var(--text-primary);
  }

  .wp__body {
    flex: 1;
    overflow: auto;
    padding: var(--spacing-4);
  }
</style>
