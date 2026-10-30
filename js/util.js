// util.js — small shared helpers used across the app.

export function esc(s) {
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function wordCount(text) {
  const m = (text || "").trim().match(/[\w']+/g);
  return m ? m.length : 0;
}

export function debounce(fn, ms) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
}

export function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export function fmtDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

export function fmtTime(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function fmtRelative(iso) {
  if (!iso) return "";
  const d = new Date(iso).getTime();
  if (Number.isNaN(d)) return "";
  const diff = Date.now() - d;
  const min = 60000, hr = 3600000, day = 86400000;
  if (diff < min) return "just now";
  if (diff < hr) return `${Math.floor(diff / min)} min ago`;
  if (diff < day) return `${Math.floor(diff / hr)} hr ago`;
  if (diff < day * 7) return `${Math.floor(diff / day)} day${Math.floor(diff / day) >= 2 ? "s" : ""} ago`;
  return fmtDate(iso);
}

// Simple word-level LCS diff: returns ops [{t:'same'|'del'|'ins', w}].
export function diffWords(a, b) {
  const A = (a || "").split(/\s+/).filter(Boolean);
  const B = (b || "").split(/\s+/).filter(Boolean);
  const n = A.length, m = B.length;
  const dp = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      dp[i][j] = A[i] === B[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }
  const ops = [];
  let i = 0, j = 0;
  while (i < n && j < m) {
    if (A[i] === B[j]) { ops.push({ t: "same", w: A[i] }); i++; j++; }
    else if (dp[i + 1][j] >= dp[i][j + 1]) { ops.push({ t: "del", w: A[i] }); i++; }
    else { ops.push({ t: "ins", w: B[j] }); j++; }
  }
  while (i < n) ops.push({ t: "del", w: A[i++] });
  while (j < m) ops.push({ t: "ins", w: B[j++] });
  return ops;
}

// CEFR level accent colours (used for badges and borders).
export const LEVEL_COLORS = {
  A1: "#16a34a",
  A2: "#0d9488",
  B1: "#0284c7",
  B2: "#4f46e5",
  C1: "#7c3aed",
  C2: "#db2777",
};
export function levelColor(id) { return LEVEL_COLORS[id] || "#0f766e"; }

export const LEVEL_ORDER = ["A1", "A2", "B1", "B2", "C1", "C2"];
