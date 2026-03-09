<script lang="ts">
  import { Button } from "$lib/shared/ui";
  import { LampDesk } from "@lucide/svelte";
</script>

<section class="flex flex-col items-center justify-center h-full gap-6 py-12">
  <div class="ui-card flex flex-col items-center gap-4 text-center">
    <h1 class="flex gap-4 items-center ui-heading--1 m-0">
      Welcome to AI <LampDesk class="w-12 h-12 text-brand-active" /> Workspace
    </h1>
    <p class="ui-text--card m-0">Your AI-powered workspace is ready.</p>
    <div class="flex gap-3 mt-2">
      <Button variant="primary" size="md">Get Started</Button>
      <Button variant="ghost" size="md">Learn More</Button>
    </div>
  </div>
</section>
