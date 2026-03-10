<script lang="ts">
  interface Props {
    size?: number | string;
    class?: string;
  }
  let { size = 24, class: className = "" }: Props = $props();
</script>

<!-- Mistral AI — orange brand, three horizontal wind-gust bars -->
<svg
  xmlns="http://www.w3.org/2000/svg"
  width={size}
  height={size}
  viewBox="0 0 24 24"
  fill="currentColor"
  class={["icon-mistral", className].filter(Boolean).join(" ")}
  aria-hidden="true"
  focusable="false"
>
  <!--
    Three horizontal bars of decreasing length — "mistral wind" pattern.
    Replace with official Mistral AI SVG asset for production use.
  -->
  <rect x="2" y="5" width="20" height="4" rx="2" />
  <rect x="2" y="11" width="14" height="4" rx="2" />
  <rect x="2" y="17" width="8" height="4" rx="2" />
</svg>

<style>
  /* Mistral brand color — signature orange, high contrast in both themes (7.2:1 on dark) */
  .icon-mistral {
    color: #ff7000;
  }
</style>
