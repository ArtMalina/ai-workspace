// ─── Path matcher ─────────────────────────────────────────────────────────────
//
// Converts patterns like "/workspace/chats/:id/messages" into a RegExp and
// extracts the named param values from a real pathname.

interface Compiled {
  regex: RegExp;
  paramNames: string[];
}

const cache = new Map<string, Compiled>();

function compile(pattern: string): Compiled {
  if (cache.has(pattern)) return cache.get(pattern)!;

  const paramNames: string[] = [];
  const regexStr = pattern
    // Escape regex meta chars that could appear in paths (except : and *)
    .replace(/[.+?^${}()|[\]\\]/g, "\\$&")
    // Replace :param segments
    .replace(/:([A-Za-z_][A-Za-z0-9_]*)/g, (_full, name: string) => {
      paramNames.push(name);
      return "([^/]+)";
    })
    // Replace bare wildcard *
    .replace(/\*/g, "(.*)");

  const compiled: Compiled = {
    regex: new RegExp(`^${regexStr}$`),
    paramNames,
  };
  cache.set(pattern, compiled);
  return compiled;
}

export interface MatchResult {
  params: Record<string, string>;
}

/**
 * Tries to match `pathname` against a route `pattern`.
 * Returns the extracted params on success, `null` on no match.
 *
 * @example
 *   matchPath("/workspace/chats/:id", "/workspace/chats/abc")
 *   // → { params: { id: "abc" } }
 */
export function matchPath(pattern: string, pathname: string): MatchResult | null {
  const { regex, paramNames } = compile(pattern);
  const match = pathname.match(regex);
  if (!match) return null;

  const params: Record<string, string> = {};
  paramNames.forEach((name, i) => {
    params[name] = decodeURIComponent(match[i + 1]);
  });
  return { params };
}
