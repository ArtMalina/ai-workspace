import { api } from "$lib/shared/api";
import type { RequestConfig } from "$lib/shared/api";
import type { ChatShort, ChatSession } from "../model/types";

type Envelope<T> = { data: T };

/**
 * Fetch all canvas chats (short models) for the workspace list view.
 * GET /api/workspace/chats
 */
export async function fetchWorkspaceChats(config?: RequestConfig): Promise<ChatShort[]> {
  const res = await api.get<Envelope<ChatShort[]>>("/workspace/chats", config);
  return res.data;
}

/**
 * Fetch a full chat session (with message history) by ID.
 * GET /api/chats/:id
 */
export async function fetchChatSession(id: string, config?: RequestConfig): Promise<ChatSession> {
  const res = await api.get<Envelope<ChatSession>>(`/chats/${id}`, config);
  return res.data;
}
