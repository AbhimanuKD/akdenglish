// views.js — page renderers. Each view returns { html, setup }.
// setup() runs after the HTML is injected and may return a cleanup function.

import { LEVELS, REVIEWS, PLACEMENT_QUESTIONS, SKILLS, TOPICS, WRITING_TYPES, getActivity, allActivities } from "./curriculum.js";
import * as store from "./store.js";
import * as sounds from "./sounds.js";
import * as util from "./util.js";
import { mountEditor } from "./editor.js";

const toast = (m, t) => window.__toast && window.__toast(m, t);
const confirmDialog = (o) => (window.__confirmDialog ? window.__confirmDialog(o) : Promise.resolve(false));

// ---------- Resolvers ----------
function resolvePracticeTarget(id) {
  const a = getActivity(id);
  if (a) return { kind: "activity", level: a.level, unit: a.unit, activity: a.activity };
  for (const l of LEVELS) {
    const r = REVIEWS[l.id];
    if (r) for (const t of r.tasks) if (t.id === id) return { kind: "review", levelId: l.id, level: l, task: t };
  }
  return null;
}
function getReview(levelId) { return REVIEWS[levelId] || null; }

function activityDone(id) {
  const p = store.getActivityProgress(id);
  return !!(p && p.completed);
}
function levelCompletedCount(level) {
  let n = 0;
  for (const u of level.units) for (const a of u.activities) if (activityDone(a.id)) n++;
  return n;
}
function levelTotalCount(level) {
  let n = 0;
  for (const u of level.units) n += u.activities.length;
  return n;
}
function levelBadge(id, name) {
  return `<span class="level-badge" style="background:${util.levelColor(id)}">${util.esc(id)}</span>`;
}

// ---------- Home ----------
function homeView() {
  const profile = store.getProfile();
  const progress = store.getProgress();
  const settings = store.getSettings();
  const level = LEVELS.find((l) => l.id === settings.level) || LEVELS[0];
  const practised = store.countPractisedActivities();
  const completed = store.countCompletedActivities();
  const writing = store.getWriting().length;
  const skillCount = Object.keys(progress.skills).length;

  let continueHtml = "";
  const last = store.getLastActivity();
  if (last && last.id) {
    const t = resolvePracticeTarget(last.id);
    if (t) {
      const title = t.kind === "activity" ? t.activity.title : `Level ${t.levelId} review task`;
      continueHtml = `
        <div class="card continue-card">
          <h3 style="margin-top:0">Continue where you left off</h3>
          <p class="mb-0 muted">${util.esc(title)} — your draft is saved on this device.</p>
          <a class="btn mt-8" href="#/practice/${util.esc(last.id)}">Continue writing →</a>
        </div>`;
    }
  }

  const html = `
    <div class="container">
      <div class="hero">
        <h1>Hello, ${util.esc(profile.name)} ${util.esc(profile.emoji)}</h1>
        <p class="lead">Welcome to English Writing Studio. Practise at your own pace, from your first sentences to confident essays. No login, no deadlines — your work is saved on this device.</p>
        <div style="display:flex;flex-wrap:wrap;gap:10px">
          <a class="btn btn-lg" href="#/path">Start practice</a>
          <a class="btn btn-secondary btn-lg" href="#/placement">Find my level (estimate)</a>
        </div>
      </div>

      ${continueHtml}

      <div class="stat-grid mt-24">
        <div class="stat"><div class="stat-value">${practised}</div><div class="stat-label">Activities practised</div></div>
        <div class="stat"><div class="stat-value">${completed}</div><div class="stat-label">Activities completed</div></div>
        <div class="stat"><div class="stat-value">${writing}</div><div class="stat-label">Saved pieces</div></div>
        <div class="stat"><div class="stat-value">${skillCount}</div><div class="stat-label">Skills practised</div></div>
      </div>

      <div class="card mt-24">
        <div class="panel-title"><h2 class="mb-0">Your level</h2></div>
        <p class="muted">${levelBadge(level.id, level.name)} <strong>${util.esc(level.name)}</strong> — ${util.esc(level.tagline)}</p>
        <p class="muted mb-0">${util.esc(level.description)}</p>
        <a class="btn btn-secondary mt-12" href="#/path">See the full Learning Path</a>
      </div>
    </div>`;
  return { html, setup: null };
}

// ---------- Learning Path ----------
function pathView() {
  const settings = store.getSettings();
  const preferredIdx = Math.max(0, LEVELS.findIndex((l) => l.id === settings.level));
  const cards = LEVELS.map((l, i) => {
    const done = levelCompletedCount(l);
    const total = levelTotalCount(l);
    const units = l.units.map((u) => `
      <div class="unit-block">
        <div class="unit-title">${util.esc(u.title)}</div>
        <span class="unit-topic">${util.esc(TOPICS[u.topic] || "")}</span>
        ${u.activities.map((a) => {
          const d = activityDone(a.id);
          return `<a class="activity-row ${d ? "done" : ""}" href="#/practice/${util.esc(a.id)}">
            <span class="activity-row__title">${d ? '<span class="check-dot">✓</span> ' : ""}${util.esc(a.title)}</span>
            <span class="activity-row__meta"><span>${util.esc(WRITING_TYPES[a.type] || "")}</span><span>~${a.minWords} words</span></span>
          </a>`;
        }).join("")}
      </div>`).join("");

    return `
      <details class="level-card" ${i === preferredIdx ? "open" : ""}>
        <summary class="level-card__head">
          ${levelBadge(l.id, l.name)}
          <div>
            <h3>${util.esc(l.name)} <span class="muted" style="font-weight:500;font-size:0.85em">· ${util.esc(l.tagline)}</span></h3>
            <p class="muted">${util.esc(l.cefr)} · ${util.esc(l.timeRange)}</p>
          </div>
          <div class="level-card__progress">
            <div class="small muted mb-8">${done}/${total} done</div>
            <div class="progress inline"><span style="width:${total ? Math.round((done / total) * 100) : 0}%"></span></div>
          </div>
        </summary>
        <div class="level-card__body">
          <p class="level-desc"><strong>What you will practise:</strong> ${util.esc(l.description)}</p>
          <p class="level-desc"><strong>What you should slowly be able to write:</strong> ${util.esc(l.ableToWrite)}</p>
          <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:8px">
            <a class="btn btn-sm" href="#/review/${util.esc(l.id)}">Level ${util.esc(l.id)} review</a>
          </div>
          ${units}
        </div>
      </details>`;
  }).join("");

  const html = `
    <div class="container">
      <div class="section-head">
        <div>
          <h1>Learning Path</h1>
          <p class="muted mb-0">Six levels, from beginner to proficient. Open any level, choose a topic, and practise. You can revisit anything, any time.</p>
        </div>
        <a class="btn" href="#/placement">Placement (estimate)</a>
      </div>
      ${cards}
    </div>`;
  return { html, setup: null };
}

// ---------- Practice (activity or review task) ----------
function practiceView(id) {
  const target = resolvePracticeTarget(id);
  if (!target) {
    return {
      html: `<div class="container"><div class="error-banner">That activity could not be found.</div><a class="btn btn-secondary" href="#/path">← Back to Learning Path</a></div>`,
      setup: null,
    };
  }

  let ctx;
  if (target.kind === "activity") {
    const { level, unit, activity } = target;
    ctx = {
      mode: "activity",
      draftId: activity.id,
      title: activity.title,
      levelId: level.id, levelName: level.name,
      type: activity.type, topic: unit.topic,
      minWords: activity.minWords, skills: activity.skills,
      instructions: activity.instructions, prompt: activity.prompt,
      example: activity.example, exampleNote: activity.exampleNote, tip: activity.tip,
      choices: activity.choices || [],
      backHref: "#/path",
      pieceId: null, piece: null,
      recordLabel: activity.title,
    };
  } else {
    const { levelId, level, task } = target;
    ctx = {
      mode: "review",
      draftId: task.id,
      title: `Level ${levelId} review — task`,
      levelId, levelName: level.name,
      type: task.type, topic: "",
      minWords: task.minWords, skills: [],
      instructions: task.instructions, prompt: task.prompt,
      example: "", exampleNote: "", tip: "",
      choices: [],
      backHref: `#/review/${levelId}`,
      pieceId: null, piece: null,
      recordLabel: `Level ${levelId} review`,
    };
  }

  const html = `<div class="container"><div id="editor-root"></div></div>`;
  const setup = () => mountEditor(document.getElementById("editor-root"), ctx);
  return { html, setup };
}

// ---------- Level review ----------
function reviewView(levelId) {
  const level = LEVELS.find((l) => l.id === levelId);
  const review = getReview(levelId);
  if (!level || !review) {
    return { html: `<div class="container"><div class="error-banner">Review not found.</div><a class="btn btn-secondary" href="#/path">← Back</a></div>`, setup: null };
  }
  const prev = store.getProgress().reviews[levelId];

  const tasks = review.tasks.map((t) => {
    const d = store.getDraft(t.id);
    const wc = util.wordCount(d.text);
    const done = wc >= t.minWords;
    return `
      <div class="activity-row" style="flex-wrap:wrap">
        <span class="activity-row__title" style="flex:1;min-width:200px">${done ? '<span class="check-dot">✓</span> ' : ""}${util.esc(t.prompt)}</span>
        <span class="activity-row__meta"><span>${util.esc(WRITING_TYPES[t.type] || "")}</span><span>${wc}/${t.minWords} words</span></span>
        <a class="btn btn-sm" href="#/practice/${util.esc(t.id)}">${wc ? "Continue" : "Write"}</a>
      </div>`;
  }).join("");

  let resultHtml = "";
  if (prev && prev.result) {
    const r = prev.result;
    resultHtml = `<div class="card mt-16"><div class="panel-title"><span>🏁</span><strong>Last review result</strong></div>
      <p class="muted mb-0">You saved ${r.savedTasks} of ${r.totalTasks} task(s) (${r.words} words). ${prev.attempts} attempt(s) so far.</p></div>`;
  }

  const html = `
    <div class="container">
      <a class="btn btn-ghost btn-sm" href="#/path">← Learning Path</a>
      <h1 class="mt-12">${util.esc(review.title)}</h1>
      <p class="muted">${util.esc(review.intro)} This is optional — you can save it, retry it, skip it, or keep practising.</p>
      <div class="card">
        <h3>Writing tasks</h3>
        ${tasks || '<p class="muted">No tasks.</p>'}
      </div>
      ${resultHtml}
      <div class="mt-16" style="display:flex;flex-wrap:wrap;gap:10px">
        <button class="btn" id="finish-review">Finish & save review</button>
        <button class="btn btn-secondary" id="skip-review">Skip this review</button>
        <a class="btn btn-ghost" href="#/path">Keep practising</a>
      </div>
    </div>`;

  const setup = () => {
    document.getElementById("finish-review").addEventListener("click", () => {
      let savedTasks = 0, words = 0;
      for (const t of review.tasks) {
        const d = store.getDraft(t.id);
        const wc = util.wordCount(d.text);
        if (wc > 0) savedTasks++;
        words += wc;
      }
      store.recordReview(levelId, { savedTasks, totalTasks: review.tasks.length, words });
      toast("Review saved. Well done!");
      window.__rerender();
    });
    document.getElementById("skip-review").addEventListener("click", () => {
      toast("No problem — keep practising when you are ready.");
      location.hash = "#/path";
    });
  };
  return { html, setup };
}

// ---------- My Writing ----------
function writingListView() {
  const pieces = store.getWriting();
  const html = `
    <div class="container">
      <div class="section-head">
        <div><h1>My Writing</h1><p class="muted mb-0">Your saved pieces, stored on this device.</p></div>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <a class="btn" href="#/writing/new">＋ New writing</a>
          <button class="btn btn-secondary" id="export-backup">Export backup</button>
        </div>
      </div>
      <div class="toolbar-row">
        <input type="search" id="w-search" placeholder="Search your writing…" aria-label="Search your writing" />
        <select id="w-level" aria-label="Filter by level">
          <option value="">All levels</option>
          ${LEVELS.map((l) => `<option value="${l.id}">${util.esc(l.id)} — ${util.esc(l.name)}</option>`).join("")}
        </select>
        <select id="w-type" aria-label="Filter by type">
          <option value="">All types</option>
          ${Object.keys(WRITING_TYPES).map((k) => `<option value="${k}">${util.esc(WRITING_TYPES[k])}</option>`).join("")}
        </select>
      </div>
      <div id="writing-list"></div>
    </div>`;

  function renderList() {
    const q = (document.getElementById("w-search").value || "").toLowerCase();
    const lv = document.getElementById("w-level").value;
    const tp = document.getElementById("w-type").value;
    let items = store.getWriting();
    if (lv) items = items.filter((p) => p.levelId === lv);
    if (tp) items = items.filter((p) => p.type === tp);
    if (q) items = items.filter((p) => (p.title + " " + p.text).toLowerCase().includes(q));

    const listEl = document.getElementById("writing-list");
    if (!items.length) {
      listEl.innerHTML = `<div class="empty-state"><div class="empty-icon">🪶</div><p>No writing here yet.</p><p class="small">Start an activity and save your work, or create a new piece.</p></div>`;
      return;
    }
    listEl.innerHTML = items.map((p) => `
      <div class="writing-item" data-id="${util.esc(p.id)}">
        <div class="writing-item__head">
          <span class="writing-item__title">${util.esc(p.title)}</span>
          ${p.levelId ? `<span class="chip accent" style="background:${util.levelColor(p.levelId)}22;color:${util.levelColor(p.levelId)}">${util.esc(p.levelId)}</span>` : ""}
          ${p.type ? `<span class="chip">${util.esc(WRITING_TYPES[p.type] || p.type)}</span>` : ""}
          <span class="small faint">${util.esc(util.fmtRelative(p.updatedAt))}</span>
        </div>
        <div class="writing-item__preview">${util.esc(p.text)}</div>
        <div class="writing-item__actions">
          <a class="btn btn-sm btn-secondary" href="#/writing/${util.esc(p.id)}">Edit</a>
          <button class="btn btn-sm btn-ghost" data-copy="${util.esc(p.id)}">Copy</button>
          <button class="btn btn-sm btn-ghost" data-export="${util.esc(p.id)}">Export</button>
          <button class="btn btn-sm btn-danger-soft" data-delete="${util.esc(p.id)}">Delete</button>
        </div>
      </div>`).join("");

    listEl.querySelectorAll("[data-copy]").forEach((b) => b.addEventListener("click", async () => {
      const p = store.getWritingById(b.getAttribute("data-copy"));
      if (!p) return;
      const ok = await copyText(p.text);
      toast(ok ? "Copied." : "Could not copy.", ok ? "success" : "error");
    }));
    listEl.querySelectorAll("[data-export]").forEach((b) => b.addEventListener("click", () => {
      const p = store.getWritingById(b.getAttribute("data-export"));
      if (p) downloadText(slug(p.title) + ".txt", p.title + "\n\n" + p.text);
    }));
    listEl.querySelectorAll("[data-delete]").forEach((b) => b.addEventListener("click", async () => {
      const p = store.getWritingById(b.getAttribute("data-delete"));
      if (!p) return;
      const ok = await confirmDialog({ title: "Delete this piece?", body: `<p>Deleting <strong>${util.esc(p.title)}</strong> cannot be undone.</p>`, confirmLabel: "Delete", danger: true });
      if (ok) { store.deleteWriting(p.id); renderList(); toast("Piece deleted."); }
    }));
  }

  const setup = () => {
    renderList();
    document.getElementById("w-search").addEventListener("input", renderList);
    document.getElementById("w-level").addEventListener("change", renderList);
    document.getElementById("w-type").addEventListener("change", renderList);
    document.getElementById("export-backup").addEventListener("click", exportBackup);
  };
  return { html, setup };
}

// ---------- My Writing piece editor ----------
function pieceView(id) {
  let piece = null;
  let pieceId = id;
  if (id && id !== "new") {
    piece = store.getWritingById(id);
    if (!piece) {
      return { html: `<div class="container"><div class="error-banner">That piece was not found.</div><a class="btn btn-secondary" href="#/writing">← Back to My Writing</a></div>`, setup: null };
    }
    pieceId = piece.id;
  }
  const settings = store.getSettings();
  const draftId = `piece:${pieceId}`;
  // Seed the draft from the saved piece if the draft is empty.
  if (piece && piece.text && !store.getDraft(draftId).text) {
    store.saveDraft(draftId, piece.text);
  }

  const ctx = {
    mode: "piece",
    draftId,
    title: piece ? "Edit writing" : "New writing",
    levelId: piece ? piece.levelId : settings.level,
    levelName: piece && piece.levelId ? (LEVELS.find((l) => l.id === piece.levelId) || {}).name : null,
    type: piece ? piece.type : "",
    topic: piece ? piece.topic : "",
    minWords: 0,
    skills: [],
    instructions: "", prompt: "",
    example: "", exampleNote: "", tip: "",
    choices: [],
    backHref: "#/writing",
    pieceId,
    piece,
    recordLabel: "",
  };

  const html = `<div class="container"><div id="editor-root"></div></div>`;
  const setup = () => mountEditor(document.getElementById("editor-root"), ctx);
  return { html, setup };
}

// ---------- Progress ----------
function progressView() {
  const progress = store.getProgress();
  const all = allActivities();
  const practised = store.countPractisedActivities();
  const completed = store.countCompletedActivities();
  const writing = store.getWriting().length;

  const skillMax = Math.max(1, ...Object.values(progress.skills).map((s) => s.count));
  const skillsHtml = SKILLS.map((s) => {
    const info = progress.skills[s.id];
    const count = info ? info.count : 0;
    return `
      <div class="stat">
        <div class="stat-label">${util.esc(s.label)}</div>
        <div class="stat-value" style="font-size:1.2rem">${count}</div>
        <div class="progress inline mt-8"><span style="width:${Math.round((count / skillMax) * 100)}%"></span></div>
      </div>`;
  }).join("");

  const history = (progress.history || []).slice(0, 20).map((h) => `
    <div class="activity-row">
      <span class="activity-row__title">${util.esc(h.label)}</span>
      <span class="activity-row__meta"><span>${util.esc(util.fmtRelative(h.at))}</span></span>
    </div>`).join("") || '<p class="muted">No activity yet. Start writing!</p>';

  const reviewsHtml = LEVELS.map((l) => {
    const r = progress.reviews[l.id];
    if (!r || !r.result) return "";
    return `<div class="chip">${util.esc(l.id)} review · ${r.result.savedTasks}/${r.result.totalTasks} tasks</div>`;
  }).join("");

  const placementHtml = progress.placement
    ? `<div class="card mt-16"><div class="panel-title"><span>🧭</span><strong>Placement estimate</strong></div>
       <p class="mb-0 muted">Suggested level: <strong>${util.esc(progress.placement.suggestedLevel)}</strong> (an estimate, not an official CEFR result).</p></div>`
    : "";

  const html = `
    <div class="container">
      <h1>Progress</h1>
      <p class="muted">A gentle overview of what you have practised. No streaks, no deadlines.</p>

      <div class="stat-grid">
        <div class="stat"><div class="stat-value">${practised}</div><div class="stat-label">Activities practised</div></div>
        <div class="stat"><div class="stat-value">${completed}</div><div class="stat-label">Activities completed</div></div>
        <div class="stat"><div class="stat-value">${all.length}</div><div class="stat-label">Activities available</div></div>
        <div class="stat"><div class="stat-value">${writing}</div><div class="stat-label">Saved pieces</div></div>
      </div>

      <h2 class="mt-24">Skills practised</h2>
      <div class="stat-grid">${skillsHtml}</div>

      ${reviewsHtml ? `<h2 class="mt-24">Level reviews</h2><div style="display:flex;flex-wrap:wrap;gap:8px">${reviewsHtml}</div>` : ""}
      ${placementHtml}

      <h2 class="mt-24">Recent activity</h2>
      <div class="card">${history}</div>
    </div>`;
  return { html, setup: null };
}

// ---------- About ----------
function aboutView() {
  const html = `
    <div class="container" style="max-width:760px">
      <h1>About English Writing Studio</h1>
      <p>English Writing Studio is a friendly place to learn and practise English writing, from your very first sentences (A1) all the way to confident essays and reports (C2). You work at your own pace and can pause at any time.</p>

      <h2>How it works</h2>
      <ul>
        <li><strong>Learn by writing.</strong> Every activity is a short real writing task, not a long lesson to read first.</li>
        <li><strong>Optional help.</strong> You can show an example, get writing suggestions, or request a basic check — but you are always in control.</li>
        <li><strong>Your work stays yours.</strong> Drafts and pieces are saved automatically in your browser. No account is needed.</li>
      </ul>

      <h2>About the levels</h2>
      <p>The site uses the six CEFR levels (A1–C2) as a friendly guide. The placement activity gives you an <strong>estimate</strong> of a good starting level. It is <strong>not</strong> an official CEFR test or certification, and this site cannot give you an official result or guarantee perfect English.</p>

      <h2>Your data</h2>
      <p>Everything is stored locally in this browser. It will not sync between devices, and it may be lost if you clear your browser data. You can use <strong>Export backup</strong> in Settings to keep a copy, and <strong>Import backup</strong> to restore or move it.</p>

      <h2>Get in touch</h2>
      <p>Follow the project on Instagram: <a href="https://www.instagram.com/abhimanu_011/" target="_blank" rel="noopener noreferrer">📷 @abhimanu_011</a></p>
    </div>`;
  return { html, setup: null };
}

// ---------- Settings ----------
function settingsView() {
  const profile = store.getProfile();
  const s = store.getSettings();

  const html = `
    <div class="container" style="max-width:760px">
      <h1>Settings</h1>

      <div class="card">
        <h3>Profile</h3>
        <div class="form-group">
          <label for="set-name">Display name</label>
          <div style="display:flex;gap:8px">
            <input type="text" id="set-name" value="${util.esc(profile.name)}" />
            <button class="btn btn-secondary" id="regenerate-name" title="New random name">🎲</button>
          </div>
        </div>
        <div class="form-group">
          <label for="set-level">Preferred level</label>
          <select id="set-level">
            ${LEVELS.map((l) => `<option value="${l.id}" ${l.id === s.level ? "selected" : ""}>${util.esc(l.id)} — ${util.esc(l.name)}</option>`).join("")}
          </select>
          <p class="form-help">Used to adapt writing suggestions. You can still practise any level at any time.</p>
        </div>
      </div>

      <div class="card mt-16">
        <h3>Writing suggestions</h3>
        <label class="switch">
          <input type="checkbox" id="set-suggestions" ${s.suggestions ? "checked" : ""} />
          <span class="track"></span>
          <span class="switch-label">${s.suggestions ? "On" : "Off"}</span>
        </label>
        <p class="form-help">Optional next-word and phrase ideas while you write. They never write for you, and your choice is remembered.</p>
      </div>

      <div class="card mt-16">
        <h3>Appearance</h3>
        <div class="segmented" id="set-appearance">
          <button data-appearance="light" aria-pressed="${s.appearance === "light"}">☀️ Light</button>
          <button data-appearance="dark" aria-pressed="${s.appearance === "dark"}">🌙 Dark</button>
          <button data-appearance="system" aria-pressed="${s.appearance === "system"}">🌓 System</button>
        </div>
        <p class="form-help">System follows your device's light/dark setting.</p>
      </div>

      <div class="card mt-16">
        <h3>Focus sounds</h3>
        <div class="form-group">
          <label for="set-scape">Soundscape</label>
          <select id="set-scape">
            <option value="">None</option>
            ${Object.keys(sounds.getScapes()).map((id) => `<option value="${id}" ${s.sound.scape === id ? "selected" : ""}>${sounds.getScapes()[id].icon} ${sounds.getScapes()[id].label}</option>`).join("")}
          </select>
        </div>
        <div class="form-group">
          <label for="set-volume">Volume</label>
          <input type="range" id="set-volume" min="0" max="1" step="0.01" value="${s.sound.volume}" />
        </div>
        <p class="form-help">Use the 🎧 button in the top bar to play, pause, and mute. Sounds are generated in your browser and never start on their own.</p>
      </div>

      <div class="card mt-16">
        <h3>AI feedback <span class="chip badge-ai">Optional</span></h3>
        <p class="muted">The built-in "Check my writing" uses a free offline basic checker — it always works. You can optionally connect your own AI service for richer feedback. This is not required.</p>
        <div class="form-group">
          <label for="set-ai-endpoint">AI endpoint URL</label>
          <input type="url" id="set-ai-endpoint" value="${util.esc(s.ai.endpoint)}" placeholder="https://your-proxy.example/feedback" />
        </div>
        <div class="form-group">
          <label for="set-ai-key">API key (optional)</label>
          <input type="password" id="set-ai-key" value="${util.esc(s.ai.key)}" placeholder="Stored only in this browser" />
          <p class="form-help">For safety, use a small proxy/serverless function rather than calling an AI provider directly from the browser. The key stays in your browser and is never bundled in the code.</p>
        </div>
      </div>

      <div class="card mt-16">
        <h3>Data</h3>
        <p class="muted">Your work is stored in this browser only. Export a backup to keep it safe or move it to another device.</p>
        <div style="display:flex;flex-wrap:wrap;gap:10px">
          <button class="btn btn-secondary" id="export-backup">Export backup</button>
          <button class="btn btn-secondary" id="import-backup">Import backup</button>
          <input type="file" id="import-file" accept="application/json,.json" class="hidden" />
          <a class="btn btn-danger-soft" href="#/reset">Reset all data</a>
        </div>
      </div>

      <p class="small faint mt-16">Browser-stored data may be lost if browser data is cleared, and it will not automatically sync between devices.</p>
    </div>`;

  const setup = () => {
    const save = () => window.__rerender();

    document.getElementById("set-name").addEventListener("change", (e) => {
      const v = e.target.value.trim();
      if (v) { store.saveProfile({ name: v }); toast("Name updated."); }
    });
    document.getElementById("regenerate-name").addEventListener("click", () => {
      const name = store.generateName();
      document.getElementById("set-name").value = name;
      store.saveProfile({ name });
      toast("New name: " + name);
    });
    document.getElementById("set-level").addEventListener("change", (e) => {
      store.saveSettings({ level: e.target.value });
      toast("Preferred level updated.");
    });
    document.getElementById("set-suggestions").addEventListener("change", (e) => {
      store.saveSettings({ suggestions: e.target.checked });
      document.querySelector('#set-suggestions ~ .switch-label').textContent = e.target.checked ? "On" : "Off";
      toast(e.target.checked ? "Suggestions on." : "Suggestions off.", "info");
    });
    document.getElementById("set-appearance").querySelectorAll("[data-appearance]").forEach((b) => {
      b.addEventListener("click", () => {
        window.__setAppearance(b.getAttribute("data-appearance"));
        document.querySelectorAll("#set-appearance [data-appearance]").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
        toast("Appearance updated.");
      });
    });
    document.getElementById("set-scape").addEventListener("change", (e) => {
      const scape = e.target.value || null;
      sounds.setScape(scape || null);
      store.saveSettings({ sound: { ...store.getSettings().sound, scape } });
    });
    document.getElementById("set-volume").addEventListener("input", (e) => {
      const v = Number(e.target.value);
      sounds.setVolume(v);
      store.saveSettings({ sound: { ...store.getSettings().sound, volume: v } });
    });
    document.getElementById("set-ai-endpoint").addEventListener("change", (e) => {
      store.saveSettings({ ai: { ...store.getSettings().ai, endpoint: e.target.value.trim() } });
      toast("AI endpoint saved.");
    });
    document.getElementById("set-ai-key").addEventListener("change", (e) => {
      store.saveSettings({ ai: { ...store.getSettings().ai, key: e.target.value.trim() } });
      toast("AI key saved in this browser.");
    });

    document.getElementById("export-backup").addEventListener("click", exportBackup);
    document.getElementById("import-backup").addEventListener("click", () => document.getElementById("import-file").click());
    document.getElementById("import-file").addEventListener("change", (e) => {
      const file = e.target.files && e.target.files[0];
      if (file) importBackupFile(file);
      e.target.value = "";
    });
  };
  return { html, setup };
}

// ---------- Reset ----------
function resetView() {
  const html = `
    <div class="container" style="max-width:640px">
      <h1>Reset all data</h1>
      <div class="card">
        <p><strong>Warning:</strong> resetting will delete all of your saved progress, drafts, and writing from this browser. This cannot be undone.</p>
        <p class="muted">If you might want your work later, export a backup first.</p>
        <div style="display:flex;flex-wrap:wrap;gap:10px;margin-top:16px">
          <button class="btn btn-secondary" id="export-before-reset">Export backup first</button>
          <button class="btn btn-danger" id="do-reset">Reset everything</button>
          <a class="btn btn-ghost" href="#/settings">Cancel</a>
        </div>
      </div>
    </div>`;

  const setup = () => {
    document.getElementById("export-before-reset").addEventListener("click", exportBackup);
    document.getElementById("do-reset").addEventListener("click", async () => {
      const ok = await confirmDialog({
        title: "Reset everything?",
        body: "<p>This will permanently delete all your progress, drafts, and writing on this device. <strong>This cannot be undone.</strong></p>",
        confirmLabel: "Yes, delete everything",
        danger: true,
      });
      if (!ok) return;
      store.resetAll();
      store.getProfile(); // regenerate a fresh profile
      window.__setAppearance("system");
      toast("All data cleared. A fresh start!");
      location.hash = "#/";
    });
  };
  return { html, setup };
}

// ---------- Placement ----------
const SCALE = [
  { v: 0, label: "Not yet" },
  { v: 1, label: "A little" },
  { v: 2, label: "Somewhat" },
  { v: 3, label: "Mostly" },
  { v: 4, label: "Well" },
  { v: 5, label: "Easily" },
];

function placementView() {
  const html = `
    <div class="container" style="max-width:760px">
      <h1>Find your level <span class="chip badge-basic">Estimate only</span></h1>
      <p class="muted">Answer honestly about what you can do <em>right now</em>. This suggests a starting level — it is <strong>not</strong> an official CEFR test or certification.</p>
      <div class="card">
        <div id="placement-questions"></div>
        <div class="mt-16" style="display:flex;flex-wrap:wrap;gap:10px">
          <button class="btn" id="placement-submit">See my suggested level</button>
          <a class="btn btn-ghost" href="#/path">Skip, just show the Learning Path</a>
        </div>
        <div id="placement-result" class="mt-16"></div>
      </div>
    </div>`;

  const setup = () => {
    const answers = {};
    const qRoot = document.getElementById("placement-questions");
    qRoot.innerHTML = PLACEMENT_QUESTIONS.map((q) => `
      <div class="form-group" style="margin-bottom:18px">
        <div class="form-label">${util.esc(q.question)}</div>
        <div class="segmented" data-q="${util.esc(q.id)}" style="gap:4px">
          ${SCALE.map((o) => `<button data-v="${o.v}" aria-pressed="false" title="${util.esc(o.label)}">${o.v}</button>`).join("")}
        </div>
        <div class="placement-scale"><span>0 = Not yet</span><span>5 = Easily</span></div>
      </div>`).join("");

    qRoot.querySelectorAll("[data-q]").forEach((group) => {
      const id = group.getAttribute("data-q");
      group.querySelectorAll("[data-v]").forEach((b) => {
        b.addEventListener("click", () => {
          answers[id] = Number(b.getAttribute("data-v"));
          group.querySelectorAll("[data-v]").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
        });
      });
    });

    document.getElementById("placement-submit").addEventListener("click", () => {
      const ids = PLACEMENT_QUESTIONS.map((q) => q.id);
      const answered = ids.filter((id) => answers[id] != null);
      if (answered.length < ids.length) {
        toast(`Please answer all ${ids.length} questions (you answered ${answered.length}).`, "info");
        return;
      }
      const avg = ids.reduce((sum, id) => sum + answers[id], 0) / ids.length;
      const level = scoreToLevel(avg);
      store.setPlacement(level.id);
      store.saveSettings({ level: level.id });
      document.getElementById("placement-result").innerHTML = `
        <div class="tip-box">
          <h3 style="margin-top:0">Suggested level: ${util.esc(level.id)} — ${util.esc(level.name)}</h3>
          <p class="mb-8">${util.esc(level.tagline)}</p>
          <p class="muted mb-8">${util.esc(level.description)}</p>
          <p class="small faint mb-0">This is only an estimate based on your answers.</p>
          <div style="display:flex;gap:8px;margin-top:12px">
            <a class="btn" href="#/path">Start with ${util.esc(level.id)}</a>
          </div>
        </div>`;
      document.getElementById("placement-result").scrollIntoView({ behavior: "smooth" });
    });
  };
  return { html, setup };
}
function scoreToLevel(avg) {
  if (avg < 0.5) return LEVELS[0];
  if (avg < 1.5) return LEVELS[1];
  if (avg < 2.5) return LEVELS[2];
  if (avg < 3.5) return LEVELS[3];
  if (avg < 4.5) return LEVELS[4];
  return LEVELS[5];
}

// ---------- Shared helpers ----------
async function copyText(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) { await navigator.clipboard.writeText(text); return true; }
  } catch {}
  try {
    const ta = document.createElement("textarea");
    ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
    document.body.appendChild(ta); ta.focus(); ta.select();
    const ok = document.execCommand("copy"); ta.remove(); return ok;
  } catch { return false; }
}

function downloadText(filename, text) {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function slug(s) {
  return (s || "writing").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "writing";
}

function exportBackup() {
  const data = store.exportBackup();
  downloadText(`english-writing-backup-${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify(data, null, 2));
  toast("Backup downloaded.");
}

function importBackupFile(file) {
  const reader = new FileReader();
  reader.onload = async () => {
    try {
      const data = JSON.parse(reader.result);
      const check = store.validateBackup(data);
      if (!check.ok) { toast(check.error, "error"); return; }
      const ok = await confirmDialog({
        title: "Import backup?",
        body: "<p>This will <strong>replace</strong> all current data on this device with the backup contents.</p>",
        confirmLabel: "Yes, replace my data",
        danger: true,
      });
      if (!ok) return;
      const res = store.importBackup(data);
      if (res.ok) { toast("Backup imported."); window.__rerender(); }
    } catch {
      toast("This file is not a valid backup.", "error");
    }
  };
  reader.readAsText(file);
}

// ---------- Router ----------
export function renderRoute(route) {
  switch (route.name) {
    case "home": return homeView();
    case "path": return pathView();
    case "practice": return practiceView(route.param);
    case "review": return reviewView(route.param);
    case "writing": return route.param ? pieceView(route.param) : writingListView();
    case "progress": return progressView();
    case "about": return aboutView();
    case "settings": return settingsView();
    case "reset": return resetView();
    case "placement": return placementView();
    default: return homeView();
  }
}
