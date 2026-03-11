import type { LlmBrandTypes } from "$lib/entities/llm";

export interface FolderItem {
  id: string;
  title: string;
  llmBrands: LlmBrandTypes[];
  filesCount: number;
  collectionsCount: number;
  chatsCount: number;
  x: number;
  y: number;
}

export interface ChatItem {
  id: string;
  title: string;
  model?: LlmBrandTypes;
  subtitle?: string;
  x: number;
  y: number;
}

// ─── State ───────────────────────────────────────────────────────────────────

export let folders = $state<FolderItem[]>([
  {
    id: crypto.randomUUID(),
    title: "Ideas",
    llmBrands: ["openai", "claude"],
    filesCount: 2,
    collectionsCount: 1,
    chatsCount: 3,
    x: 40,
    y: 48,
  },
  {
    id: crypto.randomUUID(),
    title: "Project Alpha",
    llmBrands: ["claude", "openai", "qwen"],
    filesCount: 12,
    collectionsCount: 2,
    chatsCount: 7,
    x: 380,
    y: 48,
  },
  {
    id: crypto.randomUUID(),
    title: "Finance Reports",
    llmBrands: ["llama", "mistral"],
    filesCount: 4,
    collectionsCount: 3,
    chatsCount: 2,
    x: 380,
    y: 248,
  },
]);

export let chats = $state<ChatItem[]>([
  {
    id: crypto.randomUUID(),
    title: "Draft email",
    model: "claude",
    subtitle: "Write a professional follow-up to the client",
    x: 40,
    y: 248,
  },
  {
    id: crypto.randomUUID(),
    title: "Code review",
    model: "openai",
    subtitle: "Review pull request for the auth module",
    x: 720,
    y: 48,
  },
  {
    id: crypto.randomUUID(),
    title: "Translate article",
    model: "qwen",
    x: 720,
    y: 200,
  },
]);

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
    chatsCount: 0,
    x: 48 + Math.random() * 300,
    y: 48 + Math.random() * 200,
  });
}

// ─── Chat actions ─────────────────────────────────────────────────────────────

export function renameChat(id: string, title: string) {
  const item = chats.find((c) => c.id === id);
  if (item) item.title = title;
}

export function updateChatSubtitle(id: string, subtitle: string) {
  const item = chats.find((c) => c.id === id);
  if (item) item.subtitle = subtitle;
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
  });
}
