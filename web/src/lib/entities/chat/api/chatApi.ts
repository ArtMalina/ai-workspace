import { api } from "$lib/shared/api";
import type { RequestConfig } from "$lib/shared/api";
import type { ChatShort } from "../model/types";

type ChatListResponse = { data: ChatShort[] };
type ChatResponse = { data: ChatShort };

/**
 * Fetch all canvas chats (short models) for the workspace list view.
 * GET /api/workspace/chats
 */
export async function fetchWorkspaceChats(config?: RequestConfig): Promise<ChatShort[]> {
  const res = await api.get<ChatListResponse>("/workspace/chats", config);
  return res.data;
}

/**
 * Fetch a single chat by ID (searches canvas + folder chats server-side).
 * GET /api/workspace/chats/:id
 */
export async function fetchChatById(id: string, config?: RequestConfig): Promise<ChatShort> {
  const res = await api.get<ChatResponse>(`/workspace/chats/${id}`, config);
  return res.data;
}
