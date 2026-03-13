export const panelExpandState = $state({
  expanded: false,
});

export function toggleExpanded() {
  panelExpandState.expanded = !panelExpandState.expanded;
}

export function setExpanded(value: boolean) {
  panelExpandState.expanded = value;
}
