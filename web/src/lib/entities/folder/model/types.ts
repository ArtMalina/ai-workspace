import type { ChatShort } from "$lib/entities/chat/@x/folder";

// ─── Resource ─────────────────────────────────────────────────────────────────

/** Lightweight resource reference used in lists and folder models */
export interface ResourceShort {
  id: string;
  name: string;
  type: "file" | "collection";
}

// ─── Short (summary) model ────────────────────────────────────────────────────

/**
 * Lightweight folder summary — used in workspace lists.
 * Contains short chat list and resource list for preview purposes.
 */
export interface FolderShort {
  id: string;
  name: string;
  description?: string;
  chats: ChatShort[];
  resources: ResourceShort[];
}
