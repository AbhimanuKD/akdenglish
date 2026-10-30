// checker.js — offline "basic checks" feedback (grammar/spelling heuristics).
// This is NOT AI: it is a small, honest rule-based checker. Original text is
// never modified here; corrections are returned as data only.

// Common learner misspellings and missing-apostrophe contractions.
// Keys are lowercase; values are the correction.
const SPELL = {
  recieve: "receive", recieved: "received", seperate: "separate",
  definately: "definitely", definitly: "definitely", wich: "which",
  whitch: "which", teh: "the", alot: "a lot", becuase: "because",
  becouse: "because", becase: "because", becaus: "because",
  freind: "friend", freinds: "friends", occured: "occurred",
  untill: "until", writting: "writing", writen: "written",
  writeing: "writing", beleive: "believe", belive: "believe",
  acheive: "achieve", begining: "beginning", tomorow: "tomorrow",
  tommorow: "tomorrow", tommorrow: "tomorrow", toogether: "together",
  realy: "really", sincerly: "sincerely", beutiful: "beautiful",
  beautifull: "beautiful", bautiful: "beautiful", intresting: "interesting",
  diferent: "different", diffrent: "different", enviroment: "environment",
  govenment: "government", grammer: "grammar", happend: "happened",
  hapen: "happen", neccessary: "necessary", nessecary: "necessary",
  problum: "problem", probaly: "probably", probly: "probably",
  questoin: "question", sucess: "success", succes: "success",
  thier: "their", truely: "truly", famliy: "family", favorit: "favorite",
  favourtie: "favourite", scedule: "schedule", shedule: "schedule",
  adress: "address", adres: "address", exersise: "exercise",
  excercise: "exercise", experiance: "experience", knowlege: "knowledge",
  languege: "language", lenguage: "language", lisence: "license",
  myslef: "myself", neice: "niece", occassion: "occasion",
  occured: "occurred", peice: "piece", peaple: "people", ppl: "people",
  posession: "possession", prefered: "preferred", prefering: "preferring",
  relevent: "relevant", remeber: "remember", rember: "remember",
  resaurant: "restaurant", restraunt: "restaurant", shcool: "school",
  similiar: "similar", specail: "special", suprise: "surprise",
  surprize: "surprise", tommorow: "tomorrow", twelth: "twelfth",
  unecessary: "unnecessary", unfortunatly: "unfortunately", untill: "until",
  vacum: "vacuum", vegtable: "vegetable", visable: "visible",
  wendsday: "Wednesday", wendesday: "Wednesday", wirte: "write",
  writen: "written", yesturday: "yesterday",
  // Missing apostrophes (contractions)
  dont: "don't", doesnt: "doesn't", cant: "can't", cannot: "cannot",
  wont: "won't", im: "I'm", youre: "you're", theyre: "they're",
  isnt: "isn't", didnt: "didn't", wasnt: "wasn't", shouldnt: "shouldn't",
  couldnt: "couldn't", wouldnt: "wouldn't", havent: "haven't",
  hasnt: "hasn't", id: "I'd", ill: "I'll", ive: "I've",
};

function capitalizeFirst(s) {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}
function preserveCase(original, corrected) {
  if (!original) return corrected;
  if (original[0] === original[0].toUpperCase() && original[0] !== original[0].toLowerCase()) {
    return capitalizeFirst(corrected);
  }
  return corrected;
}

export function analyze(text) {
  const trimmed = (text || "").trim();
  const wordMatches = trimmed.match(/[\w']+/g) || [];
  const words = wordMatches.length;
  const sentences = trimmed.split(/[.!?]+/).map((s) => s.trim()).filter((s) => /\w/.test(s));
  const sentenceCount = sentences.length || (words ? 1 : 0);
  const unique = new Set(wordMatches.map((w) => w.toLowerCase()));
  const avgSentenceLen = sentenceCount ? Math.round(words / sentenceCount) : 0;
  const longestSentence = sentences.reduce((m, s) => Math.max(m, (s.match(/[\w']+/g) || []).length), 0);
  return { words, sentences: sentenceCount, uniqueWords: unique.size, avgSentenceLen, longestSentence };
}

function checkSpelling(text, corrections) {
  const seen = new Set();
  const re = /[\w']+/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    const word = m[0];
    const lower = word.toLowerCase();
    if (SPELL[lower]) {
      const key = lower + "|" + m.index;
      if (seen.has(key)) continue;
      seen.add(key);
      // Skip if the surrounding text already contains the correction nearby (avoid dupes).
      corrections.push({
        from: word,
        to: preserveCase(word, SPELL[lower]),
        why: `"${word}" is usually written "${preserveCase(word, SPELL[lower])}".`,
        kind: "spelling",
      });
    }
  }
}

function checkPronounI(text, corrections) {
  const re = /\bi\b/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    corrections.push({ from: "i", to: "I", why: 'The pronoun "I" is always a capital letter.', kind: "capitalization" });
    // Only flag once to keep feedback short.
    break;
  }
}

function checkSentenceCapitalization(text, corrections) {
  const sentences = text.split(/(?<=[.!?])\s+/);
  let flagged = 0;
  for (const s of sentences) {
    const words = (s.match(/[\w']+/g) || []);
    if (words.length <= 2) continue; // skip very short fragments
    const first = s.match(/[A-Za-z]/);
    if (first && first[0] === first[0].toLowerCase()) {
      corrections.push({
        from: first[0],
        to: first[0].toUpperCase(),
        why: "Sentences usually start with a capital letter.",
        kind: "capitalization",
      });
      flagged++;
      if (flagged >= 2) break;
    }
  }
}

function checkRepeatedAndSpaces(text, corrections) {
  const repRe = /\b(\w+)\s+\1\b/gi;
  let m;
  while ((m = repRe.exec(text)) !== null) {
    corrections.push({
      from: m[0],
      to: m[1],
      why: `"${m[1]} ${m[1]}" has a repeated word.`,
      kind: "repetition",
    });
  }
  if (/  +/.test(text)) {
    corrections.push({ from: "double spaces", to: "single space", why: "Remove the extra spaces between words.", kind: "spacing" });
  }
}

function checkEndingPunctuation(text, stats, corrections) {
  if (stats.words > 2 && /\w$/.test(text.trim())) {
    corrections.push({
      from: null,
      to: ".",
      why: "Add a full stop ( . ) at the end of your final sentence.",
      kind: "punctuation",
    });
  }
}

function buildPositives(stats, minWords) {
  const out = [];
  if (stats.words > 0) out.push(`You wrote ${stats.words} ${stats.words === 1 ? "word" : "words"} — a great effort.`);
  if (stats.words >= minWords) out.push("You reached the suggested length. Well done.");
  if (stats.words > 25 && stats.uniqueWords / stats.words > 0.55) {
    out.push("You used a nice variety of words.");
  }
  if (stats.sentences >= 2 && stats.avgSentenceLen >= 5 && stats.avgSentenceLen <= 25) {
    out.push("Your sentences are a clear, comfortable length to read.");
  }
  if (stats.sentences >= 3) out.push("You organised your ideas into several sentences.");
  out.push("You put your ideas into your own words — that is the most important step.");
  return out.slice(0, 4);
}

function chooseTip(stats, correctionCount, level) {
  if (correctionCount > 0) {
    return "Read your writing aloud once after you fix the small points above — your ear catches a lot.";
  }
  if (stats.longestSentence > 35) {
    return "Try splitting your longest sentence into two shorter sentences. It makes your meaning clearer.";
  }
  if (stats.sentences >= 2 && stats.avgSentenceLen < 6) {
    return "Try joining two short sentences with a linking word like 'and', 'but', or 'so'.";
  }
  if (stats.words > 0 && stats.words < 60) {
    return "Add one or two more sentences with a detail or an example.";
  }
  if (level === "A1" || level === "A2") {
    return "Keep your sentences short and simple, and check that each one ends with a full stop.";
  }
  if (level === "B1" || level === "B2") {
    return "Try linking your ideas with words like 'however', 'because', and 'for example'.";
  }
  return "Reread your writing for clarity and cut any words that do not add meaning.";
}

export function checkWriting(text, opts = {}) {
  const minWords = opts.minWords || 50;
  const level = opts.level || "B1";
  const stats = analyze(text);
  const corrections = [];
  if (stats.words > 0) {
    checkSpelling(text, corrections);
    checkPronounI(text, corrections);
    checkSentenceCapitalization(text, corrections);
    checkRepeatedAndSpaces(text, corrections);
    checkEndingPunctuation(text, stats, corrections);
  }
  const didWell = buildPositives(stats, minWords);
  const tip = chooseTip(stats, corrections.length, level);
  return { didWell, corrections: corrections.slice(0, 8), tip, stats };
}

// Apply the safe, deterministic word-level fixes to build a revised draft.
// The learner's original is never changed; this returns a NEW string.
export function applyFixes(text) {
  let out = text;
  // Spelling + contractions (word by word, preserve case).
  out = out.replace(/[\w']+/g, (w) => {
    const lower = w.toLowerCase();
    return SPELL[lower] ? preserveCase(w, SPELL[lower]) : w;
  });
  // Pronoun "i" -> "I".
  out = out.replace(/\bi\b/g, "I");
  // Repeated adjacent words.
  out = out.replace(/\b(\w+)\s+\1\b/gi, "$1");
  // Collapse multiple spaces.
  out = out.replace(/[ \t]{2,}/g, " ");
  return out;
}
