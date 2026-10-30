// editor.js — the writing editor used for practice activities, review tasks,
// and My Writing pieces. Handles autosave, word count, suggestions, feedback,
// and draft versions/compare. All local; nothing is sent anywhere by default.

import * as store from "./store.js";
import { checkWriting, applyFixes } from "./checker.js";
import { getSuggestions, kindLabel } from "./suggest.js";
import { WRITING_TYPES, TOPICS } from "./curriculum.js";
import * as util from "./util.js";

const toast = (m, t) => window.__toast && window.__toast(m, t);
const confirmDialog = (o) => (window.__confirmDialog ? window.__confirmDialog(o) : Promise.resolve(false));

async function copyText(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {}
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    const ok = document.execCommand("copy");
    ta.remove();
    return ok;
  } catch {
    return false;
  }
}

// ctx fields (see views.js for how they are built):
// mode, draftId, title, levelId, levelName, type, topic, minWords, skills,
// instructions, prompt, example, exampleNote, tip, choices, backHref, pieceId, piece, recordLabel
export function mountEditor(root, ctx) {
  let draft = store.getDraft(ctx.draftId);
  const settings = store.getSettings();
  let suggestionsOn = settings.suggestions;
  let showExample = false;
  let showLearn = false;
  let showCompare = false;
  let dismissed = false;
  let selectedVersionId = null;
  let feedback = null; // { basic } | { ai }
  let aiBusy = false;
  let aiError = null;
  let choice = (draft && draft.choice) || (ctx.choices && ctx.choices[0]) || "";
  const isPiece = ctx.mode === "piece";

  const typeLabel = ctx.type ? (WRITING_TYPES[ctx.type] || "") : "";
  const topicLabel = ctx.topic ? (TOPICS[ctx.topic] || "") : "";

  root.innerHTML = `
    <div class="card">
      <div class="editor-head">
        <a class="btn btn-ghost btn-sm" href="${ctx.backHref}">← Back</a>
        <div class="mt-8" style="display:flex;flex-wrap:wrap;gap:6px">
          ${ctx.levelId ? `<span class="chip accent" style="background:${util.levelColor(ctx.levelId)}22;color:${util.levelColor(ctx.levelId)}">${util.esc(ctx.levelId)} · ${util.esc(ctx.levelName || "")}</span>` : ""}
          ${typeLabel ? `<span class="chip">${util.esc(typeLabel)}</span>` : ""}
          ${topicLabel ? `<span class="chip">${util.esc(topicLabel)}</span>` : ""}
        </div>
        <h1 style="margin-top:10px">${util.esc(ctx.title)}</h1>
        ${isPiece ? `<div class="form-group"><label for="piece-title">Title</label><input type="text" id="piece-title" value="${util.esc(ctx.piece ? ctx.piece.title : "")}" placeholder="Give your writing a title" /></div>` : ""}
        ${ctx.instructions ? `<p class="muted">${util.esc(ctx.instructions)}</p>` : ""}
        ${ctx.prompt ? `<p class="prompt"><strong>Your task:</strong> ${util.esc(ctx.prompt)}</p>` : ""}
        ${ctx.choices && ctx.choices.length ? `
          <div class="mt-8">
            <span class="small muted">Choose a topic (optional):</span>
            <div class="mt-8" style="display:flex;flex-wrap:wrap;gap:8px" id="choice-row">
              ${ctx.choices.map((c) => `<button class="chip ${choice === c ? "accent" : ""}" data-choice="${util.esc(c)}">${util.esc(c)}</button>`).join("")}
            </div>
          </div>` : ""}
      </div>

      <div class="editor-wrap mt-16">
        <div class="editor-toolbar">
          <label class="switch">
            <input type="checkbox" id="sugg-toggle" ${suggestionsOn ? "checked" : ""} />
            <span class="track"></span>
            <span class="switch-label">Suggestions</span>
          </label>
          <span class="spacer"></span>
          ${ctx.example ? `<button class="btn btn-secondary btn-sm" id="btn-example">Show example</button>` : ""}
          ${ctx.tip ? `<button class="btn btn-ghost btn-sm" id="btn-learn">Learn more</button>` : ""}
        </div>
        <textarea class="writing-area" id="editor-area" spellcheck="false" aria-label="Writing editor" placeholder="Start writing here…"></textarea>
        <div class="suggest-bar hidden" id="suggest-bar">
          <div class="suggest-bar__head">
            <span>💡 Suggestions</span>
            <span class="suggest-bar__hint">Click to add — they never write for you</span>
            <button class="btn btn-ghost btn-sm" id="suggest-dismiss" style="margin-left:8px">Dismiss</button>
          </div>
          <div class="suggest-chips" id="suggest-chips"></div>
        </div>
        <div class="editor-status">
          <span id="word-count">0 words</span>
          <span class="save-status saved" id="save-status">Saved</span>
          ${ctx.minWords ? `<span class="muted" id="minwords-hint">Suggested: ${ctx.minWords} words</span>` : ""}
        </div>
      </div>

      <div class="mt-12" style="display:flex;flex-wrap:wrap;gap:8px">
        <button class="btn" id="btn-save">${isPiece ? "Save" : "Save draft"}</button>
        <button class="btn btn-secondary" id="btn-continue">Continue later</button>
        <button class="btn btn-ghost" id="btn-tryagain">Try again</button>
        <button class="btn btn-secondary" id="btn-copy">Copy my writing</button>
        <button class="btn btn-secondary" id="btn-check">Check my writing</button>
      </div>

      <div id="example-box"></div>
      <div id="learn-box"></div>
      <div id="feedback-root"></div>
      <div id="versions-root"></div>
    </div>`;

  const area = root.querySelector("#editor-area");
  const wordCountEl = root.querySelector("#word-count");
  const saveStatusEl = root.querySelector("#save-status");
  const suggestBar = root.querySelector("#suggest-bar");
  const suggestChips = root.querySelector("#suggest-chips");
  const exampleBox = root.querySelector("#example-box");
  const learnBox = root.querySelector("#learn-box");
  const feedbackRoot = root.querySelector("#feedback-root");
  const versionsRoot = root.querySelector("#versions-root");
  const btnExample = root.querySelector("#btn-example");
  const btnLearn = root.querySelector("#btn-learn");

  area.value = draft.text || "";

  function setSaveStatus(s) {
    if (s === "saving") { saveStatusEl.textContent = "Saving…"; saveStatusEl.className = "save-status saving"; }
    else if (s === "saved") { saveStatusEl.textContent = "Saved " + util.fmtTime(draft.updatedAt || new Date().toISOString()); saveStatusEl.className = "save-status saved"; }
    else { saveStatusEl.textContent = s; saveStatusEl.className = "save-status"; }
  }

  function updateWordCount() {
    const wc = util.wordCount(area.value);
    wordCountEl.textContent = `${wc} ${wc === 1 ? "word" : "words"}`;
    const hint = root.querySelector("#minwords-hint");
    if (hint && ctx.minWords) {
      if (wc >= ctx.minWords) { hint.textContent = `✓ Reached the suggested ${ctx.minWords} words`; hint.style.color = "var(--success)"; }
      else { hint.textContent = `Suggested: ${ctx.minWords} words`; hint.style.color = ""; }
    }
  }

  function autosave() {
    const text = area.value;
    draft = store.saveDraft(ctx.draftId, text);
    setSaveStatus("saved");
  }
  const debouncedAutosave = util.debounce(autosave, 700);

  function scheduleSuggestions() {
    if (!suggestionsOn || dismissed) return;
    util.debounce(renderSuggestions, 600)();
  }
  const debouncedSched = util.debounce(scheduleSuggestions, 400);

  function renderSuggestions() {
    if (!suggestionsOn) { suggestBar.classList.add("hidden"); return; }
    const text = area.value;
    if (!text.trim()) { suggestBar.classList.add("hidden"); return; }
    const suggestions = getSuggestions(text, { level: ctx.levelId || "B1", type: ctx.type || "essay", topic: ctx.topic });
    if (!suggestions.length) { suggestBar.classList.add("hidden"); return; }
    suggestChips.innerHTML = suggestions.map((s) => `
      <button class="suggest-chip" data-sugg="${util.esc(s.text)}" data-kind="${s.kind}">
        <span class="tag">${kindLabel(s.kind)}</span>${util.esc(s.text)}
      </button>`).join("");
    suggestBar.classList.remove("hidden");
  }

  function insertSuggestion(text, kind) {
    const start = area.selectionStart;
    const end = area.selectionEnd;
    const before = area.value.slice(0, start);
    const after = area.value.slice(end);
    let lead = "", trail = "";
    if (kind === "word") {
      if (before && !/\s$/.test(before)) lead = " ";
      trail = " ";
    } else {
      if (before && !/\s$/.test(before)) lead = " ";
    }
    area.value = before + lead + text + trail + after;
    const caret = (before + lead + text + trail).length;
    area.setSelectionRange(caret, caret);
    area.focus();
    updateWordCount();
    setSaveStatus("saving");
    debouncedAutosave();
    dismissed = false;
    debouncedSched();
  }

  function renderExample() {
    if (!showExample) { exampleBox.innerHTML = ""; return; }
    exampleBox.innerHTML = `
      <div class="example-box">
        <div class="example-label">Example</div>
        <div>${util.esc(ctx.example)}</div>
        ${ctx.exampleNote ? `<div class="example-note">${util.esc(ctx.exampleNote)}</div>` : ""}
        <button class="btn btn-ghost btn-sm mt-8" id="btn-copy-example">Copy example</button>
      </div>`;
    const b = exampleBox.querySelector("#btn-copy-example");
    b && b.addEventListener("click", async () => {
      const ok = await copyText(ctx.example);
      toast(ok ? "Example copied." : "Could not copy.", ok ? "success" : "error");
    });
  }

  function renderLearn() {
    if (!showLearn) { learnBox.innerHTML = ""; return; }
    learnBox.innerHTML = `<div class="tip-box mt-12"><strong>💡 Learn more</strong><p class="mb-0 mt-8">${util.esc(ctx.tip)}</p></div>`;
  }

  // ---------- Feedback ----------
  function renderCorrection(c) {
    if (typeof c === "string") return `<li class="muted">${util.esc(c)}</li>`;
    if (c && typeof c === "object") {
      const from = c.from ? `<span class="from">${util.esc(c.from)}</span>` : "";
      const to = c.to ? ` → <span class="to">${util.esc(c.to)}</span>` : "";
      const why = c.why ? `<div class="why">${util.esc(c.why)}</div>` : "";
      return `<div class="correction-item">${from}${to}${why}</div>`;
    }
    return "";
  }

  function renderFeedback() {
    if (!feedback) { feedbackRoot.innerHTML = ""; return; }
    const isAi = !!feedback.ai;
    const fb = isAi ? feedback.ai : feedback.basic;
    if (!fb) { feedbackRoot.innerHTML = ""; return; }

    const didWell = (fb.didWell || []).map((x) => `<li>${util.esc(x)}</li>`).join("");
    const corrections = (fb.corrections || []).map(renderCorrection).join("");
    const aiConfigured = store.getSettings().ai && store.getSettings().ai.endpoint;

    feedbackRoot.innerHTML = `
      <div class="feedback-panel mt-16">
        <div class="feedback-panel__header">
          ${isAi ? `<span class="chip badge-ai">AI feedback</span>` : `<span class="chip badge-basic">Basic checks (no AI)</span>`}
          <span style="font-weight:600">Writing check</span>
        </div>
        <div class="feedback-panel__body">
          ${aiBusy ? '<div class="mt-8" style="display:flex;gap:8px;align-items:center"><span class="spinner"></span> Getting AI feedback…</div>' : ""}
          <div class="feedback-section">
            <h4>🌟 What you did well</h4>
            <ul style="margin:0 0 0 18px">${didWell || "<li>You wrote something — that counts!</li>"}</ul>
          </div>
          ${corrections ? `<div class="feedback-section"><h4>✏️ A few useful corrections</h4>${corrections}</div>`
            : `<div class="feedback-section"><h4>✏️ Corrections</h4><p class="muted mb-0">Nothing to fix — your writing looks clean to this basic checker.</p></div>`}
          <div class="feedback-section">
            <h4>💡 One tip for next time</h4>
            <div class="tip-box">${util.esc(fb.tip || "Keep writing — every draft helps you improve.")}</div>
          </div>
          ${!isAi ? `
            <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:12px">
              <button class="btn btn-secondary btn-sm" id="btn-revise">Create revised draft</button>
              ${aiConfigured ? `<button class="btn btn-secondary btn-sm" id="btn-ai">Get AI feedback</button>` : ""}
            </div>
            <p class="small faint mt-8 mb-0">Creating a revised draft keeps your original safely in "Drafts & versions" below.</p>
            ${aiConfigured ? "" : `<p class="small faint mt-8 mb-0">Tip: this basic checker is offline and only catches simple issues. You can set up optional AI feedback in Settings.</p>`}
          ` : ""}
          ${isAi && aiError ? `<div class="error-banner mt-8">${util.esc(aiError)}</div>` : ""}
        </div>
      </div>`;

    const reviseBtn = feedbackRoot.querySelector("#btn-revise");
    if (reviseBtn) reviseBtn.addEventListener("click", createRevisedDraft);
    const aiBtn = feedbackRoot.querySelector("#btn-ai");
    if (aiBtn) aiBtn.addEventListener("click", runAi);
  }

  function createRevisedDraft() {
    const revised = applyFixes(area.value);
    if (revised === area.value) {
      toast("No automatic fixes to apply — your writing is already clean!", "info");
      return;
    }
    // Keep the original as a saved version, then set the revised text.
    store.addVersion(ctx.draftId, area.value, `Draft ${draft.versions.length + 1}`);
    area.value = revised;
    const label = `Revised ${draft.versions.length + 1}`;
    store.addVersion(ctx.draftId, revised, label);
    store.saveDraft(ctx.draftId, revised);
    draft = store.getDraft(ctx.draftId);
    updateWordCount();
    setSaveStatus("saving"); debouncedAutosave();
    renderVersions();
    toast("Revised draft created. Your original is kept.");
  }

  async function runAi() {
    const cfg = store.getSettings().ai;
    if (!cfg || !cfg.endpoint) return;
    aiBusy = true; aiError = null;
    renderFeedback();
    try {
      const res = await fetch(cfg.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(cfg.key ? { Authorization: "Bearer " + cfg.key } : {}) },
        body: JSON.stringify({ text: area.value, level: ctx.levelId, type: ctx.type, topic: ctx.topic, task: ctx.prompt }),
      });
      if (!res.ok) throw new Error("The AI service replied with status " + res.status);
      const data = await res.json();
      feedback = { ai: normalizeAi(data) };
    } catch (e) {
      aiError = "AI feedback is unavailable right now (" + (e.message || e) + "). Your basic checks above still work.";
      feedback = { basic: checkWriting(area.value, { minWords: ctx.minWords, level: ctx.levelId || "B1" }) };
    }
    aiBusy = false;
    renderFeedback();
  }

  function normalizeAi(data) {
    if (!data) return null;
    if (typeof data === "string") return { didWell: [], corrections: [], tip: data };
    const d = data;
    return {
      didWell: Array.isArray(d.didWell) ? d.didWell : [],
      corrections: Array.isArray(d.corrections) ? d.corrections : (Array.isArray(d.suggestions) ? d.suggestions : []),
      tip: d.tip || d.summary || d.message || "",
    };
  }

  function doCheck() {
    if (!area.value.trim()) { toast("Write something first, then check it.", "info"); return; }
    feedback = { basic: checkWriting(area.value, { minWords: ctx.minWords, level: ctx.levelId || "B1" }) };
    aiError = null;
    renderFeedback();
    feedbackRoot.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function recordIfCurriculum() {
    if (isPiece) return;
    store.recordPractice(ctx.draftId, util.wordCount(area.value), ctx.minWords, ctx.skills || [], {
      type: ctx.mode === "review" ? "review-task" : "activity",
      label: ctx.recordLabel || ctx.title,
    });
  }

  // ---------- Save / versions ----------
  function doSave() {
    if (!area.value.trim()) { toast("Write something first, then save.", "info"); return; }
    if (isPiece) {
      const title = (root.querySelector("#piece-title").value || "").trim() || "Untitled writing";
      const text = area.value;
      if (ctx.pieceId && ctx.pieceId !== "new") {
        store.updateWriting(ctx.pieceId, { title, text });
        toast("Saved to My Writing.");
      } else {
        const item = store.createWriting({ title, text, levelId: ctx.levelId, type: ctx.type, topic: ctx.topic });
        ctx.pieceId = item.id;
        history.replaceState(null, "", "#/writing/" + item.id);
        toast("Saved to My Writing.");
      }
      store.addVersion(ctx.draftId, text, `Saved ${draft.versions.length + 1}`);
    } else {
      store.addVersion(ctx.draftId, area.value, `Draft ${draft.versions.length + 1}`);
      recordIfCurriculum();
      toast("Draft saved.");
    }
    store.saveDraft(ctx.draftId, area.value);
    draft = store.getDraft(ctx.draftId);
    renderVersions();
    setSaveStatus("saved");
  }

  function continueLater() {
    store.saveDraft(ctx.draftId, area.value);
    if (isPiece) { location.hash = "#/writing"; }
    else { location.hash = ctx.backHref; }
    toast("Saved — you can continue any time.");
  }

  async function tryAgain() {
    if (area.value.trim()) {
      const ok = await confirmDialog({
        title: "Start this activity again?",
        body: "<p>Your current writing will be kept as a saved draft, and the editor will be cleared.</p>",
        confirmLabel: "Yes, start again",
      });
      if (!ok) return;
      store.addVersion(ctx.draftId, area.value, `Before restart ${draft.versions.length + 1}`);
    }
    area.value = "";
    updateWordCount();
    setSaveStatus("saving");
    debouncedAutosave();
    dismissed = false;
    renderVersions();
    renderSuggestions();
    toast("Fresh start. Your previous draft is kept below.");
  }

  function renderVersions() {
    const versions = draft.versions || [];
    if (!versions.length) { versionsRoot.innerHTML = ""; return; }
    const newestFirst = [...versions].reverse();
    const first = versions[0];
    const latest = versions[versions.length - 1];
    const selected = versions.find((v) => v.id === selectedVersionId) || latest;

    versionsRoot.innerHTML = `
      <div class="card mt-16">
        <div class="panel-title"><span>📝</span><strong>Drafts & versions (${versions.length})</strong></div>
        <p class="small muted">Your saved drafts are kept here. You can compare the first draft with a later one.</p>
        <div class="version-list">
          ${newestFirst.map((v) => `
            <button class="version-pill ${v.id === selected.id ? "active" : ""}" data-version="${v.id}">
              ${util.esc(v.label)} · ${util.esc(util.fmtRelative(v.at))}
            </button>`).join("")}
        </div>
        <div class="compare-col mt-12" style="background:var(--bg-softer);padding:12px;border-radius:8px;border:1px solid var(--border)">
          ${util.esc(selected.text) || "<span class='muted'>Empty draft.</span>"}
        </div>
        <div class="mt-8" style="display:flex;flex-wrap:wrap;gap:8px">
          <button class="btn btn-secondary btn-sm" id="btn-restore">Restore this draft</button>
          <button class="btn btn-ghost btn-sm" id="btn-copy-version">Copy</button>
          ${versions.length >= 2 ? `<button class="btn btn-ghost btn-sm" id="btn-compare">${showCompare ? "Hide comparison" : "Compare first & latest"}</button>` : ""}
        </div>
        ${showCompare && versions.length >= 2 ? `
          <div class="compare-grid mt-12">
            <div><div class="example-label">First draft</div><div class="compare-col">${util.esc(first.text) || "<span class='muted'>Empty</span>"}</div></div>
            <div><div class="example-label">Latest draft</div><div class="compare-col">${util.esc(latest.text) || "<span class='muted'>Empty</span>"}</div></div>
          </div>
          <div class="mt-12">
            <div class="example-label">Changes (green = added, red = removed)</div>
            <div class="compare-col" style="background:var(--bg-softer);padding:12px;border-radius:8px;border:1px solid var(--border)">${renderDiff(first.text, latest.text)}</div>
          </div>` : ""}
      </div>`;

    versionsRoot.querySelectorAll("[data-version]").forEach((b) => {
      b.addEventListener("click", () => { selectedVersionId = b.getAttribute("data-version"); renderVersions(); });
    });
    const restoreBtn = versionsRoot.querySelector("#btn-restore");
    restoreBtn && restoreBtn.addEventListener("click", () => {
      area.value = selected.text || "";
      updateWordCount(); setSaveStatus("saving"); debouncedAutosave();
      toast("Draft restored into the editor.");
    });
    const copyVer = versionsRoot.querySelector("#btn-copy-version");
    copyVer && copyVer.addEventListener("click", async () => {
      const ok = await copyText(selected.text || "");
      toast(ok ? "Copied." : "Could not copy.", ok ? "success" : "error");
    });
    const cmp = versionsRoot.querySelector("#btn-compare");
    cmp && cmp.addEventListener("click", () => { showCompare = !showCompare; renderVersions(); });
  }

  function renderDiff(a, b) {
    const ops = util.diffWords(a, b);
    if (!ops.length) return "<span class='muted'>No changes.</span>";
    return ops.map((o) => {
      if (o.t === "del") return `<span class="diff-del">${util.esc(o.w)}</span> `;
      if (o.t === "ins") return `<span class="diff-ins">${util.esc(o.w)}</span> `;
      return `${util.esc(o.w)} `;
    }).join("");
  }

  // ---------- Event wiring ----------
  area.addEventListener("input", () => {
    updateWordCount();
    setSaveStatus("saving");
    debouncedAutosave();
    dismissed = false;
    debouncedSched();
  });

  root.querySelector("#sugg-toggle").addEventListener("change", (e) => {
    suggestionsOn = e.target.checked;
    store.saveSettings({ suggestions: suggestionsOn });
    if (!suggestionsOn) suggestBar.classList.add("hidden");
    else { dismissed = false; renderSuggestions(); }
    toast(suggestionsOn ? "Suggestions are on." : "Suggestions are off.", "info");
  });

  root.querySelector("#suggest-dismiss").addEventListener("click", () => {
    dismissed = true;
    suggestBar.classList.add("hidden");
  });

  suggestChips.addEventListener("click", (e) => {
    const chip = e.target.closest("[data-sugg]");
    if (!chip) return;
    insertSuggestion(chip.getAttribute("data-sugg"), chip.getAttribute("data-kind"));
  });

  if (btnExample) btnExample.addEventListener("click", () => {
    showExample = !showExample;
    btnExample.textContent = showExample ? "Hide example" : "Show example";
    renderExample();
  });
  if (btnLearn) btnLearn.addEventListener("click", () => {
    showLearn = !showLearn;
    btnLearn.textContent = showLearn ? "Hide tips" : "Learn more";
    renderLearn();
  });

  root.querySelector("#choice-row").querySelectorAll("[data-choice]").forEach((b) => {
    b.addEventListener("click", () => {
      choice = b.getAttribute("data-choice");
      store.saveDraftMeta(ctx.draftId, { choice });
      draft = store.getDraft(ctx.draftId);
      root.querySelectorAll("[data-choice]").forEach((x) => x.classList.toggle("accent", x.getAttribute("data-choice") === choice));
    });
  });

  root.querySelector("#btn-save").addEventListener("click", doSave);
  root.querySelector("#btn-continue").addEventListener("click", continueLater);
  root.querySelector("#btn-tryagain").addEventListener("click", tryAgain);
  root.querySelector("#btn-copy").addEventListener("click", async () => {
    if (!area.value.trim()) { toast("Nothing to copy yet.", "info"); return; }
    const ok = await copyText(area.value);
    toast(ok ? "Your writing copied." : "Could not copy.", ok ? "success" : "error");
  });
  root.querySelector("#btn-check").addEventListener("click", doCheck);

  // Initial render
  updateWordCount();
  renderVersions();
  if (suggestionsOn && area.value.trim()) renderSuggestions();

  // Cleanup on navigation: flush any pending autosave.
  return () => { store.saveDraft(ctx.draftId, area.value); };
}
