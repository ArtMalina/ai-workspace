export type ChatViewMode = "thread" | "alt";

export const chatViewState = $state({ mode: "thread" as ChatViewMode });

export function setChatViewMode(mode: ChatViewMode) {
  chatViewState.mode = mode;
}
