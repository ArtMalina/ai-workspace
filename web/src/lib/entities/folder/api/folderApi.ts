import { api } from "$lib/shared/api";
import type { RequestConfig } from "$lib/shared/api";
import type { ChatShort } from "$lib/entities/chat/@x/folder";
import type { FolderShort } from "../model/types";

type FolderListResponse = { data: FolderShort[] };
type FolderResponse = { data: FolderShort };

/**
 * Fetch all folders (short models) for the workspace list view.
 * GET /api/workspace/folders
 */
export async function fetchWorkspaceFolders(config?: RequestConfig): Promise<FolderShort[]> {
  const res = await api.get<FolderListResponse>("/workspace/folders", config);
  return res.data;
}

/**
 * Fetch a single folder by ID.
 * Response includes the folder's short chat list and resource list.
 * GET /api/workspace/folders/:id
 */
export async function fetchFolderById(
  id: string,
  config?: RequestConfig,
): Promise<{ folder: FolderShort; chats: ChatShort[] }> {
  const res = await api.get<FolderResponse>(`/workspace/folders/${id}`, config);
  return {
    folder: res.data,
    chats: res.data.chats,
  };
}
