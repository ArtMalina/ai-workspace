<script lang="ts">
  import { Folder } from "@lucide/svelte";
  import type { Snippet } from "svelte";

  interface Props {
    title: string;
    description?: string;
    href?: string;
    children?: Snippet;
  }

  let { title, description, href, children }: Props = $props();
</script>

{#if href}
  <a class="card-folder" {href}>
    <div class="card-folder__tab"></div>
    <div class="card-folder__body">
      <Folder class="card-folder__icon" />
      <div class="card-folder__content">
        <span class="card-folder__title">{title}</span>
        {#if description}
          <span class="card-folder__description">{description}</span>
        {/if}
        {@render children?.()}
      </div>
    </div>
  </a>
{:else}
  <div class="card-folder">
    <div class="card-folder__tab"></div>
    <div class="card-folder__body">
      <Folder class="card-folder__icon" />
      <div class="card-folder__content">
        <span class="card-folder__title">{title}</span>
        {#if description}
          <span class="card-folder__description">{description}</span>
        {/if}
        {@render children?.()}
      </div>
    </div>
  </div>
{/if}

<style>
  .card-folder {
    display: inline-flex;
    flex-direction: column;
    text-decoration: none;
    color: inherit;
    cursor: default;
    width: 14rem;
  }

  a.card-folder {
    cursor: pointer;
  }

  .card-folder__tab {
    align-self: flex-start;
    width: 5rem;
    height: 0.625rem;
    background-color: var(--surface-elevated);
    border-radius: var(--radius-md) var(--radius-md) 0 0;
    border: 1px solid var(--border-default);
    border-bottom: none;
    transition: background-color var(--duration-fast) var(--ease-default);
  }

  .card-folder__body {
    display: flex;
    align-items: center;
    gap: var(--spacing-3);
    padding: var(--spacing-4);
    background-color: var(--surface-elevated);
    border: 1px solid var(--border-default);
    border-radius: 0 var(--radius-md) var(--radius-md) var(--radius-md);
    transition:
      background-color var(--duration-fast) var(--ease-default),
      border-color var(--duration-fast) var(--ease-default);
  }

  :global(.card-folder__icon) {
    flex-shrink: 0;
    width: 2rem;
    height: 2rem;
    color: var(--brand-default);
    transition: color var(--duration-fast) var(--ease-default);
  }

  .card-folder__content {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-1);
    overflow: hidden;
  }

  .card-folder__title {
    font-size: var(--text-sm);
    font-weight: var(--font-weight-semibold);
    color: var(--text-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .card-folder__description {
    font-size: var(--text-xs);
    color: var(--text-muted);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* hover — only when it's a link */
  a.card-folder:hover .card-folder__tab {
    background-color: var(--brand-subtle);
    border-color: var(--brand-default);
  }

  a.card-folder:hover .card-folder__body {
    background-color: var(--brand-subtle);
    border-color: var(--brand-default);
  }

  a.card-folder:hover :global(.card-folder__icon) {
    color: var(--brand-hover);
  }
</style>
