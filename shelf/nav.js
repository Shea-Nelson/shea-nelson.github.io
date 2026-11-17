/* Wires the theme control. The header itself is in the page so it paints with the HTML. */
const THEME_KEY = "shelf-theme";
const THEME_COLOR = { light: "#f4efe6", dark: "#161310" };

function systemDark() {
  return matchMedia("(prefers-color-scheme: dark)").matches;
}

function readStored() {
  try {
    const t = localStorage.getItem(THEME_KEY);
    return t === "light" || t === "dark" ? t : "";
  } catch (e) {
    return "";
  }
}

function applyScheme(next) {
  const meta = document.querySelector('meta[name="color-scheme"]');
  if (meta) meta.content = next || "light dark";
  if (next) document.documentElement.setAttribute("data-theme", next);
  else document.documentElement.removeAttribute("data-theme");
  try {
    if (next) localStorage.setItem(THEME_KEY, next);
    else localStorage.removeItem(THEME_KEY);
  } catch (e) {}
  document.querySelectorAll('meta[name="theme-color"]').forEach((node) => {
    if (next) node.content = THEME_COLOR[next];
    else node.content = node.media.includes("dark") ? THEME_COLOR.dark : THEME_COLOR.light;
  });
  const btn = document.querySelector(".theme-btn");
  if (!btn) return;
  const dark = next ? next === "dark" : systemDark();
  btn.setAttribute("aria-pressed", dark ? "true" : "false");
  btn.setAttribute("aria-label", dark ? "Switch to light colors" : "Switch to dark colors");
}

function toggleScheme() {
  const stored = readStored();
  const renderedDark = stored ? stored === "dark" : systemDark();
  const target = renderedDark ? "light" : "dark";
  const system = systemDark() ? "dark" : "light";
  /* Matching the system preference clears the pin so later OS changes still apply. */
  applyScheme(target === system ? "" : target);
}

const path = location.pathname.replace(/\/index\.html$/, "/");
const here = /^\/bible-study(\/|$)/.test(path) ? "bible"
  : /^\/grok-lessons(\/|$)/.test(path) ? "lesson"
  : /^\/family-time(\/|$)/.test(path) ? "family"
  : /^\/game-library(\/|$)/.test(path) ? "games"
  : /^\/kitchen\/recipes(\/|$)/.test(path) ? "recipes"
  : /^\/kitchen\/planner(\/|$)/.test(path) ? "planner"
  : /^\/workout-app(\/|$)/.test(path) ? "workout"
  : "hub";
const keys = ["workout", "recipes", "planner", "bible", "lesson", "family", "games", "hub"];
document.querySelectorAll("header.site nav a:not([target])").forEach((a, i) => {
  if (keys[i] === here) a.setAttribute("aria-current", "page");
  else a.removeAttribute("aria-current");
});

const themeBtn = document.querySelector(".theme-btn");
if (themeBtn) themeBtn.addEventListener("click", toggleScheme);
applyScheme(readStored());

window.addEventListener("storage", (event) => {
  if (event.key !== THEME_KEY) return;
  const next = event.newValue === "light" || event.newValue === "dark" ? event.newValue : "";
  applyScheme(next);
});
matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
  if (!readStored()) applyScheme("");
});
