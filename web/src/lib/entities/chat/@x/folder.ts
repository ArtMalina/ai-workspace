/**
 * Cross-entity reference: folder → chat
 * Folder entity uses ChatShort from the chat entity.
 * Only types needed by folder's own model are re-exported here.
 */
export type { ChatShort } from "$lib/entities/chat";
