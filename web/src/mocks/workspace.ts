import { defineRoutes, get, post, put, del } from "../dev/mock-api";
import type { ChatShort } from "../lib/entities/chat";
import type { FolderShort, ResourceShort } from "../lib/entities/folder";
import type { ChatItem, FolderItem } from "../lib/entities/workspace/model/types";

// ─── Static mock data ─────────────────────────────────────────────────────────
// Keep in sync with store.svelte.ts seed data (but plain objects — no $state).

const RES_IDEAS: ResourceShort[] = [
  { id: "r-i1", name: "Competitive analysis.pdf", type: "file" },
  { id: "r-i2", name: "User interviews.docx", type: "file" },
  { id: "r-i3", name: "Market research", type: "collection" },
];

const RES_ALPHA: ResourceShort[] = [
  { id: "r-a1", name: "Architecture overview.pdf", type: "file" },
  { id: "r-a2", name: "API spec v2.yaml", type: "file" },
  { id: "r-a3", name: "ERD diagram.png", type: "file" },
  { id: "r-a4", name: "Project docs", type: "collection" },
  { id: "r-a5", name: "Design system", type: "collection" },
];

const RES_FINANCE: ResourceShort[] = [
  { id: "r-f1", name: "Q4 report.xlsx", type: "file" },
  { id: "r-f2", name: "Annual budget.xlsx", type: "file" },
  { id: "r-f3", name: "Forecasts 2025.pdf", type: "file" },
  { id: "r-f4", name: "Historical data", type: "collection" },
  { id: "r-f5", name: "KPI dashboard", type: "collection" },
  { id: "r-f6", name: "Audit trail", type: "collection" },
];

// ─── Folders ──────────────────────────────────────────────────────────────────

const FOLDERS: FolderShort[] = [
  {
    id: "folder-ideas",
    name: "Ideas",
    chats: [
      { id: "chat-roadmap", name: "Product roadmap Q2", model: "claude" },
      { id: "chat-blog", name: "Blog post outline", model: "openai" },
    ],
    resources: RES_IDEAS,
  },
  {
    id: "folder-alpha",
    name: "Project Alpha",
    chats: [
      { id: "chat-api", name: "API design review", model: "claude" },
      { id: "chat-db", name: "Database schema", model: "openai" },
      { id: "chat-sprint", name: "Sprint planning", model: "qwen" },
    ],
    resources: RES_ALPHA,
  },
  {
    id: "folder-finance",
    name: "Finance Reports",
    chats: [
      { id: "chat-q4", name: "Q4 summary", model: "llama" },
      { id: "chat-budget", name: "Budget analysis", model: "mistral" },
    ],
    resources: RES_FINANCE,
  },
];

// ─── Canvas chats ─────────────────────────────────────────────────────────────

const CHATS: ChatShort[] = [
  {
    id: "chat-email",
    name: "Draft email",
    description: "Write a professional follow-up to the client",
    model: "claude",
  },
  {
    id: "chat-review",
    name: "Code review",
    description: "Review pull request for the auth module",
    model: "openai",
  },
  {
    id: "chat-translate",
    name: "Translate article",
    description: "Translate technical article to English",
    model: "qwen",
  },
];

// ─── Route handlers ───────────────────────────────────────────────────────────

export const workspaceRoutes = defineRoutes([
  // ── Folder list ──────────────────────────────────────
  get("/workspace/folders", () => ({
    data: FOLDERS,
  })),

  // ── Folder by ID ─────────────────────────────────────
  get("/workspace/folders/:id", ({ params }) => {
    const folder = FOLDERS.find((f) => f.id === params.id);
    if (!folder) return null; // → 404
    return { data: folder };
  }),

  // ── Chat list (canvas) ────────────────────────────────
  get("/workspace/chats", () => ({
    data: CHATS,
  })),

  // ── Chat by ID ────────────────────────────────────────
  // Searches canvas chats first, then folder chats
  get("/workspace/chats/:id", ({ params }) => {
    const canvasChat = CHATS.find((c) => c.id === params.id);
    if (canvasChat) return { data: canvasChat };

    for (const folder of FOLDERS) {
      const folderChat = folder.chats.find((c) => c.id === params.id);
      if (folderChat) return { data: folderChat };
    }

    return null; // → 404
  }),

  // ── Create chat (canvas) ──────────────────────────────
  post("/workspace/chats", ({ body }) => {
    const b = body as Partial<ChatShort>;
    const created: ChatShort = {
      id: `chat-${Date.now()}`,
      name: b.name ?? "New Chat",
      description: b.description,
      model: b.model,
    };
    CHATS.push(created);
    return { data: created };
  }),

  // ── Rename / update chat ──────────────────────────────
  put("/workspace/chats/:id", ({ params, body }) => {
    const chat = CHATS.find((c) => c.id === params.id);
    if (!chat) return null; // → 404
    const b = body as Partial<ChatShort>;
    if (b.name !== undefined) chat.name = b.name;
    if (b.description !== undefined) chat.description = b.description;
    if (b.model !== undefined) chat.model = b.model;
    return { data: chat };
  }),

  // ── Delete chat ───────────────────────────────────────
  del("/workspace/chats/:id", ({ params }) => {
    const idx = CHATS.findIndex((c) => c.id === params.id);
    if (idx === -1) return null; // → 404
    CHATS.splice(idx, 1);
    // del() sets status 204 — return empty object so handler doesn't auto-404
    return {};
  }),
]);
