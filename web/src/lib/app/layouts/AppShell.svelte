<script lang="ts">
  import type { Snippet } from "svelte";

  interface Props {
    children: Snippet;
    headerStart?: Snippet;
    headerEnd?: Snippet;
    footer?: Snippet;
  }

  let { children, headerStart, headerEnd, footer }: Props = $props();
</script>

<div class="app-shell">
  <header class="app-shell__header">
    <div class="app-shell__header-start">
      {@render headerStart?.()}
    </div>
    <div class="app-shell__header-end">
      {@render headerEnd?.()}
    </div>
  </header>

  <main class="app-shell__body">
    {@render children()}
  </main>

  <footer class="app-shell__footer">
    {@render footer?.()}
  </footer>
</div>

<style>
  .app-shell {
    display: grid;
    grid-template-rows: auto 1fr auto;
    min-height: 100dvh;
    background-color: var(--surface-page);
    color: var(--text-primary);
  }

  .app-shell__header {
    display: flex;
    align-items: stretch;
    justify-content: space-between;
    padding: 0 var(--spacing-6);
    height: 3.5rem;
    background-color: var(--surface-card);
    border-bottom: 1px solid var(--border-subtle);
  }

  .app-shell__header-start,
  .app-shell__header-end {
    display: flex;
    align-items: stretch;
    gap: var(--spacing-2);
  }

  .app-shell__body {
    overflow: auto;
  }

  .app-shell__footer {
    padding: var(--spacing-3) var(--spacing-6);
    background-color: var(--surface-card);
    border-top: 1px solid var(--border-subtle);
  }
</style>
