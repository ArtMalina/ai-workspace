export type Theme = "light" | "dark";

const STORAGE_KEY = "theme";

function getOsTheme(): Theme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function getTheme(): Theme {
  return (localStorage.getItem(STORAGE_KEY) as Theme) ?? getOsTheme();
}

export function setTheme(theme: Theme): void {
  localStorage.setItem(STORAGE_KEY, theme);
  document.documentElement.setAttribute("data-theme", theme);
}

export function initTheme(): void {
  setTheme(getTheme());
}

export function toggleTheme(): void {
  const current = document.documentElement.getAttribute("data-theme") as Theme;
  setTheme(current === "dark" ? "light" : "dark");
}
