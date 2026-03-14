import type { LlmBrandTypes } from "$lib/entities/llm";
import type { ChatMessage } from "$lib/entities/chat";

// ─── Model display labels ─────────────────────────────────
export const MODEL_LABELS: Record<string, string> = {
  openai: "ChatGPT",
  claude: "Claude",
  qwen: "Qwen",
  llama: "Llama",
  mistral: "Mistral",
};

export function resolveLabel(model: LlmBrandTypes, override?: string): string {
  return override ?? MODEL_LABELS[model] ?? model;
}

// ─── Shared props type ────────────────────────────────────
export interface ThreadProps {
  messages?: ChatMessage[];
  model?: LlmBrandTypes;
  /** Override the auto-resolved model display name */
  modelLabel?: string;
}
