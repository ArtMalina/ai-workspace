<script lang="ts">
  import { LlmIcon } from "$lib/shared/ui";
  import type { LlmBrandTypes } from "$lib/entities/llm";

  interface Props {
    model?: LlmBrandTypes;
  }

  const { model = "claude" }: Props = $props();

  type MessageRole = "user" | "assistant";
  interface Block {
    type: "text" | "code";
    content: string;
    lang?: string;
  }
  interface Message {
    id: string;
    role: MessageRole;
    blocks: Block[];
  }

  // ── Mock conversation ────────────────────────────────────
  const MOCK: Message[] = [
    {
      id: "1",
      role: "user",
      blocks: [{ type: "text", content: "Объясни, как работают замыкания в JavaScript." }],
    },
    {
      id: "2",
      role: "assistant",
      blocks: [
        {
          type: "text",
          content:
            "Замыкание — это функция, которая «запоминает» лексическое окружение, в котором была создана, и сохраняет доступ к переменным этого окружения даже после того, как внешняя функция завершила выполнение.",
        },
        {
          type: "code",
          lang: "js",
          content: `function makeCounter() {
  let count = 0;
  return function () {
    count += 1;
    return count;
  };
}

const counter = makeCounter();
console.log(counter()); // 1
console.log(counter()); // 2
console.log(counter()); // 3`,
        },
        {
          type: "text",
          content:
            "Здесь внутренняя функция «замыкает» переменную count. Каждый вызов counter() обращается к той же ячейке памяти, поэтому значение сохраняется между вызовами.",
        },
      ],
    },
    {
      id: "3",
      role: "user",
      blocks: [{ type: "text", content: "Покажи практический пример — например, мемоизацию." }],
    },
    {
      id: "4",
      role: "assistant",
      blocks: [
        {
          type: "text",
          content:
            "Конечно. Мемоизация — классический случай, где замыкание хранит кэш вычисленных результатов:",
        },
        {
          type: "code",
          lang: "js",
          content: `function memoize(fn) {
  const cache = new Map();
  return function (...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}

const fib = memoize(function (n) {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);
});

console.log(fib(40)); // быстро, благодаря кэшу`,
        },
        {
          type: "text",
          content:
            "Переменная cache живёт в замыкании — она недоступна снаружи, но сохраняется на протяжении всего времени жизни возвращённой функции.",
        },
      ],
    },
  ];
</script>

<div class="mt">
  {#each MOCK as msg (msg.id)}
    <div class="mt__row mt__row--{msg.role}">
      {#if msg.role === "assistant"}
        <div class="mt__avatar">
          <LlmIcon brand={model} size={14} />
        </div>
      {/if}

      <div class="mt__bubble mt__bubble--{msg.role}">
        {#each msg.blocks as block, i (i)}
          {#if block.type === "text"}
            <p class="mt__text">{block.content}</p>
          {:else}
            <div class="mt__code-wrap">
              {#if block.lang}
                <span class="mt__code-lang">{block.lang}</span>
              {/if}
              <pre class="mt__code"><code>{block.content}</code></pre>
            </div>
          {/if}
        {/each}
      </div>
    </div>
  {/each}
</div>

<style>
  /* ── Shell ──────────────────────────────────────────────── */
  .mt {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-4);
    width: 100%;
  }

  /* ── Row ────────────────────────────────────────────────── */
  .mt__row {
    display: flex;
    align-items: flex-end;
    gap: var(--spacing-2);
  }

  .mt__row--user {
    flex-direction: row-reverse;
  }

  .mt__row--assistant {
    flex-direction: row;
  }

  /* ── Avatar ─────────────────────────────────────────────── */
  .mt__avatar {
    flex-shrink: 0;
    width: 1.75rem;
    height: 1.75rem;
    border-radius: var(--radius-md);
    background: var(--color-neutral-100);
    border: 1px solid var(--color-neutral-200);
    display: flex;
    align-items: center;
    justify-content: center;
    align-self: flex-end;
  }

  :global([data-theme="dark"]) .mt__avatar {
    background: var(--color-neutral-700);
    border-color: var(--color-neutral-600);
  }

  /* ── Bubble ─────────────────────────────────────────────── */
  .mt__bubble {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-3);
    max-width: min(38rem, 78%);
    padding: var(--spacing-3) var(--spacing-4);
    border-radius: var(--radius-lg);
    line-height: var(--leading-normal);
  }

  /* User bubble */
  .mt__bubble--user {
    background: var(--btn-brand-fill-bg);
    color: var(--btn-brand-fill-fg);
    border-bottom-right-radius: var(--radius-sm);
  }

  /* Assistant bubble */
  .mt__bubble--assistant {
    background: var(--color-neutral-50);
    border: 1px solid var(--color-neutral-200);
    color: var(--text-primary);
    border-bottom-left-radius: var(--radius-sm);
  }

  :global([data-theme="dark"]) .mt__bubble--assistant {
    background: var(--color-neutral-700);
    border-color: var(--color-neutral-600);
    color: var(--color-neutral-100);
  }

  /* ── Text paragraph ─────────────────────────────────────── */
  .mt__text {
    margin: 0;
    font-size: var(--text-sm);
  }

  /* ── Code block ─────────────────────────────────────────── */
  .mt__code-wrap {
    position: relative;
    border-radius: var(--radius-md);
    overflow: hidden;
    background: var(--color-neutral-900);
    border: 1px solid var(--color-neutral-700);
  }

  :global([data-theme="dark"]) .mt__code-wrap {
    background: var(--color-neutral-950);
    border-color: var(--color-neutral-700);
  }

  .mt__code-lang {
    display: block;
    padding: 0.375rem var(--spacing-3);
    font-size: 0.6875rem;
    font-family: var(--font-mono);
    font-weight: var(--font-weight-medium);
    color: var(--color-neutral-400);
    background: var(--color-neutral-800);
    border-bottom: 1px solid var(--color-neutral-700);
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  :global([data-theme="dark"]) .mt__code-lang {
    background: var(--color-neutral-900);
  }

  .mt__code {
    margin: 0;
    padding: var(--spacing-3) var(--spacing-4);
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    line-height: 1.65;
    color: #e2e8f0;
    overflow-x: auto;
    white-space: pre;
  }
</style>
