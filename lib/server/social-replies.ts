// Social fast path for the public portfolio assistant.
//
// A greeting, thank-you, or quick acknowledgement is not an unsupported
// factual query, so it must never reach the "public sources do not cover
// that" fallback. These inputs get a short canned welcome instead.
//
// Safety properties:
//   - Whole-message match only: a real question that merely starts with
//     "hi" ("hi what does Rahul build") never matches; it proceeds to
//     normal retrieval and grounding.
//   - The reply is fully canned text chosen by category. Visitor text is
//     never echoed into the reply, never sent to a model, and never used
//     to pick dynamic content, so this path adds no injection surface.
//   - It runs before rate limiting, retrieval, and provider calls, so
//     social chatter costs nothing and stays available even while the
//     knowledge base is being re-reviewed.

export const SOCIAL_GREETING_REPLY =
  "Hey there! Great to see you. I'm Rahul's portfolio assistant - " +
  "ask me anything about his projects, skills, or experience.";

export const SOCIAL_THANKS_REPLY =
  "You're welcome! Happy to help - feel free to ask anything else " +
  "about Rahul's projects or experience.";

export const SOCIAL_FAREWELL_REPLY =
  "Goodbye! Thanks for stopping by - come back anytime you want to " +
  "explore Rahul's work.";

export const SOCIAL_HOW_ARE_YOU_REPLY =
  "Doing well, thanks for asking! I'm here to help you explore Rahul's " +
  "projects, skills, and experience.";

export const SOCIAL_IDENTITY_REPLY =
  "I'm the portfolio assistant on Rahul Muraleedharan's site. I answer " +
  "questions about his published projects, skills, and experience, " +
  "grounded in his public portfolio sources. What would you like to know?";

export const SOCIAL_ACK_REPLY =
  "Glad you're here! If you have any questions about Rahul's projects " +
  "or experience, just ask.";

const ADDRESSEE = "(?:there|rahul|frpboy|bro|dude|man|mate|buddy|sir|everyone|all|team|assistant|portfolio)";

const GREETING_RE = new RegExp(
  `^(?:hi+|hy+|hey+|hello+|yo+|hiya|hai+|howdy|hola|sup|wassup|whats up|whatsup|` +
    `namaste|namaskaram|vanakkam|greetings|good (?:morning|afternoon|evening|day))` +
    `(?: ${ADDRESSEE}){0,3}$`,
);

const THANKS_RE = new RegExp(
  `^(?:thanks|thank ?you|thx|ty|tysm|much appreciated|appreciate it)` +
    `(?: (?:so much|a lot|very much|for (?:the )?info|${ADDRESSEE})){0,2}$`,
);

const FAREWELL_RE = new RegExp(
  `^(?:bye+|good ?bye|good ?night|see (?:you|ya)(?: later)?|later|gtg|got to go|` +
    `take care|ciao|adios|catch you later)(?: ${ADDRESSEE}){0,2}$`,
);

const HOW_ARE_YOU_RE =
  /^(?:how are (?:you|u)|how r u|hru|hows it going|how is it going|how are things|hows things|how do you do)$/;

const IDENTITY_RE = new RegExp(
  `^(?:who are (?:you|u)|what are (?:you|u)|what is this|whats this|` +
    `what can you do|what do you do|help|what can i ask|what should i ask|` +
    `how can you help(?: me)?|introduce yourself|(?:whats|what is) your name|your name)$`,
);

const ACK_RE = new RegExp(
  `^(?:ok|okay|k+|cool|nice|great|awesome|amazing|wow|got it|alright|noted|lol|haha|hehe)` +
    `(?: ${ADDRESSEE}){0,2}$`,
);

const MAX_SOCIAL_LENGTH = 40;

// Returns the canned reply for a purely social message, or null when the
// message is (or could be) a real question that must go through retrieval.
export function getSocialReply(question: string): string | null {
  const normalized = question
    .toLowerCase()
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9 ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!normalized || normalized.length > MAX_SOCIAL_LENGTH) return null;

  if (HOW_ARE_YOU_RE.test(normalized)) return SOCIAL_HOW_ARE_YOU_REPLY;
  if (GREETING_RE.test(normalized)) return SOCIAL_GREETING_REPLY;
  if (THANKS_RE.test(normalized)) return SOCIAL_THANKS_REPLY;
  if (FAREWELL_RE.test(normalized)) return SOCIAL_FAREWELL_REPLY;
  if (IDENTITY_RE.test(normalized)) return SOCIAL_IDENTITY_REPLY;
  if (ACK_RE.test(normalized)) return SOCIAL_ACK_REPLY;
  return null;
}
