import { api } from "$lib/shared/api";
import type { RequestConfig } from "$lib/shared/api";
import type { ChatShort, ChatSession } from "$lib/entities/chat/@x/workspace";
import type { FolderShort } from "$lib/entities/folder/@x/workspace";

// ─── Response envelopes ───────────────────────────────────────────────────────

type Envelope<T> = { data: T };

// ─── Chat actions ─────────────────────────────────────────────────────────────

/**
 * Fetch lightweight chat summaries for the workspace canvas list.
 * GET /api/workspace/chats
 */
export async function fetchWorkspaceChats(config?: RequestConfig): Promise<ChatShort[]> {
  const res = await api.get<Envelope<ChatShort[]>>("/workspace/chats", config);
  return res.data;
}

// ─── Folder actions ───────────────────────────────────────────────────────────

/**
 * Fetch lightweight folder summaries for the workspace canvas list.
 * GET /api/workspace/folders
 */
export async function fetchWorkspaceFolders(config?: RequestConfig): Promise<FolderShort[]> {
  const res = await api.get<Envelope<FolderShort[]>>("/workspace/folders", config);
  return res.data;
}
