<script lang="ts">
  import type { HTMLButtonAttributes } from "svelte/elements";
  import type { Snippet } from "svelte";

  interface Props extends HTMLButtonAttributes {
    variant?: "primary" | "ghost" | "outline";
    size?: "sm" | "md" | "xs";
    class?: string;
    children?: Snippet;
  }

  let {
    variant = "primary",
    size = "md",
    class: className = "",
    disabled = false,
    children,
    ...restProps
  }: Props = $props();
</script>

<button
  class={`ui-button ui-button--${size} ui-button--${variant} ${className}`.trim()}
  {disabled}
  {...restProps}
>
  {@render children?.()}
</button>
