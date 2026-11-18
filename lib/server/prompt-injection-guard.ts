import { randomBytes } from "node:crypto";

// Prompt-injection defenses for the public portfolio assistant.
//
// The assistant answers questions from retrieved chunks of public project
// documents. Both the visitor's question and the retrieved text are attacker
// controllable (anyone can open a pull request, and the chat is public), so
// this module applies three layers:
//   1. screenQuestion: refuse obvious instruction-override / prompt-extraction
//      attempts before any model call happens.
//   2. buildGroundedContext: wrap every retrieved chunk in a per-request
//      random boundary marker and neutralize marker-like sequences inside the
//      chunks, so retrieved text cannot impersonate the system turn or break
//      out of its sandbox.
//   3. looksCompromised: detect answers that echo the scaffolding (boundary
//      markers, prompt sections), and replace them with a fixed safe reply.
//
// None of this makes injection impossible; it raises the cost and fails
// closed. Private data must simply never be indexed (enforced elsewhere by
// the reviewed-source allowlist in the assistant route).

export const BLOCKED_QUESTION_REPLY =
  "I can only answer questions about Rahul's public portfolio, projects, and experience. " +
  "Try asking about a specific project, his skills, or how to contact him.";

export const FALLBACK_REPLY =
  "I could not produce a reliable answer for that. Please ask about Rahul's public projects or experience, " +
  "or contact Rahul directly.";

// Each pattern is paired with a stable id so logs record which rule fired
// without storing the attacker's text.
const INJECTION_PATTERNS: ReadonlyArray<{ id: string; pattern: RegExp }> = [
  {
    id: "ignore-instructions",
    pattern:
      /\b(ignore|disregard|forget|override|bypass|skip)\b[^.\n]{0,60}\b(all|any|every|the|your|yours|previous|prior|above|earlier|preceding|initial|original|system|safety|these|those)?[^.\n]{0,40}\b(instructions?|rules?|prompts?|directions?|guidelines?|constraints|programming|training|policies)\b/i,
  },
  {
    id: "prompt-extraction",
    pattern:
      /\b(reveal|show|print|repeat|recite|output|display|share|disclose|leak|tell|give|quote|write|dump|echo)\b[^.\n]{0,50}\b(system\s+prompt|system\s+instructions?|hidden\s+(instructions?|prompt|rules?)|initial\s+(instructions?|prompt)|full\s+prompt|prompt\s+(text|content)|your\s+(instructions?|rules?|prompt|configuration|config|directives|programming))\b/i,
  },
  {
    id: "prompt-extraction-direct",
    pattern: /\b(what (are|were) your|state your|your actual|your real|your true|your secret)\b[^.\n]{0,40}\b(instructions?|rules?|prompt|directives|programming)\b/i,
  },
  {
    id: "persona-override",
    pattern:
      /\b(you are now|from now on you|act as|pretend (to be|you are|you'?re)|roleplay as|role-?play|assume the (role|persona)|become|new persona|developer mode|dev mode|jailbreak|jail break|DAN\b|do anything now|no restrictions|without (any )?(restrictions|filters|limits|rules))\b/i,
  },
  {
    id: "special-token",
    pattern: /<\|[^|\n]{1,40}\|>|<<\s*SYS\s*>>|\[\/?INST\]|\b(im_start|im_end|endoftext)\b/i,
  },
  {
    id: "scaffold-mimicry",
    pattern: /(PORTFOLIO CONTEXT|UNTRUSTED PORTFOLIO SOURCE|BEGIN UNTRUSTED|END UNTRUSTED|PORTFOLIO SOURCES|VISITOR QUESTION|QUESTION:)/,
  },
  {
    id: "authority-claim",
    pattern:
      /\b(i am|i'm|this is|as)\b[^.\n]{0,30}\b(rahul|the (site |portfolio )?owner|your (creator|developer|owner|admin|administrator|maker)|an? (admin|administrator|developer))\b[^.\n]{0,60}\b(approve|authoriz|allow|grant|instruct|command|order|tell you|permit)/i,
  },
  {
    id: "encoding-ask",
    pattern: /\b(answer|respond|reply|encode|decode|translate)\b[^.\n]{0,30}\b(in|as|to|from|using)\b[^.\n]{0,20}\b(base64|hex(?:adecimal)?|rot13|morse|binary|unicode escapes?)\b/i,
  },
];

// Obfuscation-resistant screening: also test a leetspeak-decoded variant, a
// variant with single-letter spacing collapsed, and a fully squashed variant
// (all whitespace removed) against compact forms of the core attacks.
const LEET_MAP: Record<string, string> = {
  "0": "o", "1": "i", "3": "e", "4": "a", "5": "s", "7": "t", "@": "a", "$": "s", "!": "i",
};

function screeningVariants(question: string): string[] {
  const deLeet = question.replace(/[013457@$!]/g, (ch) => LEET_MAP[ch] ?? ch);
  const unspaced = deLeet.replace(
    /\b(?:[A-Za-z]\s+){2,}[A-Za-z]\b/g,
    (match) => match.replace(/\s+/g, ""),
  );
  return [question, deLeet, unspaced];
}

// Compact patterns run against the whitespace-squashed lowercase text, where
// "i g n o r e   a l l   p r e v i o u s   i n s t r u c t i o n s" and
// "1gn0r3 4ll pr3v10us 1nstruct10ns" both become recognizable.
const SQUASHED_PATTERNS: ReadonlyArray<{ id: string; pattern: RegExp }> = [
  { id: "ignore-instructions-squashed", pattern: /(ignore|disregard|forget|override)(all|any|your|the)?(previous|prior|above|earlier|system|these|those)?instructions?/ },
  { id: "prompt-extraction-squashed", pattern: /(reveal|show|print|repeat|display|share|tellme|giveme)(your|the)?(system|hidden|secret|full|initial)?(systemprompt|instructions?|prompt|rules?)/ },
];

// Long opaque blobs are never a portfolio question; they are how encoded
// instructions travel.
const ENCODED_BLOB_PATTERNS: ReadonlyArray<{ id: string; pattern: RegExp }> = [
  { id: "base64-blob", pattern: /(?<![\w/+=])[A-Za-z0-9+/]{100,}={0,2}(?![\w/+=])/ },
  { id: "hex-blob", pattern: /(?<![0-9a-fA-F])[0-9a-fA-F]{160,}(?![0-9a-fA-F])/ },
];

// Common non-English phrasings of the same attacks.
const MULTILINGUAL_PATTERN =
  /(ignora(r|z)?\s+(todas\s+|toutes\s+)?(las\s+|les\s+)?instrucciones|ignorez\s+(toutes\s+)?(les\s+)?instructions|ignorier\w*\s+[^.\n]{0,30}anweisungen|अनदेखा|भूल\s*जाओ|അവഗണിക്ക)/i;

export type QuestionScreening =
  | { allowed: true }
  | { allowed: false; patternId: string };

// Screen the visitor's question. Blocked questions get a fixed reply and
// never reach the model, which also keeps them free of provider cost.
export function screenQuestion(question: string): QuestionScreening {
  for (const variant of screeningVariants(question)) {
    for (const { id, pattern } of INJECTION_PATTERNS) {
      if (pattern.test(variant)) {
        return { allowed: false, patternId: id };
      }
    }
    if (MULTILINGUAL_PATTERN.test(variant)) {
      return { allowed: false, patternId: "multilingual-override" };
    }
    for (const { id, pattern } of ENCODED_BLOB_PATTERNS) {
      if (pattern.test(variant)) {
        return { allowed: false, patternId: id };
      }
    }
    const squashed = variant.toLowerCase().replace(/\s+/g, "");
    for (const { id, pattern } of SQUASHED_PATTERNS) {
      if (pattern.test(squashed)) {
        return { allowed: false, patternId: id };
      }
    }
  }
  return { allowed: true };
}

// Retrieval-side gate, independent of model obedience: a retrieved chunk may
// reach the provider only when its source AND exact version are both the
// active registry version and an explicitly reviewed public version.
export function isReviewedMatch(
  match: { sourceId?: unknown; sourceVersion?: unknown },
  activeVersions: ReadonlyMap<string, string>,
  reviewedVersions: ReadonlyMap<string, string>,
): boolean {
  return (
    typeof match.sourceId === "string" &&
    typeof match.sourceVersion === "string" &&
    activeVersions.get(match.sourceId) === match.sourceVersion &&
    reviewedVersions.get(match.sourceId) === match.sourceVersion
  );
}

// A fresh random marker per request, so indexed or injected text cannot know
// the delimiter it would need to forge.
export function createContextBoundary(): string {
  return `CTX-${randomBytes(8).toString("hex")}`;
}

export const MAX_CHUNK_CHARACTERS = 2_000;
export const MAX_CONTEXT_CHARACTERS = 12_000;

// Neutralize anything inside retrieved text that could imitate the
// scaffolding: angle-bracket runs, the literal scaffold phrases, control
// characters other than newline/tab, and overlong chunks.
export function sanitizeChunkText(text: string, maxCharacters = MAX_CHUNK_CHARACTERS): string {
  return text
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, " ")
    .replace(/<{2,}/g, "<")
    .replace(/>{2,}/g, ">")
    .replace(/PORTFOLIO CONTEXT/g, "PORTFOLIOCONTEXT")
    .replace(/UNTRUSTED PORTFOLIO SOURCE/g, "UNTRUSTEDPORTFOLIOSOURCE")
    .replace(/PORTFOLIO SOURCES/g, "PORTFOLIOSOURCES")
    .replace(/VISITOR QUESTION/g, "VISITORQUESTION")
    .slice(0, maxCharacters);
}

export type GroundedChunk = {
  title: string;
  sourceUrl: string;
  content: string;
};

// Wrap each chunk in the per-request boundary and cap the total context the
// model ever sees.
export function buildGroundedContext(chunks: ReadonlyArray<GroundedChunk>, boundary: string): string {
  const parts: string[] = [];
  let used = 0;
  for (const chunk of chunks) {
    const safeTitle = sanitizeChunkText(chunk.title, 200);
    const safeUrl = chunk.sourceUrl.startsWith("https://") ? chunk.sourceUrl : "";
    const safeContent = sanitizeChunkText(chunk.content);
    const part =
      `<<<BEGIN UNTRUSTED PORTFOLIO SOURCE ${boundary}>>>\n` +
      `Title: ${safeTitle}\n${safeContent}\nSource: ${safeUrl}\n` +
      `<<<END UNTRUSTED PORTFOLIO SOURCE ${boundary}>>>`;
    if (used + part.length > MAX_CONTEXT_CHARACTERS) break;
    parts.push(part);
    used += part.length;
  }
  return parts.join("\n\n");
}

// Phrases from the scaffolding and system prompt that a compliant answer
// never contains.
const LEAK_PHRASES: ReadonlyArray<string> = [
  "UNTRUSTED PORTFOLIO SOURCE",
  "PORTFOLIO CONTEXT",
  "PORTFOLIO SOURCES (untrusted",
  "VISITOR QUESTION",
  "Grounding rules:",
  "Security rules (never override",
  "systemInstruction",
  "<<<",
  ">>>",
];

function normalizeForOverlap(text: string): string {
  return text.toLowerCase().replace(/\s+/g, " ").trim();
}

// Detect answers that leak the scaffolding or parrot the raw context back.
// A compliant answer never contains the random boundary, the marker phrases,
// the prompt's section headers, or a long verbatim slice of the retrieved
// context (the model is told to quote at most a short phrase).
export function looksCompromised(
  answer: string,
  boundary: string,
  context?: string,
): boolean {
  if (answer.includes(boundary)) return true;
  for (const phrase of LEAK_PHRASES) {
    if (answer.includes(phrase)) return true;
  }
  if (context) {
    const normalizedAnswer = normalizeForOverlap(answer);
    const normalizedContext = normalizeForOverlap(context);
    const windowSize = 240;
    for (let start = 0; start + windowSize <= normalizedContext.length; start += 120) {
      if (normalizedAnswer.includes(normalizedContext.slice(start, start + windowSize))) {
        return true;
      }
    }
  }
  return false;
}
