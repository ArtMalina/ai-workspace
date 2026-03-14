import { api } from "$lib/shared/api";
import type { RequestConfig } from "$lib/shared/api";
import type { FolderShort } from "../model/types";

type Envelope<T> = { data: T };

/**
 * Fetch all folders (short models) for the workspace list view.
 * GET /api/workspace/folders
 */
export async function fetchWorkspaceFolders(config?: RequestConfig): Promise<FolderShort[]> {
  const res = await api.get<Envelope<FolderShort[]>>("/workspace/folders", config);
  return res.data;
}

/**
 * Fetch a single folder by ID (short model: metadata + chat list + resources).
 * GET /api/folders/:id
 */
export async function fetchFolderShort(id: string, config?: RequestConfig): Promise<FolderShort> {
  const res = await api.get<Envelope<FolderShort>>(`/folders/${id}`, config);
  return res.data;
}
