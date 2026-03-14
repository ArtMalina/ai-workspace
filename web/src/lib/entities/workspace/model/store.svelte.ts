import { writable } from "svelte/store";
import type { LlmBrandTypes } from "$lib/entities/llm";
import type { ChatSession } from "$lib/entities/chat/@x/workspace";
import type { FolderShort } from "$lib/entities/folder/@x/workspace";
import type { ChatItem, FolderItem } from "./types";
import { fetchWorkspaceChats, fetchWorkspaceFolders } from "../api";

// ─── Writable stores ──────────────────────────────────────────────────────────

export const folders = writable<FolderItem[]>([]);
export const chats = writable<ChatItem[]>([]);

// ─── Async actions ────────────────────────────────────────────────────────────

/**
 * Fetch workspace chats and folders from the API and populate the stores.
 * Canvas positions are assigned automatically (grid layout).
 * Returns when both stores have been updated.
 */
export async function fetchWorkspace(): Promise<void> {
  const [chatShorts, folderShorts] = await Promise.all([
    fetchWorkspaceChats(),
    fetchWorkspaceFolders(),
  ]);

  chats.set(
    chatShorts.map((c, i) => ({
      ...c,
      x: 48 + (i % 3) * 340,
      y: 48 + Math.floor(i / 3) * 200,
    })),
  );

  folders.set(
    folderShorts.map((f, i) => ({
      id: f.id,
      title: f.name,
      llmBrands: [
        ...new Set(f.chats.map((c) => c.model).filter((m): m is LlmBrandTypes => !!m)),
      ],
      filesCount: f.resources.filter((r) => r.type === "file").length,
      collectionsCount: f.resources.filter((r) => r.type === "collection").length,
      chats: f.chats,
      resources: f.resources,
      x: 40 + (i % 3) * 340,
      y: 48 + Math.floor(i / 3) * 220,
    })),
  );
}

// ─── Store patch actions (apply fetched data) ─────────────────────────────────

/**
 * Patch a canvas chat with a freshly loaded session (messages etc.).
 * Call this after fetchChatSession(id) resolves.
 */
export function applyChatSession(id: string, session: ChatSession) {
  chats.update((items) =>
    items.map((c) => (c.id === id ? { ...c, ...session } : c)),
  );
}

/**
 * Patch a folder with a freshly loaded short model.
 * If the folder isn't on the canvas yet (direct navigation), it is inserted.
 */
export function applyFolderShort(folderShort: FolderShort) {
  folders.update((items) => {
    const exists = items.some((f) => f.id === folderShort.id);
    const mapped: FolderItem = {
      id: folderShort.id,
      title: folderShort.name,
      llmBrands: [
        ...new Set(
          folderShort.chats.map((c) => c.model).filter((m): m is LlmBrandTypes => !!m),
        ),
      ],
      filesCount: folderShort.resources.filter((r) => r.type === "file").length,
      collectionsCount: folderShort.resources.filter((r) => r.type === "collection").length,
      chats: folderShort.chats,
      resources: folderShort.resources,
      x: 40,
      y: 48,
    };
    return exists ? items.map((f) => (f.id === folderShort.id ? { ...f, ...mapped } : f)) : [...items, mapped];
  });
}

// ─── Folder sync actions ──────────────────────────────────────────────────────

export function renameFolder(id: string, title: string) {
  folders.update((items) => items.map((f) => (f.id === id ? { ...f, title } : f)));
}

export function moveFolder(id: string, x: number, y: number) {
  folders.update((items) => items.map((f) => (f.id === id ? { ...f, x, y } : f)));
}

export function createFolder() {
  folders.update((items) => [
    ...items,
    {
      id: crypto.randomUUID(),
      title: "New Folder",
      llmBrands: [],
      filesCount: 0,
      collectionsCount: 0,
      x: 48 + Math.random() * 300,
      y: 48 + Math.random() * 200,
      chats: [],
      resources: [],
    },
  ]);
}

// ─── Chat sync actions ────────────────────────────────────────────────────────

export function renameChat(id: string, title: string) {
  chats.update((items) => items.map((c) => (c.id === id ? { ...c, title } : c)));
}

export function updateChatSubtitle(id: string, subtitle: string) {
  chats.update((items) => items.map((c) => (c.id === id ? { ...c, subtitle } : c)));
}

export function updateChatModel(id: string, model: LlmBrandTypes) {
  chats.update((items) => items.map((c) => (c.id === id ? { ...c, model } : c)));
}

export function moveChat(id: string, x: number, y: number) {
  chats.update((items) => items.map((c) => (c.id === id ? { ...c, x, y } : c)));
}

export function createChat() {
  chats.update((items) => [
    ...items,
    {
      id: crypto.randomUUID(),
      title: "New Chat",
      x: 48 + Math.random() * 400,
      y: 48 + Math.random() * 300,
    },
  ]);
}

export function createChatWithMessage(subtitle: string, model?: LlmBrandTypes): string {
  const id = crypto.randomUUID();
  chats.update((items) => [
    ...items,
    { id, title: "New Chat", subtitle, model, x: 48 + Math.random() * 400, y: 48 + Math.random() * 300 },
  ]);
  return id;
}

// ─── Cross-boundary actions ───────────────────────────────────────────────────

/** Move a canvas chat into a folder. */
export function moveChatToFolder(chatId: string, folderId: string) {
  let chatsValue: ChatItem[] = [];
  chats.subscribe((v) => (chatsValue = v))();

  const chat = chatsValue.find((c) => c.id === chatId);
  if (!chat) return;

  folders.update((items) =>
    items.map((f) =>
      f.id === folderId
        ? {
            ...f,
            llmBrands:
              chat.model && !f.llmBrands.includes(chat.model)
                ? [...f.llmBrands, chat.model]
                : f.llmBrands,
            chats: [...f.chats, { id: chat.id, title: chat.title, model: chat.model }],
          }
        : f,
    ),
  );

  chats.update((items) => items.filter((c) => c.id !== chatId));
}

/** Remove a chat from a folder and put it back on the canvas. */
export function removeChatFromFolder(chatId: string, folderId: string) {
  let foldersValue: FolderItem[] = [];
  folders.subscribe((v) => (foldersValue = v))();

  const folder = foldersValue.find((f) => f.id === folderId);
  if (!folder) return;
  const fc = folder.chats.find((c) => c.id === chatId);
  if (!fc) return;

  chats.update((items) => [
    ...items,
    { id: fc.id, title: fc.title, model: fc.model, x: 48 + Math.random() * 400, y: 48 + Math.random() * 300 },
  ]);
  folders.update((items) =>
    items.map((f) =>
      f.id === folderId ? { ...f, chats: f.chats.filter((c) => c.id !== chatId) } : f,
    ),
  );
}

/** Permanently delete a chat from a folder. */
export function deleteFolderChat(chatId: string, folderId: string) {
  folders.update((items) =>
    items.map((f) =>
      f.id === folderId ? { ...f, chats: f.chats.filter((c) => c.id !== chatId) } : f,
    ),
  );
}

// ─── Read helpers ─────────────────────────────────────────────────────────────

/** Find a canvas chat by ID. */
export function getChatById(id: string): ChatItem | undefined {
  let value: ChatItem[] = [];
  chats.subscribe((v) => (value = v))();
  return value.find((c) => c.id === id);
}

/** Find a folder by ID. */
export function getFolderById(id: string): FolderItem | undefined {
  let value: FolderItem[] = [];
  folders.subscribe((v) => (value = v))();
  return value.find((f) => f.id === id);
}
