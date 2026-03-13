export let expanded = $state(false);

export function toggleExpanded() {
  expanded = !expanded;
}

export function setExpanded(value: boolean) {
  expanded = value;
}
