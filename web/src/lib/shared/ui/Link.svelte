<script lang="ts">
  import type { HTMLAnchorAttributes } from "svelte/elements";
  import type { Snippet } from "svelte";

  interface Props extends HTMLAnchorAttributes {
    variant?: "filled" | "outline" | "ghost";
    color?: "brand" | "success" | "warning" | "error" | "info";
    size?: "xs" | "sm" | "md";
    class?: string;
    children?: Snippet;
  }

  let {
    variant = "ghost",
    color = "brand",
    size = "md",
    class: className = "",
    children,
    ...restProps
  }: Props = $props();
</script>

<a
  class={`ui-button ui-button--${size} ui-button--${variant} ui-button--${color} ${className}`.trim()}
  {...restProps}
>
  {@render children?.()}
</a>
