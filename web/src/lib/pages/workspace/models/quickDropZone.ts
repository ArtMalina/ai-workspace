/**
 * quickDropZone — IntersectionObserver-based utility that tracks how much of
 * a dragged element overlaps the workspace's quick MessageInput card.
 *
 * Technique: negative rootMargin shrinks the default viewport root down to
 * the exact bounding box of the quick card. The observer then reports what
 * fraction of the *observed* (dragged) element lies inside that virtual zone.
 * intersectionRatio = 1 means the whole item is inside the quick card area.
 */

export interface QuickDropZone {
  /** Current intersection ratio 0–1 (updated asynchronously by the observer). */
  readonly ratio: number;
  /** Start tracking a dragged element against the quick card zone. */
  observe(target: HTMLElement): void;
  /** Stop tracking and reset ratio. */
  unobserve(): void;
  /**
   * Compute the position the item should fly to when dropped inside the zone.
   * Launches the item upward, just clear of the quick card, within workspace bounds.
   */
  computeFlyout(itemEl: HTMLElement): { x: number; y: number };
  destroy(): void;
}

export function createQuickDropZone(
  quickEl: HTMLElement,
  workspaceEl: HTMLElement,
): QuickDropZone {
  let _observer: IntersectionObserver | null = null;
  let _ratio = 0;

  /**
   * Builds a rootMargin string that shrinks the viewport to the quick card's
   * bounding box. Each side is inset by the distance from the viewport edge
   * to the corresponding edge of the quick card.
   */
  function buildMargin(): string {
    const { innerWidth: vw, innerHeight: vh } = window;
    const r = quickEl.getBoundingClientRect();
    const insets = [
      Math.round(r.top),         // top
      Math.round(vw - r.right),  // right
      Math.round(vh - r.bottom), // bottom
      Math.round(r.left),        // left
    ];
    return insets.map((v) => `-${v}px`).join(" ");
  }

  function observe(target: HTMLElement): void {
    _observer?.disconnect();
    _ratio = 0;

    _observer = new IntersectionObserver(
      (entries) => {
        _ratio = entries[0]?.intersectionRatio ?? 0;
      },
      {
        // 21 thresholds → callback fires every 5% step
        threshold: Array.from({ length: 21 }, (_, i) => i / 20),
        rootMargin: buildMargin(),
      },
    );

    _observer.observe(target);
  }

  function unobserve(): void {
    _observer?.disconnect();
    _observer = null;
    _ratio = 0;
  }

  function computeFlyout(itemEl: HTMLElement): { x: number; y: number } {
    const wsRect = workspaceEl.getBoundingClientRect();
    const itemRect = itemEl.getBoundingClientRect();
    const quickRect = quickEl.getBoundingClientRect();

    // Keep horizontal position where the item currently is
    const currentX = itemRect.left - wsRect.left;

    // Fly upward: land just above the quick card
    const GAP = 20;
    const rawY = quickRect.top - wsRect.top - itemRect.height - GAP;

    return {
      x: Math.max(0, Math.min(currentX, workspaceEl.clientWidth - itemRect.width)),
      y: Math.max(0, Math.min(rawY, workspaceEl.clientHeight - itemRect.height)),
    };
  }

  return {
    get ratio() {
      return _ratio;
    },
    observe,
    unobserve,
    computeFlyout,
    destroy() {
      _observer?.disconnect();
      _observer = null;
    },
  };
}
