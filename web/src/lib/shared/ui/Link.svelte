<script lang="ts">
  import type { HTMLAnchorAttributes } from "svelte/elements";
  import type { Snippet } from "svelte";

  interface Props extends HTMLAnchorAttributes {
    variant?: "primary" | "ghost" | "outline";
    size?: "sm" | "md" | "xs";
    class?: string;
    children?: Snippet;
  }

  let {
    variant = "ghost",
    size = "md",
    class: className = "",
    children,
    ...restProps
  }: Props = $props();
</script>

<a class={`ui-button ui-button--${size} ui-button--${variant} ${className}`.trim()} {...restProps}>
  {@render children?.()}
</a>
