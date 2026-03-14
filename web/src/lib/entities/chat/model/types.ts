import type { LlmBrandTypes } from "$lib/entities/llm";

// ─── Message building blocks ──────────────────────────────────────────────────

export interface MessageBlock {
  type: "text" | "code";
  content: string;
  lang?: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  blocks: MessageBlock[];
}

// ─── Short (summary) model ────────────────────────────────────────────────────

/** Lightweight chat summary — used in workspace lists and folder contents */
export interface ChatShort {
  id: string;
  title: string;
  subtitle?: string;
  model?: LlmBrandTypes;
}

// ─── Full model ───────────────────────────────────────────────────────────────

/** Full chat without canvas-specific data (position, etc.) */
export interface ChatSession {
  id: string;
  title: string;
  subtitle?: string;
  model?: LlmBrandTypes;
  messages: ChatMessage[];
}
