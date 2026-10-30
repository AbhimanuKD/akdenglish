import { LEVELS, REVIEWS, PLACEMENT_QUESTIONS, SKILLS, TOPICS, WRITING_TYPES, allActivities, getActivity, getLevel } from "./js/curriculum.js";

const errs = [];
const all = allActivities();
console.log("levels:", LEVELS.length, "| activities:", all.length);

const wantTypes = Object.keys(WRITING_TYPES);
const wantTopics = Object.keys(TOPICS);
const typeCount = {};
const topicCount = {};
const skillCount = {};

for (const l of LEVELS) {
  if (!["A1", "A2", "B1", "B2", "C1", "C2"].includes(l.id)) errs.push("bad level id " + l.id);
  if (!l.units || l.units.length !== 4) errs.push("level " + l.id + " units=" + (l.units && l.units.length));
  for (const u of l.units) {
    if (!u.activities || u.activities.length < 3) errs.push("unit " + u.id + " activities=" + (u.activities && u.activities.length));
    for (const a of u.activities) {
      for (const f of ["id", "title", "type", "skills", "instructions", "example", "exampleNote", "tip", "prompt", "choices", "minWords"]) {
        if (!(f in a)) errs.push("missing " + f + " in " + a.id);
      }
      if (!Array.isArray(a.skills) || a.skills.length === 0) errs.push("skills empty " + a.id);
      if (typeof a.minWords !== "number" || a.minWords <= 0) errs.push("minWords bad " + a.id);
      if (!wantTypes.includes(a.type)) errs.push("unknown type " + a.type + " in " + a.id);
      typeCount[a.type] = (typeCount[a.type] || 0) + 1;
      if (u.topic && !wantTopics.includes(u.topic)) errs.push("unknown topic " + u.topic + " in " + u.id);
      topicCount[u.topic] = (topicCount[u.topic] || 0) + 1;
      for (const s of a.skills) skillCount[s] = (skillCount[s] || 0) + 1;
    }
  }
}

// Reviews
for (const lv of Object.keys(REVIEWS)) {
  const r = REVIEWS[lv];
  if (!r.tasks || r.tasks.length < 3) errs.push("review " + lv + " has too few tasks");
  for (const t of r.tasks) {
    for (const f of ["id", "instructions", "prompt", "type", "minWords"]) if (!(f in t)) errs.push("review task missing " + f);
  }
}

// Spot checks
const sample = all[0] && all[0].activity.id;
if (sample && !getActivity(sample)) errs.push("getActivity failed for " + sample);
if (!getLevel("B2")) errs.push("getLevel B2 failed");

console.log("missing types:", wantTypes.filter((t) => !typeCount[t]));
console.log("missing topics:", wantTopics.filter((t) => !topicCount[t]));
console.log("missing skills:", SKILLS.map((s) => s.id).filter((s) => !skillCount[s]));
console.log("placement questions:", PLACEMENT_QUESTIONS.length);
console.log("ERRORS:", errs.length);
if (errs.length) console.log(errs.slice(0, 40).join("\n"));
process.exit(errs.length ? 1 : 0);
