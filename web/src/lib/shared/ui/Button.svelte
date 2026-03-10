<script lang="ts">
  import type { HTMLButtonAttributes } from "svelte/elements";
  import type { Snippet } from "svelte";

  interface Props extends HTMLButtonAttributes {
    variant?: "filled" | "outline" | "ghost";
    color?: "brand" | "success" | "warning" | "error" | "info";
    size?: "xs" | "sm" | "md";
    class?: string;
    children?: Snippet;
  }

  let {
    variant = "filled",
    color = "brand",
    size = "md",
    class: className = "",
    disabled = false,
    children,
    ...restProps
  }: Props = $props();
</script>

<button
  class={`ui-button ui-button--${size} ui-button--${variant} ui-button--${color} ${className}`.trim()}
  {disabled}
  {...restProps}
>
  {@render children?.()}
</button>
