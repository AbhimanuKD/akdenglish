// store.js — all local state, persistence, and backup. No backend, no login.
// Everything is stored in the browser (localStorage). Pure-ish core for testability.

const KEYS = {
  settings: "ews.settings.v1",
  profile: "ews.profile.v1",
  progress: "ews.progress.v1",
  drafts: "ews.drafts.v1",
  writing: "ews.writing.v1",
};

const BACKUP_VERSION = 1;
const HISTORY_LIMIT = 300;

// Storage backend (swappable for tests). Defaults to localStorage in the browser.
let backend = null;
function defaultBackend() {
  if (typeof window !== "undefined" && window.localStorage) {
    return {
      get(k) { try { return window.localStorage.getItem(k); } catch { return null; } },
      set(k, v) { try { window.localStorage.setItem(k, v); return true; } catch { return false; } },
      remove(k) { try { window.localStorage.removeItem(k); } catch {} },
    };
  }
  return null;
}
function storage() {
  if (backend) return backend;
  backend = defaultBackend();
  return backend;
}
export function setBackend(b) { backend = b; }

function read(key, fallback) {
  const s = storage();
  if (!s) return fallback;
  const raw = s.get(key);
  if (raw == null) return fallback;
  try { return JSON.parse(raw); } catch { return fallback; }
}
function write(key, value) {
  const s = storage();
  if (!s) return false;
  try { return s.set(key, JSON.stringify(value)); } catch { return false; }
}

export const DEFAULT_SETTINGS = {
  appearance: "system", // "light" | "dark" | "system"
  level: "A1",          // preferred level
  suggestions: true,    // writing suggestions on/off
  sound: { scape: null, volume: 0.5, muted: false },
  ai: { endpoint: "", key: "" }, // optional AI feedback (user-configured only)
};

export const ADJECTIVES = ["Cheerful", "Calm", "Curious", "Bright", "Kind", "Brave", "Gentle", "Wise", "Eager", "Thoughtful"];
export const NOUNS = ["Writer", "Explorer", "Learner", "Storyteller", "Dreamer", "Reader", "Thinker", "Creator", "Traveller", "Pioneer"];
export const EMOJIS = ["🌱", "🌿", "✍️", "🕊️", "🌼", "🐚", "🌟", "📚", "🍃", "🪴"];

export function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}
export function nowIso() { return new Date().toISOString(); }
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

export function generateName() {
  return `${pick(ADJECTIVES)} ${pick(NOUNS)}`;
}

export function defaultProfile() {
  return {
    name: generateName(),
    emoji: pick(EMOJIS),
    createdAt: nowIso(),
    updatedAt: nowIso(),
  };
}

function defaultProgress() {
  return {
    activities: {},      // id -> { practised, completed, attempts, lastAt, maxWords }
    skills: {},          // skillId -> { count, lastAt }
    reviews: {},         // levelId -> { attempts, lastAt, result }
    placement: null,     // { suggestedLevel, completedAt }
    lastActivity: null,  // { id, at }
    history: [],         // [{ at, type, label, activityId }]
  };
}

export function defaultState() {
  return {
    profile: defaultProfile(),
    settings: { ...DEFAULT_SETTINGS, sound: { ...DEFAULT_SETTINGS.sound }, ai: { ...DEFAULT_SETTINGS.ai } },
    progress: defaultProgress(),
    drafts: {},          // id -> { text, updatedAt, versions: [{ id, text, at, label }] }
    writing: [],         // [{ id, title, text, activityId, levelId, type, topic, createdAt, updatedAt }]
  };
}

// ---------- Load / save ----------
export function getSettings() {
  return { ...DEFAULT_SETTINGS, ...read(KEYS.settings, {}), sound: { ...DEFAULT_SETTINGS.sound, ...(read(KEYS.settings, {}).sound || {}) }, ai: { ...DEFAULT_SETTINGS.ai, ...(read(KEYS.settings, {}).ai || {}) } };
}
export function saveSettings(patch) {
  const cur = getSettings();
  const next = { ...cur, ...patch };
  if (patch && patch.sound) next.sound = { ...cur.sound, ...patch.sound };
  if (patch && patch.ai) next.ai = { ...cur.ai, ...patch.ai };
  write(KEYS.settings, next);
  return next;
}

export function getProfile() {
  const p = read(KEYS.profile, null);
  if (!p || !p.name) {
    const fresh = defaultProfile();
    write(KEYS.profile, fresh);
    return fresh;
  }
  return p;
}
export function saveProfile(patch) {
  const p = { ...getProfile(), ...patch, updatedAt: nowIso() };
  write(KEYS.profile, p);
  return p;
}

export function getProgress() {
  return read(KEYS.progress, defaultProgress());
}
function saveProgress(p) { write(KEYS.progress, p); return p; }

export function getDrafts() { return read(KEYS.drafts, {}); }
function saveDrafts(d) { write(KEYS.drafts, d); return d; }

export function getWriting() { return read(KEYS.writing, []); }
function saveWriting(w) { write(KEYS.writing, w); return w; }

// ---------- Drafts & versions ----------
export function getDraft(id) {
  const d = getDrafts()[id];
  return d || { text: "", updatedAt: null, versions: [] };
}

// Save a draft (used by autosave + explicit save). Returns the updated draft.
export function saveDraft(id, text) {
  const drafts = getDrafts();
  const cur = drafts[id] || { text: "", updatedAt: null, versions: [] };
  const next = { ...cur, text, updatedAt: nowIso() };
  drafts[id] = next;
  saveDrafts(drafts);
  return next;
}

// Persist small extra metadata on a draft (e.g. chosen topic), without touching text/versions.
export function saveDraftMeta(id, meta) {
  const drafts = getDrafts();
  const cur = drafts[id] || { text: "", updatedAt: null, versions: [] };
  drafts[id] = { ...cur, ...meta, updatedAt: cur.updatedAt || nowIso() };
  saveDrafts(drafts);
  return drafts[id];
}

// Snapshot a version (first draft / revision). Returns the new version.
export function addVersion(id, text, label) {
  const drafts = getDrafts();
  const cur = drafts[id] || { text: "", updatedAt: nowIso(), versions: [] };
  const v = { id: uid(), text, at: nowIso(), label: label || "Revision" };
  const versions = [...cur.versions, v];
  drafts[id] = { ...cur, text, updatedAt: nowIso(), versions };
  saveDrafts(drafts);
  return v;
}

// ---------- Progress ----------
export function getActivityProgress(id) {
  return getProgress().activities[id] || null;
}

// Record practice for an activity: skills practised, completion, history, last activity.
export function recordPractice(activityId, words, minWords, skills, meta) {
  const p = getProgress();
  const prev = p.activities[activityId] || {};
  const maxWords = Math.max(prev.maxWords || 0, words || 0);
  const completed = prev.completed || (maxWords >= minWords && maxWords > 0);
  p.activities[activityId] = {
    practised: true,
    completed,
    attempts: (prev.attempts || 0) + 1,
    lastAt: nowIso(),
    maxWords,
  };
  // Skills practised (recorded whenever the learner writes something, not just clicks).
  if (skills && Array.isArray(skills)) {
    for (const s of skills) {
      const sp = p.skills[s] || { count: 0, lastAt: null };
      p.skills[s] = { count: sp.count + 1, lastAt: nowIso() };
    }
  }
  p.lastActivity = { id: activityId, at: nowIso() };
  p.history.unshift({
    at: nowIso(),
    type: meta && meta.type ? meta.type : "practice",
    label: meta && meta.label ? meta.label : activityId,
    activityId,
  });
  p.history = p.history.slice(0, HISTORY_LIMIT);
  return saveProgress(p);
}

export function recordReview(levelId, result) {
  const p = getProgress();
  const prev = p.reviews[levelId] || { attempts: 0, lastAt: null, result: null };
  p.reviews[levelId] = {
    attempts: prev.attempts + 1,
    lastAt: nowIso(),
    result: { ...result, completedAt: nowIso() },
  };
  p.history.unshift({ at: nowIso(), type: "review", label: `Level ${levelId} review`, activityId: levelId });
  p.history = p.history.slice(0, HISTORY_LIMIT);
  return saveProgress(p);
}

export function setPlacement(suggestedLevel) {
  const p = getProgress();
  p.placement = { suggestedLevel, completedAt: nowIso() };
  return saveProgress(p);
}

export function setLastActivity(id) {
  const p = getProgress();
  p.lastActivity = { id, at: nowIso() };
  return saveProgress(p);
}

export function getLastActivity() {
  return getProgress().lastActivity;
}

// ---------- My Writing ----------
export function createWriting(piece) {
  const w = getWriting();
  const item = {
    id: uid(),
    title: piece.title || "Untitled writing",
    text: piece.text || "",
    activityId: piece.activityId || null,
    levelId: piece.levelId || null,
    type: piece.type || "",
    topic: piece.topic || "",
    createdAt: nowIso(),
    updatedAt: nowIso(),
  };
  w.unshift(item);
  saveWriting(w);
  return item;
}
export function updateWriting(id, patch) {
  const w = getWriting();
  const idx = w.findIndex((x) => x.id === id);
  if (idx === -1) return null;
  w[idx] = { ...w[idx], ...patch, updatedAt: nowIso() };
  saveWriting(w);
  return w[idx];
}
export function deleteWriting(id) {
  const w = getWriting().filter((x) => x.id !== id);
  saveWriting(w);
  return w;
}
export function getWritingById(id) {
  return getWriting().find((x) => x.id === id) || null;
}

// ---------- Backup ----------
export function exportBackup() {
  return {
    app: "english-writing-studio",
    version: BACKUP_VERSION,
    exportedAt: nowIso(),
    profile: getProfile(),
    settings: getSettings(),
    progress: getProgress(),
    drafts: getDrafts(),
    writing: getWriting(),
  };
}

export function validateBackup(data) {
  if (!data || typeof data !== "object") return { ok: false, error: "The file is empty or not valid JSON." };
  if (data.app !== "english-writing-studio") return { ok: false, error: "This file is not an English Writing Studio backup." };
  if (!data.version || data.version > BACKUP_VERSION) return { ok: false, error: "This backup was made by a newer version and cannot be opened here." };
  return { ok: true };
}

// Replace all local data with the backup contents.
export function importBackup(data) {
  const check = validateBackup(data);
  if (!check.ok) return check;
  if (data.profile) write(KEYS.profile, data.profile);
  if (data.settings) write(KEYS.settings, data.settings);
  if (data.progress) write(KEYS.progress, data.progress);
  if (data.drafts) write(KEYS.drafts, data.drafts);
  if (data.writing) write(KEYS.writing, data.writing);
  return { ok: true };
}

// ---------- Reset ----------
export function resetAll() {
  const s = storage();
  if (!s) return;
  for (const k of Object.values(KEYS)) s.remove(k);
}

// Stats helpers for the Progress / Home pages.
export function countCompletedActivities() {
  const p = getProgress();
  return Object.values(p.activities).filter((a) => a.completed).length;
}
export function countPractisedActivities() {
  const p = getProgress();
  return Object.values(p.activities).filter((a) => a.practised).length;
}
