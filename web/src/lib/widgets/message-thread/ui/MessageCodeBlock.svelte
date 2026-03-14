<script lang="ts">
  interface Props {
    lang?: string;
    content: string;
  }

  const { lang, content }: Props = $props();
</script>

<div class="mcb">
  <div class="mcb__header">
    <span class="mcb__lang">{lang ?? "code"}</span>
    <span class="mcb__dots" aria-hidden="true">
      <span></span><span></span><span></span>
    </span>
  </div>
  <pre class="mcb__code"><code>{content}</code></pre>
</div>

<style>
  /* ── Wrap ────────────────────────────────────────────── */
  .mcb {
    overflow: hidden;
    background: var(--color-neutral-950);
  }

  :global([data-theme="dark"]) .mcb {
    background: #0d0d0f;
    outline: 1px solid var(--color-neutral-800);
  }

  /* ── Header ──────────────────────────────────────────── */
  .mcb__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.375rem var(--spacing-4);
    background: var(--color-neutral-900);
    border-bottom: 1px solid var(--color-neutral-800);
  }

  /* ── Language label ──────────────────────────────────── */
  .mcb__lang {
    font-size: 0.625rem;
    font-family: var(--font-mono);
    font-weight: var(--font-weight-semibold);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--color-neutral-400);
  }

  /* ── Traffic-light dots ──────────────────────────────── */
  .mcb__dots {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
  }

  .mcb__dots span {
    display: block;
    width: 0.4375rem;
    height: 0.4375rem;
    border-radius: 50%;
  }

  .mcb__dots span:nth-child(1) {
    background: #ff5f57;
  }
  .mcb__dots span:nth-child(2) {
    background: #febc2e;
  }
  .mcb__dots span:nth-child(3) {
    background: #28c840;
  }

  /* ── Code ────────────────────────────────────────────── */
  .mcb__code {
    margin: 0;
    padding: var(--spacing-4);
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    line-height: 1.7;
    color: #cdd6f4;
    overflow-x: auto;
    white-space: pre;
  }

  .mcb__code::-webkit-scrollbar {
    height: 4px;
  }
  .mcb__code::-webkit-scrollbar-track {
    background: var(--color-neutral-900);
  }
  .mcb__code::-webkit-scrollbar-thumb {
    background: var(--color-neutral-700);
    border-radius: 2px;
  }
</style>
