// app.js — entry point: theme, sound panel, toasts, dialogs, router, and
// delegated global actions. Page views live in views.js; the editor in editor.js.

import * as store from "./store.js";
import * as sounds from "./sounds.js";
import * as util from "./util.js";
import { renderRoute } from "./views.js";

const appEl = document.getElementById("app");
let currentCleanup = null;

// ---------- Theme ----------
function applyTheme(appearance) {
  const resolved = appearance === "light" || appearance === "dark"
    ? appearance
    : (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  document.documentElement.setAttribute("data-theme", resolved);
  document.documentElement.setAttribute("data-appearance", appearance);
  const icon = document.getElementById("theme-toggle-icon");
  if (icon) icon.textContent = appearance === "light" ? "☀️" : appearance === "dark" ? "🌙" : "🌓";
}

function cycleTheme() {
  const cur = store.getSettings().appearance;
  const next = cur === "light" ? "dark" : cur === "dark" ? "system" : "light";
  store.saveSettings({ appearance: next });
  applyTheme(next);
  toast(`Appearance: ${next === "system" ? "System" : next === "light" ? "Light" : "Dark"}`, "info");
}

// ---------- Toasts ----------
let toastTimer = null;
function toast(message, type = "info") {
  const region = document.getElementById("toast-region");
  if (!region) return;
  const el = document.createElement("div");
  el.className = `toast ${type}`;
  el.setAttribute("role", "status");
  el.textContent = message;
  region.appendChild(el);
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    el.style.opacity = "0";
    el.style.transition = "opacity 0.3s";
    setTimeout(() => el.remove(), 320);
  }, 2600);
}
window.__toast = toast; // expose for views/editor

// ---------- Dialog / confirm ----------
function openDialog({ title, body, actions }) {
  const root = document.getElementById("dialog-root");
  const wrap = document.createElement("div");
  wrap.className = "dialog-backdrop";
  wrap.setAttribute("role", "dialog");
  wrap.setAttribute("aria-modal", "true");
  wrap.setAttribute("aria-label", title || "Dialog");
  wrap.innerHTML = `
    <div class="dialog" role="document">
      ${title ? `<h2>${util.esc(title)}</h2>` : ""}
      <div class="dialog__body">${body}</div>
      <div class="dialog__actions">${actions.map((a) => `
        <button class="btn ${a.className || "btn-secondary"}" data-dialog-action="${a.id}">${util.esc(a.label)}</button>
      `).join("")}</div>
    </div>`;
  root.appendChild(wrap);

  const firstBtn = wrap.querySelector("button");
  if (firstBtn) firstBtn.focus();

  function close() { wrap.remove(); document.removeEventListener("keydown", onKey); }
  function onKey(e) {
    if (e.key === "Escape") { e.preventDefault(); close(); }
  }
  document.addEventListener("keydown", onKey);

  wrap.addEventListener("click", (e) => {
    if (e.target === wrap) close();
    const btn = e.target.closest("[data-dialog-action]");
    if (btn) {
      const id = btn.getAttribute("data-dialog-action");
      const action = actions.find((a) => a.id === id);
      if (action) { close(); action.onClick && action.onClick(); }
    }
  });
}

function confirmDialog({ title, body, confirmLabel = "Confirm", cancelLabel = "Cancel", danger = false }) {
  return new Promise((resolve) => {
    openDialog({
      title,
      body,
      actions: [
        { id: "cancel", label: cancelLabel, className: "btn-secondary", onClick: () => resolve(false) },
        { id: "confirm", label: confirmLabel, className: danger ? "btn-danger" : "btn", onClick: () => resolve(true) },
      ],
    });
  });
}
window.__confirmDialog = confirmDialog;
window.__setAppearance = (a) => { store.saveSettings({ appearance: a }); applyTheme(a); };

// ---------- Sound panel ----------
let soundPanelEl = null;

function buildSoundPanel() {
  if (soundPanelEl) return soundPanelEl;
  const el = document.createElement("div");
  el.className = "card sound-panel hidden";
  el.id = "sound-panel";
  el.setAttribute("role", "dialog");
  el.setAttribute("aria-label", "Focus sounds");
  el.innerHTML = `
    <div class="panel-title"><span aria-hidden="true">🎧</span><strong>Focus sounds</strong>
      <button class="icon-btn" style="margin-left:auto;width:32px;height:32px" data-sound-close aria-label="Close">✕</button>
    </div>
    <p class="small muted mb-0" id="sound-support-note"></p>
    <div class="sound-options" id="sound-options"></div>
    <div class="sound-controls">
      <button class="btn btn-sm btn-secondary" id="sound-play" aria-label="Play or pause">▶ Play</button>
      <button class="btn btn-sm btn-ghost" id="sound-stop">Stop</button>
      <button class="icon-btn" id="sound-mute" aria-pressed="false" aria-label="Mute" style="width:36px;height:36px">🔊</button>
    </div>
    <label class="small muted" for="sound-volume">Volume</label>
    <input type="range" id="sound-volume" min="0" max="1" step="0.01" value="0.5" aria-label="Volume" />
    <p class="small faint mt-8 mb-0">Sounds are generated in your browser. They never start on their own.</p>`;
  document.body.appendChild(el);
  soundPanelEl = el;
  return el;
}

function renderSoundPanel() {
  const el = buildSoundPanel();
  const opts = document.getElementById("sound-options");
  const scapes = sounds.getScapes();
  const cur = store.getSettings().sound.scape;
  const state = sounds.getState();

  if (!sounds.isSupported()) {
    document.getElementById("sound-support-note").textContent = "This browser does not support Web Audio, so focus sounds are unavailable.";
    opts.style.display = "none";
  } else {
    document.getElementById("sound-support-note").textContent = "";
    opts.style.display = "grid";
    opts.innerHTML = Object.keys(scapes).map((id) => `
      <button class="sound-option" data-scape="${id}" aria-pressed="${cur === id ? "true" : "false"}">
        <span aria-hidden="true">${scapes[id].icon}</span> ${scapes[id].label}
      </button>`).join("");
  }

  document.getElementById("sound-play").textContent = state.playing ? "⏸ Pause" : "▶ Play";
  document.getElementById("sound-mute").setAttribute("aria-pressed", String(state.muted));
  document.getElementById("sound-mute").textContent = state.muted ? "🔇" : "🔊";
  document.getElementById("sound-volume").value = String(state.volume);

  // Wire events (idempotent — rebuild each open is simplest).
  opts.querySelectorAll("[data-scape]").forEach((b) => {
    b.onclick = () => {
      const id = b.getAttribute("data-scape");
      const res = sounds.play(id);
      if (res.ok) {
        store.saveSettings({ sound: { ...store.getSettings().sound, scape: id } });
      } else {
        toast(res.error || "Could not play this sound.", "error");
      }
      renderSoundPanel();
    };
  });
  document.getElementById("sound-play").onclick = () => {
    const scape = store.getSettings().sound.scape || "rain";
    const state2 = sounds.getState();
    if (state2.playing) { sounds.pause(); }
    else if (state2.scape && currentBuildPlaying()) { sounds.resume(); }
    else { sounds.play(scape); store.saveSettings({ sound: { ...store.getSettings().sound, scape } }); }
    renderSoundPanel();
  };
  document.getElementById("sound-stop").onclick = () => { sounds.stopAll(); renderSoundPanel(); };
  document.getElementById("sound-mute").onclick = () => {
    const next = !sounds.getState().muted;
    sounds.setMuted(next);
    store.saveSettings({ sound: { ...store.getSettings().sound, muted: next } });
    renderSoundPanel();
  };
  document.getElementById("sound-volume").oninput = (e) => {
    const v = Number(e.target.value);
    sounds.setVolume(v);
    store.saveSettings({ sound: { ...store.getSettings().sound, volume: v } });
  };
}

function currentBuildPlaying() { return sounds.getState().scape && sounds.isSupported(); }

function toggleSoundPanel() {
  const el = buildSoundPanel();
  const isHidden = el.classList.contains("hidden");
  if (isHidden) {
    renderSoundPanel();
    el.classList.remove("hidden");
  } else {
    el.classList.add("hidden");
  }
}

// ---------- Router ----------
function parseHash() {
  const raw = location.hash.replace(/^#/, "") || "/";
  const path = raw.split("?")[0];
  const parts = path.split("/").filter(Boolean);
  if (parts.length === 0) return { name: "home", param: null };
  const [name, param] = parts;
  return { name, param: param || null };
}

async function render() {
  const route = parseHash();
  if (currentCleanup) { try { currentCleanup(); } catch {} currentCleanup = null; }
  // Close any open sound panel on navigation.
  if (soundPanelEl) soundPanelEl.classList.add("hidden");

  let view;
  try {
    view = renderRoute(route);
  } catch (err) {
    console.error(err);
    view = { html: `<div class="container"><div class="error-banner">Something went wrong while loading this page.</div></div>`, setup: null };
  }
  appEl.innerHTML = view.html;
  if (view.setup) {
    const cleanup = view.setup();
    if (typeof cleanup === "function") currentCleanup = cleanup;
  }
  updateNavActive(route.name);
  window.scrollTo(0, 0);
  appEl.focus({ preventScroll: true });
}
window.__rerender = render;

function updateNavActive(name) {
  const map = { home: "home", path: "path", practice: "path", writing: "writing", progress: "progress", about: "about", settings: "settings", reset: "settings", placement: "path", review: "path" };
  const active = map[name];
  document.querySelectorAll(".site-nav a[data-nav]").forEach((a) => {
    a.classList.toggle("active", a.getAttribute("data-nav") === active);
  });
}

// ---------- Global event wiring ----------
function wireGlobal() {
  document.getElementById("theme-toggle").addEventListener("click", cycleTheme);
  document.getElementById("sound-toggle").addEventListener("click", toggleSoundPanel);
  document.getElementById("nav-toggle").addEventListener("click", () => {
    const nav = document.getElementById("site-nav");
    const open = nav.classList.toggle("open");
    document.getElementById("nav-toggle").setAttribute("aria-expanded", String(open));
    document.getElementById("nav-toggle").setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });

  // Close nav when a link is clicked (mobile).
  document.getElementById("site-nav").addEventListener("click", (e) => {
    if (e.target.closest("a")) {
      document.getElementById("site-nav").classList.remove("open");
      document.getElementById("nav-toggle").setAttribute("aria-expanded", "false");
    }
  });

  // Close sound panel on outside click / Escape.
  document.addEventListener("click", (e) => {
    if (soundPanelEl && !soundPanelEl.classList.contains("hidden")) {
      if (!soundPanelEl.contains(e.target) && !e.target.closest("#sound-toggle")) {
        soundPanelEl.classList.add("hidden");
      }
    }
    const closeBtn = e.target.closest("[data-sound-close]");
    if (closeBtn) { soundPanelEl && soundPanelEl.classList.add("hidden"); }
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && soundPanelEl && !soundPanelEl.classList.contains("hidden")) {
      soundPanelEl.classList.add("hidden");
    }
  });
}

// ---------- Boot ----------
function boot() {
  // Ensure profile exists; apply saved theme and sound settings (no autoplay).
  store.getProfile();
  const settings = store.getSettings();
  applyTheme(settings.appearance);
  if (sounds.isSupported()) {
    sounds.setVolume(settings.sound.volume);
    sounds.setMuted(settings.sound.muted);
    if (settings.sound.scape) sounds.setScape(settings.sound.scape);
  }
  wireGlobal();
  window.addEventListener("hashchange", render);
  render();
}

boot();
