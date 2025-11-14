// ===== Util =====
const qs = (sel, parent = document) => parent.querySelector(sel);

// ===== Theme Toggle (persist with localStorage) =====
const themeToggle = qs("#themeToggle");
const THEME_KEY = "theme";

function applyTheme(theme) {
  // theme: 'light' | 'dark'
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem(THEME_KEY, theme);
  themeToggle.textContent = theme === "dark" ? "Light" : "Dark";
}

function initTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  const prefersDark = window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  const initial = saved || (prefersDark ? "dark" : "light");
  applyTheme(initial);
}

themeToggle.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme") || "light";
  applyTheme(current === "light" ? "dark" : "light");
});

// ===== Counter =====
const countEl = qs("#count");
const incBtn = qs("#incBtn");
const decBtn = qs("#decBtn");
const resetBtn = qs("#resetBtn");
const COUNT_KEY = "count";

function setCount(n) {
  countEl.textContent = String(n);
  localStorage.setItem(COUNT_KEY, String(n));
  decBtn.disabled = n <= 0;
}

function initCount() {
  const saved = Number(localStorage.getItem(COUNT_KEY)) || 0;
  setCount(saved);
}

incBtn.addEventListener("click", () => setCount(Number(countEl.textContent) + 1));
decBtn.addEventListener("click", () => setCount(Math.max(0, Number(countEl.textContent) - 1)));
resetBtn.addEventListener("click", () => setCount(0));

// ===== Todo Mini =====
const todoForm = qs("#todoForm");
const todoInput = qs("#todoInput");
const todoList = qs("#todoList");
const clearBtn = qs("#clearTodos");
const TODOS_KEY = "todos";

function renderTodos(items) {
  todoList.innerHTML = "";
  items.forEach((todo, idx) => {
    const li = document.createElement("li");
    const span = document.createElement("span");
    span.textContent = todo;

    const del = document.createElement("button");
    del.textContent = "Hapus";
    del.addEventListener("click", () => {
      const next = getTodos().filter((_, i) => i !== idx);
      saveTodos(next);
      renderTodos(next);
    });

    li.append(span, del);
    todoList.appendChild(li);
  });
}

function getTodos() {
  try {
    return JSON.parse(localStorage.getItem(TODOS_KEY)) || [];
  } catch {
    return [];
  }
}

function saveTodos(items) {
  localStorage.setItem(TODOS_KEY, JSON.stringify(items));
}

todoForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const value = todoInput.value.trim();
  if (!value) return;

  const next = [...getTodos(), value];
  saveTodos(next);
  renderTodos(next);
  todoInput.value = "";
});

clearBtn.addEventListener("click", () => {
  saveTodos([]);
  renderTodos([]);
});

// ===== Init =====
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initCount();
  renderTodos(getTodos());
});
