import type { LlmBrandTypes } from "$lib/entities/llm";
import type { ChatSession } from "$lib/entities/chat/@x/workspace";
import type { ResourceShort } from "$lib/entities/folder/@x/workspace";

// ─── Canvas models ────────────────────────────────────────────────────────────
// These types extend the base entity models with workspace-canvas-specific data
// (position, subtitle). They live here because x/y coordinates are a workspace
// concern — not part of the core chat or folder entity.

/** Chat item positioned on the workspace canvas */
export interface ChatItem extends ChatSession {
  /** Short description shown on the card */
  subtitle?: string;
  x: number;
  y: number;
}

/** Folder item positioned on the workspace canvas */
export interface FolderItem {
  id: string;
  title: string;
  llmBrands: LlmBrandTypes[];
  filesCount: number;
  collectionsCount: number;
  x: number;
  y: number;
  /** Full chat objects stored inside the folder */
  chats: ChatSession[];
  resources: ResourceShort[];
}
