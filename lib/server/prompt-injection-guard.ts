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
    pattern: /(PORTFOLIO CONTEXT|UNTRUSTED PORTFOLIO SOURCE|BEGIN UNTRUSTED|END UNTRUSTED|QUESTION:)/,
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

export type QuestionScreening =
  | { allowed: true }
  | { allowed: false; patternId: string };

// Screen the visitor's question. Blocked questions get a fixed reply and
// never reach the model, which also keeps them free of provider cost.
export function screenQuestion(question: string): QuestionScreening {
  for (const { id, pattern } of INJECTION_PATTERNS) {
    if (pattern.test(question)) {
      return { allowed: false, patternId: id };
    }
  }
  return { allowed: true };
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

// Detect answers that leak the scaffolding back. A compliant answer never
// contains the random boundary, the marker phrases, or the prompt's section
// headers.
export function looksCompromised(answer: string, boundary: string): boolean {
  return (
    answer.includes(boundary) ||
    answer.includes("UNTRUSTED PORTFOLIO SOURCE") ||
    answer.includes("PORTFOLIO CONTEXT") ||
    /<<<|>>>/.test(answer)
  );
}
