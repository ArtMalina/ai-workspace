// ─── Types ────────────────────────────────────────────────────────────────────

import type { LlmBrandTypes } from "$lib/entities/llm";

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

/** Chat that lives inside a folder */
export interface FolderChat {
  id: string;
  title: string;
  model?: LlmBrandTypes;
  messages: ChatMessage[];
}

/** Chat on the workspace canvas */
export interface ChatItem {
  id: string;
  title: string;
  model?: LlmBrandTypes;
  subtitle?: string;
  x: number;
  y: number;
  messages: ChatMessage[];
}

export interface FolderItem {
  id: string;
  title: string;
  llmBrands: LlmBrandTypes[];
  filesCount: number;
  collectionsCount: number;
  x: number;
  y: number;
  chats: FolderChat[];
  resources: ResourceShort[];
}

// ─── Short (summary) models ───────────────────────────────────────────────────

/** Lightweight resource reference used in lists and short folder models */
export interface ResourceShort {
  id: string;
  name: string;
  type: "file" | "collection";
}

/** Lightweight chat summary — used in workspace lists and folder contents */
export interface ChatShort {
  id: string;
  name: string;
  description?: string;
  model?: LlmBrandTypes;
}

/** Lightweight folder summary — used in workspace lists */
export interface FolderShort {
  id: string;
  name: string;
  description?: string;
  chats: ChatShort[];
  resources: ResourceShort[];
}
