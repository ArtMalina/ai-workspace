<script lang="ts">
  import { page } from "$app/state";
  import { LampDesk } from "@lucide/svelte";
  import { Link } from "$lib/shared/ui";

  const navLinks = [
    { href: "/welcome", label: "Home" },
    { href: "/workspace", label: "Workspace" },
  ];
</script>

<div class="header">
  <div class="header__brand">
    <div class="ui-label uppercase font-bold flex items-center gap-2 text-brand-text">
      AI<LampDesk class="w-5 h-5 text-brand" />Workspace
    </div>
  </div>

  <nav class="header__nav">
    {#each navLinks as link}
      <Link
        href={link.href}
        size="sm"
        aria-current={page.url.pathname.startsWith(link.href) ? "page" : undefined}
      >
        {link.label}
      </Link>
    {/each}
  </nav>
</div>

<style>
  .header {
    display: flex;
    align-items: stretch;
    gap: var(--spacing-6);
  }

  .header__brand {
    display: flex;
    align-items: center;
    gap: var(--spacing-2);
  }

  .header__nav {
    display: flex;
    align-items: stretch;
    gap: var(--spacing-1);
  }

  .header__nav :global(a.ui-button) {
    border-radius: var(--radius-md) var(--radius-md) 0 0;
    border-bottom: 2px solid transparent;
    transition:
      border-color var(--duration-fast) var(--ease-default),
      background-color var(--duration-fast) var(--ease-default);
  }

  .header__nav :global(a.ui-button:hover) {
    border-bottom-color: var(--brand-default);
  }

  .header__nav :global(a.ui-button[aria-current="page"]) {
    border-bottom-color: var(--brand-default);
    color: var(--brand-default);
  }
</style>
