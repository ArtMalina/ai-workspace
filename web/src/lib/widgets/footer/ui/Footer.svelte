<script lang="ts">
  import { CircleQuestionMark } from "@lucide/svelte";
  import { Button, Link } from "$lib/shared/ui";
</script>

<footer class="footer">
  <div class="footer__start">
    <Button variant="ghost" size="xs" aria-label="Help">
      <CircleQuestionMark class="w-4 h-4" /> Help
    </Button>
  </div>

  <div class="footer__end">
    <Link href="/privacy" variant="ghost" size="xs">Data Privacy</Link>
  </div>
</footer>

<style>
  .footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }

  .footer__start,
  .footer__end {
    display: flex;
    align-items: center;
    gap: var(--spacing-1);
  }
</style>
