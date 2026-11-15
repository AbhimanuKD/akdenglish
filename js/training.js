// training.js — lightweight game-style progress layer for the existing learning path.
// Progress stays on this device and uses the app's existing practice records.
import { LEVELS, allActivities } from "./curriculum.js";
import * as store from "./store.js";
import * as util from "./util.js";

function localDay(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function learningStats() {
  const progress = store.getProgress();
  const history = progress.history || [];
  const practisedDays = [...new Set(history.map((item) => localDay(item.at)).filter(Boolean))].sort().reverse();
  const today = localDay(new Date());
  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterday = localDay(yesterdayDate);
  let streak = 0;
  let expected = practisedDays[0] === today ? today : practisedDays[0] === yesterday ? yesterday : "";
  if (expected) {
    for (const day of practisedDays) {
      if (day !== expected) break;
      streak++;
      const previous = new Date(`${expected}T12:00:00`);
      previous.setDate(previous.getDate() - 1);
      expected = localDay(previous);
    }
  }
  const todayLessons = new Set(history.filter((item) => localDay(item.at) === today && item.activityId && item.type === "activity").map((item) => item.activityId)).size;
  const completed = store.countCompletedActivities();
  const practised = store.countPractisedActivities();
  return { streak, todayLessons, xp: completed * 10 + Math.max(0, practised - completed) * 5 };
}

function journeyCard(level, stats, nextActivity) {
  const done = level.units.reduce((count, unit) => count + unit.activities.filter((activity) => {
    const record = store.getActivityProgress(activity.id);
    return !!(record && record.completed);
  }).length, 0);
  const total = level.units.reduce((count, unit) => count + unit.activities.length, 0);
  const percent = total ? Math.round((done / total) * 100) : 0;
  const target = 1;
  return `
    <section class="training-dashboard card" aria-label="Your learning progress">
      <div class="training-dashboard__top">
        <div>
          <span class="training-eyebrow">YOUR LEARNING JOURNEY</span>
          <h2>Small steps, real progress ✨</h2>
          <p class="muted mb-0">${util.esc(level.id)} · ${util.esc(level.name)} — ${util.esc(level.tagline)}</p>
        </div>
        <a class="btn btn-lg training-continue" href="#/practice/${encodeURIComponent(nextActivity.id)}">Continue learning <span aria-hidden="true">→</span></a>
      </div>
      <div class="training-metrics">
        <div class="training-metric"><span class="training-metric__icon" aria-hidden="true">⚡</span><strong>${stats.xp}</strong><span>XP earned</span></div>
        <div class="training-metric"><span class="training-metric__icon" aria-hidden="true">🔥</span><strong>${stats.streak}</strong><span>day streak</span></div>
        <div class="training-metric"><span class="training-metric__icon" aria-hidden="true">🎯</span><strong>${Math.min(stats.todayLessons, target)}/${target}</strong><span>today's goal</span></div>
      </div>
      <div class="training-level-progress">
        <div class="training-level-progress__labels"><strong>${util.esc(level.name)} path</strong><span>${done} of ${total} lessons completed · ${percent}%</span></div>
        <div class="progress" role="progressbar" aria-label="${util.esc(level.name)} lesson progress" aria-valuemin="0" aria-valuemax="${total}" aria-valuenow="${done}"><span style="width:${percent}%"></span></div>
      </div>
      <p class="training-note mb-0">Your writing is saved on this device. Finish a lesson to earn XP — no streak pressure, just practice when it suits you.</p>
    </section>`;
}

function enhancePath() {
  const container = document.querySelector("#app .container");
  if (!container) return;
  const settings = store.getSettings();
  const level = LEVELS.find((item) => item.id === settings.level) || LEVELS[0];
  const progress = store.getProgress();
  const activities = level.units.flatMap((unit) => unit.activities);
  const next = activities.find((activity) => !(progress.activities[activity.id] && progress.activities[activity.id].completed)) || activities[0] || allActivities()[0]?.activity;
  const sectionHead = container.querySelector(".section-head");
  if (!next || !sectionHead) return;
  sectionHead.insertAdjacentHTML("afterend", journeyCard(level, learningStats(), next));

  // Add clear completed/current-step cues without preventing learners from revisiting any lesson.
  let upcomingSet = false;
  container.querySelectorAll(".level-card").forEach((card) => {
    const cardLevel = card.querySelector(".level-badge")?.textContent?.trim();
    card.querySelectorAll(".activity-row[href*='#/practice/']").forEach((row) => {
      const id = decodeURIComponent((row.getAttribute("href") || "").split("/").pop() || "");
      const record = store.getActivityProgress(id);
      row.classList.add("training-lesson");
      if (record?.completed) {
        row.classList.add("training-lesson--done");
        row.setAttribute("aria-label", `${row.querySelector(".activity-row__title")?.textContent.trim() || "Lesson"}, completed`);
      } else if (!upcomingSet && cardLevel === level.id) {
        row.classList.add("training-lesson--next");
        upcomingSet = true;
      }
    });
  });
}

function enhanceHome() {
  const container = document.querySelector("#app .container");
  const hero = container?.querySelector(".hero");
  if (!hero) return;
  const stats = learningStats();
  const level = LEVELS.find((item) => item.id === store.getSettings().level) || LEVELS[0];
  hero.insertAdjacentHTML("afterend", `
    <a class="training-home-card" href="#/path">
      <span class="training-home-card__icon" aria-hidden="true">🌱</span>
      <span><strong>Ready for a quick lesson?</strong><small>${util.esc(level.id)} · ${stats.xp} XP · ${stats.streak} day streak</small></span>
      <span class="training-home-card__arrow" aria-hidden="true">→</span>
    </a>`);
}

export function enhanceTraining(route) {
  if (route.name === "path") enhancePath();
  if (route.name === "home") enhanceHome();
}
