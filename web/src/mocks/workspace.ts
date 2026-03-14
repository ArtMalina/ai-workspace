import { defineRoutes, get, post, put, del } from "../dev/mock-api";
import type { ChatMessage, MessageBlock, ChatShort } from "../lib/entities/chat";
import type { FolderShort, ResourceShort } from "../lib/entities/folder";
import type { ChatItem, FolderItem } from "../lib/entities/workspace";

// ─── Message helpers ──────────────────────────────────────────────────────────

function msg(role: ChatMessage["role"], ...blocks: MessageBlock[]): ChatMessage {
  return { id: crypto.randomUUID(), role, blocks };
}
function text(content: string): MessageBlock {
  return { type: "text", content };
}
function code(content: string, lang = "ts"): MessageBlock {
  return { type: "code", content, lang };
}

// ─── Conversations ────────────────────────────────────────────────────────────

const MSGS_EMAIL: ChatMessage[] = [
  msg(
    "user",
    text(
      "Напиши профессиональный follow-up email клиенту после встречи. Мы обсуждали внедрение новой CRM-системы.",
    ),
  ),
  msg(
    "assistant",
    text("Конечно, вот вариант письма:"),
    code(
      `Subject: Follow-up: CRM Implementation Discussion

Hi [Name],

Thank you for taking the time to meet with us yesterday.
We appreciated the opportunity to discuss how our CRM solution
can streamline your sales workflow.

As discussed, we'll prepare a tailored proposal covering:
• Implementation timeline (4–6 weeks)
• Data migration from your current system
• Team onboarding and training plan

I'll send the full proposal by Friday. In the meantime,
feel free to reach out with any questions.

Best regards,
[Your Name]`,
      "text",
    ),
  ),
  msg("user", text("Хорошо, но сделай его немного короче — слишком длинно.")),
  msg(
    "assistant",
    text("Вот более краткая версия:"),
    code(
      `Subject: Follow-up: CRM Discussion

Hi [Name],

Great speaking with you yesterday. We'll have a tailored
proposal ready by Friday covering timeline, migration, and
onboarding.

Questions before then? Just reach out.

Best,
[Your Name]`,
      "text",
    ),
  ),
];

const MSGS_CODE_REVIEW: ChatMessage[] = [
  msg(
    "user",
    text("Сделай review этого кода для модуля аутентификации:"),
    code(
      `async function login(email: string, password: string) {
  const user = await db.users.findOne({ email });
  if (!user) return null;
  const match = password === user.password;
  if (!match) return null;
  const token = jwt.sign({ id: user.id }, SECRET);
  return token;
}`,
      "ts",
    ),
  ),
  msg(
    "assistant",
    text("Вижу несколько критических проблем:"),
    text(
      "1. Пароль сравнивается в открытом виде — нужно использовать `bcrypt.compare()`. Хранить plaintext пароли категорически нельзя.\n2. `SECRET` должен быть через `process.env.JWT_SECRET` и проверяться на наличие при старте.\n3. `jwt.sign()` без `expiresIn` создаёт бессрочные токены — добавь `{ expiresIn: '15m' }`.\n4. При ошибке не стоит возвращать `null` для обоих случаев (user not found vs wrong password) — лучше единое сообщение, чтобы не давать подсказок об энумерации пользователей.",
    ),
    code(
      `async function login(email: string, password: string) {
  const user = await db.users.findOne({ email });
  if (!user) throw new AuthError("Invalid credentials");

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) throw new AuthError("Invalid credentials");

  return jwt.sign(
    { id: user.id },
    process.env.JWT_SECRET!,
    { expiresIn: "15m" },
  );
}`,
      "ts",
    ),
  ),
];

const MSGS_TRANSLATE: ChatMessage[] = [
  msg(
    "user",
    text(
      "Переведи на английский:\n\n«Искусственный интеллект трансформирует способ, которым мы работаем с данными. Модели машинного обучения позволяют автоматизировать задачи, которые раньше требовали значительных человеческих усилий.»",
    ),
  ),
  msg(
    "assistant",
    text(
      "Artificial intelligence is transforming the way we work with data. Machine learning models make it possible to automate tasks that previously required significant human effort.",
    ),
  ),
  msg("user", text("Теперь сделай вариант для технического блога — чуть более формальный стиль.")),
  msg(
    "assistant",
    text(
      "Artificial intelligence is fundamentally reshaping data workflows across industries. By leveraging machine learning models, organizations can automate complex, labor-intensive tasks—unlocking efficiency gains that were previously unattainable at scale.",
    ),
  ),
];

const MSGS_ROADMAP: ChatMessage[] = [
  msg(
    "user",
    text(
      "Давай набросаем фичи для product roadmap на Q2. Основной продукт — AI-ассистент для разработчиков.",
    ),
  ),
  msg(
    "assistant",
    text("Вот структура roadmap на Q2, разбитая по приоритетам:"),
    text(
      "**Must-have:**\n• Контекстные подсказки кода с учётом всего проекта\n• Интеграция с GitHub/GitLab (PR review, blame)\n• Поддержка мультифайлового редактирования\n\n**Should-have:**\n• Голосовой ввод запросов\n• История чатов с поиском\n• Inline-документация по hover\n\n**Nice-to-have:**\n• Плагин для JetBrains IDE\n• Экспорт сессии в Notion/Confluence",
    ),
  ),
  msg("user", text("Хорошо. Какие риски у Must-have блока?")),
  msg(
    "assistant",
    text(
      "Основные риски:\n\n**Контекст всего проекта** — большие монорепозитории могут превысить контекстное окно модели. Нужен умный chunking + семантическое ранжирование фрагментов.\n\n**GitHub-интеграция** — OAuth-флоу требует проверки безопасности (scope минимизация). PR review на больших диффах — проблема латентности.\n\n**Мультифайловое редактирование** — конфликты при параллельных изменениях, нужна стратегия merge или lock.",
    ),
  ),
];

const MSGS_BLOG: ChatMessage[] = [
  msg("user", text("Помоги набросать outline для статьи «Как LLM меняют процесс code review».")),
  msg(
    "assistant",
    text("Предлагаю такую структуру:"),
    text(
      "1. **Введение** — почему code review — узкое место в разработке\n2. **Как LLM понимают код** — embeddings, AST, контекст\n3. **Что LLM делают хорошо** — поиск багов, стиль, документация\n4. **Ограничения** — галлюцинации, нет runtime-контекста, нет понимания бизнес-требований\n5. **Гибридный подход** — человек + AI как reviewer\n6. **Инструменты обзор** — CodeRabbit, GitHub Copilot, Cursor\n7. **Заключение** — прогноз на 2–3 года",
    ),
  ),
];

const MSGS_API: ChatMessage[] = [
  msg("user", text("Нам нужно спроектировать API для сервиса уведомлений. REST или GraphQL?")),
  msg(
    "assistant",
    text(
      "Для сервиса уведомлений **REST будет лучше** по нескольким причинам:\n\n• Уведомления — типичный push/CRUD без сложных связей → REST-эндпоинты прямолинейны\n• WebSocket/SSE для realtime лучше сочетаются с REST, чем с GraphQL subscriptions\n• Меньше overhead на клиенте (нет необходимости в Apollo/urql)\n• Кеширование на уровне HTTP (ETag, Cache-Control) работает нативно\n\nGraphQL имеет смысл, если в будущем появится сложная агрегация данных между сущностями.",
    ),
    code(
      `POST   /notifications          # создать
GET    /notifications          # список (пагинация)
PATCH  /notifications/:id      # пометить прочитанным
DELETE /notifications/:id      # удалить
POST   /notifications/read-all # массовое прочтение`,
      "http",
    ),
  ),
];

const MSGS_DB: ChatMessage[] = [
  msg(
    "user",
    text(
      "Нужна схема для таблицы чатов в Postgres. Чаты могут быть в папках или на рабочем столе.",
    ),
  ),
  msg(
    "assistant",
    text("Предлагаю такую схему:"),
    code(
      `CREATE TABLE folders (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES users(id),
  title      TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE chats (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES users(id),
  folder_id  UUID REFERENCES folders(id) ON DELETE SET NULL,
  title      TEXT NOT NULL DEFAULT 'New Chat',
  model      TEXT,
  canvas_x   FLOAT,  -- NULL если в папке
  canvas_y   FLOAT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE messages (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id    UUID NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
  role       TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content    JSONB NOT NULL,  -- массив блоков
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_chats_folder   ON chats(folder_id);
CREATE INDEX idx_chats_user     ON chats(user_id);
CREATE INDEX idx_messages_chat  ON messages(chat_id);`,
      "sql",
    ),
    text(
      "`folder_id = NULL` означает, что чат на канвасе. `canvas_x/y` — позиция на рабочем столе, NULL для чатов в папке.",
    ),
  ),
];

const MSGS_SPRINT: ChatMessage[] = [
  msg(
    "user",
    text(
      "Давай спланируем спринт. В беклоге: авторизация, профиль пользователя, загрузка файлов, дашборд аналитики.",
    ),
  ),
  msg(
    "assistant",
    text(
      "Предлагаю взять в спринт (2 недели):\n\n**В спринт (высокий приоритет):**\n• Авторизация (email + OAuth) — блокирует всё остальное\n• Профиль пользователя (базовый CRUD) — нужен для персонализации\n\n**Следующий спринт:**\n• Загрузка файлов — зависит от S3/хранилища, нужна отдельная задача на infra\n• Дашборд аналитики — требует данных минимум за 2–4 недели\n\n**Story points (оценка):**\nАвторизация: 8 SP | Профиль: 5 SP → итого ~13 SP, укладываемся в velocity.",
    ),
  ),
];

const MSGS_Q4: ChatMessage[] = [
  msg(
    "user",
    text(
      "Помоги написать summary для Q4 финансового отчёта. Выручка выросла на 18%, EBITDA — 11 млн, churn — 4.2%.",
    ),
  ),
  msg(
    "assistant",
    text(
      "Q4 Financial Highlights:\n\nRevenue growth of 18% YoY reflects strong demand across all segments, driven primarily by enterprise subscriptions (+24%) and expansion revenue from existing accounts.\n\nEBITDA of $11M represents a margin of approximately [X]%—consistent with our full-year guidance. Operating leverage improved as customer acquisition costs declined 9% while average contract value increased.\n\nMonthly churn of 4.2% remains a key focus area. Retention initiatives launched in Q3 are showing early positive signals; we expect churn to trend toward 3.5% by Q2 next year.",
    ),
  ),
];

const MSGS_BUDGET: ChatMessage[] = [
  msg(
    "user",
    text("Маркетинговый бюджет на следующий год — 2.4 млн. Как распределить по каналам?"),
  ),
  msg(
    "assistant",
    text("Рекомендуемое распределение для B2B SaaS:"),
    code(
      `Paid Search (Google/Bing)   28%  →  $672k
Content & SEO              20%  →  $480k
Events & Conferences       18%  →  $432k
Paid Social (LinkedIn)     14%  →  $336k
Partner / Affiliate        10%  →  $240k
Email & Nurture             6%  →  $144k
Brand & PR                  4%  →   $96k
───────────────────────────────────────
TOTAL                      100% → $2.4M`,
      "text",
    ),
    text(
      "Paid Search приоритетен — прямой intent и быстрая атрибуция. Content/SEO даёт долгосрочный compounding ROI. Events критичны для enterprise-сделок (длинный цикл). LinkedIn дорог, но точен по ICP.",
    ),
  ),
];

// ─── Resources ────────────────────────────────────────────────────────────────

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

// ─── Seed data (shared with store for in-memory state init) ───────────────────

/**
 * Full folder items with canvas positions and nested chat sessions.
 * Exported so `store.svelte.ts` can seed its reactive state from the
 * same source of truth, keeping IDs and content in sync.
 */
export const SEED_FOLDERS: FolderItem[] = [
  {
    id: "folder-ideas",
    title: "Ideas",
    llmBrands: ["openai", "claude"],
    filesCount: 2,
    collectionsCount: 1,
    x: 40,
    y: 48,
    chats: [
      { id: "chat-roadmap", title: "Product roadmap Q2", model: "claude", messages: MSGS_ROADMAP },
      { id: "chat-blog", title: "Blog post outline", model: "openai", messages: MSGS_BLOG },
    ],
    resources: RES_IDEAS,
  },
  {
    id: "folder-alpha",
    title: "Project Alpha",
    llmBrands: ["claude", "openai", "qwen"],
    filesCount: 12,
    collectionsCount: 2,
    x: 380,
    y: 48,
    chats: [
      { id: "chat-api", title: "API design review", model: "claude", messages: MSGS_API },
      { id: "chat-db", title: "Database schema", model: "openai", messages: MSGS_DB },
      { id: "chat-sprint", title: "Sprint planning", model: "qwen", messages: MSGS_SPRINT },
    ],
    resources: RES_ALPHA,
  },
  {
    id: "folder-finance",
    title: "Finance Reports",
    llmBrands: ["llama", "mistral"],
    filesCount: 4,
    collectionsCount: 3,
    x: 380,
    y: 248,
    chats: [
      { id: "chat-q4", title: "Q4 summary", model: "llama", messages: MSGS_Q4 },
      { id: "chat-budget", title: "Budget analysis", model: "mistral", messages: MSGS_BUDGET },
    ],
    resources: RES_FINANCE,
  },
];

/**
 * Canvas chat items with positions and full message history.
 * Exported so `store.svelte.ts` can seed its reactive state.
 */
export const SEED_CHATS: ChatItem[] = [
  {
    id: "chat-email",
    title: "Draft email",
    model: "claude",
    subtitle: "Write a professional follow-up to the client",
    x: 40,
    y: 248,
    messages: MSGS_EMAIL,
  },
  {
    id: "chat-review",
    title: "Code review",
    model: "openai",
    subtitle: "Review pull request for the auth module",
    x: 720,
    y: 48,
    messages: MSGS_CODE_REVIEW,
  },
  {
    id: "chat-translate",
    title: "Translate article",
    model: "qwen",
    subtitle: "Translate technical article to English",
    x: 720,
    y: 200,
    messages: MSGS_TRANSLATE,
  },
];

// ─── Short projections for list endpoints ─────────────────────────────────────

const FOLDER_SHORTS: FolderShort[] = SEED_FOLDERS.map((f) => ({
  id: f.id,
  name: f.title,
  chats: f.chats.map((c) => ({ id: c.id, name: c.title, model: c.model })),
  resources: f.resources as ResourceShort[],
}));

const CHAT_SHORTS: ChatShort[] = SEED_CHATS.map((c) => ({
  id: c.id,
  name: c.title,
  description: c.subtitle,
  model: c.model,
}));

// ─── Route handlers ───────────────────────────────────────────────────────────

export const workspaceRoutes = defineRoutes([
  // ── Folder list — short models ────────────────────────
  get("/workspace/folders", () => ({ data: FOLDER_SHORTS })),

  // ── Folder by ID — full model ─────────────────────────
  get("/workspace/folders/:id", ({ params }) => {
    const folder = FOLDER_SHORTS.find((f) => f.id === params.id);
    if (!folder) return null; // → 404
    return { data: folder };
  }),

  // ── Chat list (canvas) — short models ─────────────────
  get("/workspace/chats", () => ({ data: CHAT_SHORTS })),

  // ── Chat by ID — full session with messages ───────────
  // Searches canvas chats first, then all folder chats
  get("/workspace/chats/:id", ({ params }) => {
    const canvas = SEED_CHATS.find((c) => c.id === params.id);
    if (canvas) return { data: canvas };

    for (const folder of SEED_FOLDERS) {
      const fc = folder.chats.find((c) => c.id === params.id);
      if (fc) return { data: fc };
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
    CHAT_SHORTS.push(created);
    return { data: created };
  }),

  // ── Rename / update chat ──────────────────────────────
  put("/workspace/chats/:id", ({ params, body }) => {
    const chat = CHAT_SHORTS.find((c) => c.id === params.id);
    if (!chat) return null; // → 404
    const b = body as Partial<ChatShort>;
    if (b.name !== undefined) chat.name = b.name;
    if (b.description !== undefined) chat.description = b.description;
    if (b.model !== undefined) chat.model = b.model;
    return { data: chat };
  }),

  // ── Delete chat ───────────────────────────────────────
  del("/workspace/chats/:id", ({ params }) => {
    const idx = CHAT_SHORTS.findIndex((c) => c.id === params.id);
    if (idx === -1) return null; // → 404
    CHAT_SHORTS.splice(idx, 1);
    return {};
  }),
]);
