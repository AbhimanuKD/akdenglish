// suggest.js — optional writing suggestions (rule-based, offline).
// Not AI: a small bank of level- and genre-appropriate starters and connectors.
// Suggestions are ONLY shown; they never insert themselves.

const BAND = {
  simple: ["A1", "A2"],
  mid: ["B1", "B2"],
  high: ["C1", "C2"],
};

// Sentence/phrase starters per writing type, tagged simple or advanced.
const STARTERS = {
  everyday: {
    simple: ["Today", "Every morning", "I usually", "At the weekend,", "In the evening,"],
    advanced: ["On a typical day,", "Most days I", "From time to time,", "As part of my routine,"],
  },
  personal: {
    simple: ["My name is", "I am", "I like", "I enjoy", "I come from", "My favourite"],
    advanced: ["I would describe myself as", "One thing about me is", "I am passionate about", "Growing up, I"],
  },
  description: {
    simple: ["It is", "There is", "It looks", "It feels", "The best part is"],
    advanced: ["At first glance,", "What stands out is", "The most noticeable thing is", "Surrounding it, there is"],
  },
  message: {
    simple: ["Hi", "Just to let you know,", "Could you", "See you", "Thanks"],
    advanced: ["I just wanted to mention", "Would you mind", "Just checking in", "I look forward to"],
  },
  story: {
    simple: ["One day,", "Then,", "After that,", "Finally,", "At first,", "Later,"],
    advanced: ["It all started when", "Before long,", "To my surprise,", "Looking back,", "By the end,"],
  },
  email: {
    simple: ["Dear", "I hope you are well.", "I am writing to", "Thank you for", "Best regards,"],
    advanced: ["I am writing to follow up on", "I would be grateful if", "Please do not hesitate to", "I look forward to hearing from you."],
  },
  work: {
    simple: ["I am writing to", "Could you please", "I would like to", "Following our meeting,", "Kind regards,"],
    advanced: ["With reference to", "I would appreciate it if", "To summarise our discussion,", "Please find attached", "I would be happy to discuss further."],
  },
  school: {
    simple: ["In my class,", "I studied", "My project is about", "I learned that"],
    advanced: ["The aim of this project is", "Through my research,", "In conclusion,", "This has taught me that"],
  },
  opinion: {
    simple: ["I think", "In my opinion,", "I like", "I believe", "For me,"],
    advanced: ["On the one hand,", "From my point of view,", "It seems to me that", "There are several reasons", "Having said that,"],
  },
  review: {
    simple: ["I really enjoyed", "What I liked most was", "The best part was", "However,", "I would recommend"],
    advanced: ["The highlight for me was", "One minor drawback is", "On the whole,", "It is worth noting that"],
  },
  report: {
    simple: ["This report", "The purpose of this report is", "In summary,", "Overall,"],
    advanced: ["This report outlines", "According to the findings,", "The key points are", "It is recommended that", "In conclusion,"],
  },
  essay: {
    simple: ["In this essay,", "Firstly,", "Also,", "On the other hand,", "To conclude,"],
    advanced: ["It is often said that", "Moreover,", "Nevertheless,", "This is supported by", "To summarise,", "It could be argued that"],
  },
};

// Next-word continuations after common openings.
const NEXT_WORD = {
  "I": ["like", "am", "enjoy", "have", "think", "want"],
  "I like": ["to", "reading", "playing", "cooking", "watching"],
  "I am": ["from", "a student", "happy", "learning", "interested in"],
  "I think": ["that", "it is", "this is"],
  "I have": ["a", "been", "to"],
  "I want": ["to", "a"],
  "The": ["weather", "food", "city", "book", "film", "park"],
  "My": ["name", "favourite", "day", "family", "friend", "home"],
  "We": ["can", "should", "are", "went", "had"],
  "It is": ["a", "very", "important", "nice", "easy"],
  "There is": ["a", "an", "a lot of"],
  "to": ["be", "go", "do", "see", "learn", "visit"],
  "In": ["the", "my", "our"],
};

function levelBand(level) {
  if (BAND.simple.includes(level)) return "simple";
  if (BAND.high.includes(level)) return "high";
  return "mid";
}

function startersFor(type, band) {
  const set = STARTERS[type] || STARTERS.essay;
  if (band === "simple") return set.simple;
  if (band === "high") return [...set.advanced, ...set.simple];
  return [...set.simple, ...set.advanced];
}

function nextWordsFor(text) {
  const trimmed = text.trimEnd();
  if (!trimmed) return [];
  // Look at the last 1-2 words (longest match first).
  const keys = Object.keys(NEXT_WORD).sort((a, b) => b.split(" ").length - a.split(" ").length);
  for (const k of keys) {
    if (trimmed.toLowerCase().endsWith(" " + k.toLowerCase()) || trimmed.toLowerCase() === k.toLowerCase()) {
      return NEXT_WORD[k];
    }
  }
  return [];
}

// Main entry: returns an array of { text, kind } (kind: "word" | "phrase").
// Returns [] when the learner is still mid-word (so we never interrupt typing).
export function getSuggestions(text, opts = {}) {
  if (!text) return [];
  const lastChar = text.slice(-1);
  const midWord = /[A-Za-z']$/.test(lastChar);
  if (midWord) return [];

  const type = opts.type || "essay";
  const band = levelBand(opts.level || "B1");
  const suggestions = [];

  // End of a sentence -> next-sentence starters.
  const justEndedSentence = /[.!?]\s*$/.test(text) && text.trim().length > 1;

  if (justEndedSentence) {
    const starters = startersFor(type, band);
    for (const s of starters.slice(0, 4)) suggestions.push({ text: s, kind: "sentence" });
  } else if (text.trim().length === 0) {
    // Empty editor -> suggest a first sentence.
    for (const s of startersFor(type, band).slice(0, 4)) suggestions.push({ text: s, kind: "phrase" });
  } else {
    // Mid-draft after a space -> next word, then a couple of phrases.
    const words = nextWordsFor(text);
    for (const w of words.slice(0, 3)) suggestions.push({ text: w, kind: "word" });
    const phrasePool = startersFor(type, band).filter((s) => s.toLowerCase() !== text.trim().toLowerCase());
    for (const p of phrasePool.slice(0, 2)) suggestions.push({ text: p, kind: "phrase" });
  }

  // De-duplicate and cap at 4.
  const seen = new Set();
  const out = [];
  for (const s of suggestions) {
    const key = s.text.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(s);
    if (out.length >= 4) break;
  }
  return out;
}

// Kind label for the UI.
export function kindLabel(kind) {
  if (kind === "word") return "word";
  if (kind === "sentence") return "next sentence";
  return "phrase";
}
