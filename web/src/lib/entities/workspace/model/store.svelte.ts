import type { LlmBrandTypes } from "$lib/entities/llm";
import type { ChatShort } from "$lib/entities/chat/@x/workspace";
import type { FolderShort, ResourceShort } from "$lib/entities/folder/@x/workspace";
import type { ChatItem, FolderItem } from "./types";
import { SEED_CHATS, SEED_FOLDERS } from "../../../../mocks/workspace";

// ─── Reactive state ───────────────────────────────────────────────────────────

export let folders = $state<FolderItem[]>(SEED_FOLDERS);
export let chats = $state<ChatItem[]>(SEED_CHATS);

// ─── Folder actions ───────────────────────────────────────────────────────────

export function renameFolder(id: string, title: string) {
  const item = folders.find((f) => f.id === id);
  if (item) item.title = title;
}

export function moveFolder(id: string, x: number, y: number) {
  const item = folders.find((f) => f.id === id);
  if (item) {
    item.x = x;
    item.y = y;
  }
}

export function createFolder() {
  folders.push({
    id: crypto.randomUUID(),
    title: "New Folder",
    llmBrands: [],
    filesCount: 0,
    collectionsCount: 0,
    x: 48 + Math.random() * 300,
    y: 48 + Math.random() * 200,
    chats: [],
    resources: [],
  });
}

// ─── Chat (canvas) actions ────────────────────────────────────────────────────

export function renameChat(id: string, title: string) {
  const item = chats.find((c) => c.id === id);
  if (item) item.title = title;
}

export function updateChatSubtitle(id: string, subtitle: string) {
  const item = chats.find((c) => c.id === id);
  if (item) item.subtitle = subtitle;
}

export function updateChatModel(id: string, model: LlmBrandTypes) {
  const item = chats.find((c) => c.id === id);
  if (item) item.model = model;
}

export function moveChat(id: string, x: number, y: number) {
  const item = chats.find((c) => c.id === id);
  if (item) {
    item.x = x;
    item.y = y;
  }
}

export function createChat() {
  chats.push({
    id: crypto.randomUUID(),
    title: "New Chat",
    x: 48 + Math.random() * 400,
    y: 48 + Math.random() * 300,
    messages: [],
  });
}

export function createChatWithMessage(subtitle: string, model?: LlmBrandTypes): string {
  const id = crypto.randomUUID();
  chats.push({
    id,
    title: "New Chat",
    subtitle,
    model,
    x: 48 + Math.random() * 400,
    y: 48 + Math.random() * 300,
    messages: [],
  });
  return id;
}

// ─── Cross-boundary actions ───────────────────────────────────────────────────

/** Move a canvas chat into a folder */
export function moveChatToFolder(chatId: string, folderId: string) {
  const idx = chats.findIndex((c) => c.id === chatId);
  if (idx === -1) return;
  const [chat] = chats.splice(idx, 1);
  const folder = folders.find((f) => f.id === folderId);
  if (folder) {
    folder.chats.push({
      id: chat.id,
      title: chat.title,
      model: chat.model,
      messages: chat.messages,
    });
    if (chat.model && !folder.llmBrands.includes(chat.model)) {
      folder.llmBrands.push(chat.model);
    }
  }
}

/** Remove a chat from a folder and put it back on the canvas */
export function removeChatFromFolder(chatId: string, folderId: string) {
  const folder = folders.find((f) => f.id === folderId);
  if (!folder) return;
  const idx = folder.chats.findIndex((c) => c.id === chatId);
  if (idx === -1) return;
  const [fc] = folder.chats.splice(idx, 1);
  chats.push({
    id: fc.id,
    title: fc.title,
    model: fc.model,
    messages: fc.messages,
    x: 48 + Math.random() * 400,
    y: 48 + Math.random() * 300,
  });
}

/** Permanently delete a chat from a folder */
export function deleteFolderChat(chatId: string, folderId: string) {
  const folder = folders.find((f) => f.id === folderId);
  if (!folder) return;
  const idx = folder.chats.findIndex((c) => c.id === chatId);
  if (idx !== -1) folder.chats.splice(idx, 1);
}

// ─── Read helpers ─────────────────────────────────────────────────────────────

export function getChatById(id: string) {
  return chats.find((c) => c.id === id) ?? folders.flatMap((f) => f.chats).find((c) => c.id === id);
}

export function getFolderById(id: string): { folder: FolderItem; chats: ChatShort[] } | undefined {
  const folder = folders.find((f) => f.id === id);
  if (!folder) return undefined;
  return {
    folder,
    chats: folder.chats.map((c) => ({ id: c.id, name: c.title, model: c.model })),
  };
}

export function getWorkspaceChats(): ChatShort[] {
  return chats.map((c) => ({ id: c.id, name: c.title, description: c.subtitle, model: c.model }));
}

export function getWorkspaceFolders(): FolderShort[] {
  return folders.map((f) => ({
    id: f.id,
    name: f.title,
    chats: f.chats.map((c) => ({ id: c.id, name: c.title, model: c.model })),
    resources: f.resources as ResourceShort[],
  }));
}
