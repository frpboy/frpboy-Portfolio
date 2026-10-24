import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const source = await readFile(new URL("lib/data/projects.ts", root), "utf8");
const dashboard = await readFile(new URL("components/os/Dashboard.tsx", root), "utf8");
const projectCard = await readFile(new URL("components/os/ProjectModule.tsx", root), "utf8");
const projectWindow = await readFile(new URL("components/os/ProjectWindow.tsx", root), "utf8");

const ids = [...source.matchAll(/^\s+id:\s*"([^"]+)"/gm)].map((match) => match[1]);
assert.ok(ids.length >= 19, "The registry must include the selected public projects.");
assert.equal(new Set(ids).size, ids.length, "Project IDs must be unique.");

const requiredFields = [
  "title", "subtitle", "role", "category", "status", "description",
  "problem", "solution", "contribution", "impact", "architecture", "highlight",
];
for (const field of requiredFields) {
  const count = [...source.matchAll(new RegExp("\\b" + field + ":\\s*\\\"", "g"))].length;
  assert.equal(count, ids.length, "Every project must include the field: " + field);
}

const allowedCategories = new Set(["independent", "tool", "client", "creative"]);
const categories = [...source.matchAll(/^\s+category:\s*"([^"]+)"/gm)].map((match) => match[1]);
assert.equal(categories.length, ids.length, "Every project must have exactly one primary category.");
for (const category of categories) {
  assert.ok(allowedCategories.has(category), "Unexpected project category: " + category);
}
for (const category of allowedCategories) {
  assert.ok(categories.includes(category), "The registry should represent the " + category + " category.");
}

const allowedStatuses = new Set([
  "Active development", "Pre-release", "Prototype", "Live deployment",
  "Public source available", "Legacy experience", "Not verified",
]);
const statuses = [...source.matchAll(/^\s+status:\s*"([^"]+)"/gm)].map((match) => match[1]);
assert.equal(statuses.length, ids.length, "Every project must have one status.");
for (const status of statuses) {
  assert.ok(allowedStatuses.has(status), "Unexpected project status: " + status);
}

// Static allowlist: only these exact public source repositories are eligible to appear.
// This avoids live-network checks in the build and avoids publishing a blacklist of private repo names.
const approvedPublicSources = new Set([
  "https://github.com/frpboy/Scrobblix",
  "https://github.com/frpboy/NahThatsFake",
  "https://github.com/frpboy/adblocker-test-lab",
  "https://github.com/frpboy/autoreadme",
  "https://github.com/frpboy/repo-verse",
  "https://github.com/frpboy/ashique-digital",
  "https://github.com/frpboy/Metly",
  "https://github.com/frpboy/Henna-by-Chippy",
  "https://github.com/frpboy/frpboy-Portfolio",
  "https://github.com/frpboy/Threadly",
  "https://github.com/frpboy/Status-Page",
  "https://github.com/frpboy/deploy-raganork",
  "https://github.com/frpboy/lean-ctx",
  "https://github.com/frpboy/neat",
  "https://github.com/frpboy/react",
  "https://github.com/frpboy/commonslens.github.io",
  "https://github.com/frpboy/fly-log",
]);
// Support both TypeScript property forms: github: "..." and "github": "...".
const linkObjects = [...source.matchAll(/\blinks\s*:\s*\{([^}]*)\}/g)].map((match) => match[1]);
const linkedSources = linkObjects.flatMap((links) =>
  [...links.matchAll(/(?:["']?github["']?)\s*:\s*["']([^"']+)["']/g)].map((match) => match[1]),
);
const githubPropertyCount = linkObjects.reduce(
  (total, links) => total + [...links.matchAll(/(?:["']?github["']?)\s*:/g)].length,
  0,
);
assert.equal(
  githubPropertyCount,
  linkedSources.length,
  "Every GitHub source link must be a literal quoted URL, including quoted or unquoted property keys.",
);
assert.equal(new Set(linkedSources).size, linkedSources.length, "A repository may appear only once in the public catalog.");
for (const url of linkedSources) {
  assert.ok(approvedPublicSources.has(url), "Source URL is not approved for public display: " + url);
  const parsed = new URL(url);
  assert.equal(parsed.protocol, "https:", "Source links must use HTTPS.");
  assert.equal(parsed.hostname, "github.com", "Source links must point to GitHub.");
  const segments = parsed.pathname.split("/").filter(Boolean);
  assert.equal(segments.length, 2, "Source links must point directly to a repository: " + url);
  assert.ok(!url.endsWith(".git"), "Use a browser URL for source links.");
}
for (const expected of approvedPublicSources) {
  assert.ok(linkedSources.includes(expected), "Approved public source is missing from the catalog: " + expected);
}

// Production/live destinations and pull-request references are explicit and separately labelled.
const liveLinks = [];
const liveLabels = [];
for (const links of linkObjects) {
  const liveValues = [...links.matchAll(/(?:["']?live["']?)\s*:\s*["']([^"']+)["']/g)].map((match) => match[1]);
  const labels = [...links.matchAll(/(?:["']?liveLabel["']?)\s*:\s*["'](Live website|Open app|Live demo)["']/g)].map((match) => match[1]);
  const livePropertyCount = [...links.matchAll(/(?:["']?live["']?)\s*:/g)].length;
  const labelPropertyCount = [...links.matchAll(/(?:["']?liveLabel["']?)\s*:/g)].length;
  assert.equal(livePropertyCount, liveValues.length, "Every live destination must be a literal URL.");
  assert.equal(labelPropertyCount, labels.length, "Every live-link label must use an approved literal label.");
  assert.equal(liveValues.length, labels.length, "Each project must label its own live destination.");
  liveLinks.push(...liveValues);
  liveLabels.push(...labels);
}
for (const value of liveLinks) {
  const url = new URL(value);
  assert.equal(url.protocol, "https:", "Live destinations must use HTTPS.");
  assert.notEqual(url.hostname, "github.com", "A source repository must not be labelled as a live destination.");
  assert.ok(!/example\.(com|org|net)$|localhost|127\.0\.0\.1/i.test(url.hostname), "Placeholder and local URLs are not permitted: " + value);
}

// Exact production destinations from the deployment audit. Update this map only after
// confirming the domain belongs to the project and the current production deployment.
const approvedLiveDestinations = new Map([
  ["adblocker-test-lab", "https://lab.frpboy.in/"],
  ["reddit-sniper", "https://reddit-sniper.online/"],
  ["ashique-digital", "https://www.ashique.digital/"],
  ["portfolio-os", "https://www.frpboy.in/"],
  ["henna-by-chippy", "https://henna-by-chippy.vercel.app/"],
  ["threadly", "https://threadly-ruddy.vercel.app/"],
  ["nah-thats-fake", "https://nahthatsfake.vercel.app/"],
]);
const projectLiveDestinations = source.split(/\n  \{\n    id: /).slice(1).map((entry) => {
  const id = entry.match(/^"([^"]+)"/)?.[1];
  const closingIndex = entry.indexOf("\n  },");
  const block = closingIndex >= 0 ? entry.slice(0, closingIndex) : entry;
  const links = block.match(/\blinks\s*:\s*\{([^}]*)\}/)?.[1] ?? "";
  const live = links.match(/(?:["']?live["']?)\s*:\s*["']([^"']+)["']/)?.[1] ?? null;
  return [id, live];
});
assert.equal(projectLiveDestinations.length, ids.length, "Every registry record must be checked for a live destination.");
const liveDestinationByProject = new Map(projectLiveDestinations);
for (const [id, expectedUrl] of approvedLiveDestinations) {
  assert.equal(liveDestinationByProject.get(id), expectedUrl, "Canonical live destination mismatch for project: " + id);
}
for (const [id, url] of liveDestinationByProject) {
  if (url !== null) {
    assert.equal(approvedLiveDestinations.get(id), url, "Unapproved or misplaced live destination for project: " + id);
  }
}
assert.equal(new Set(liveLinks).size, liveLinks.length, "A live destination may appear on only one project record.");
assert.equal(liveLinks.length, approvedLiveDestinations.size, "Every approved live destination must appear exactly once.");

const approvedPullRequests = new Set([
  "https://github.com/neatbrowser/neat/pull/10",
  "https://github.com/react/react/pull/37974",
  "https://github.com/commonslens/commonslens.github.io/pull/1",
  "https://github.com/FedericoTartarini/fly-log/pull/88",
]);
const pullRequests = linkObjects.flatMap((links) =>
  [...links.matchAll(/(?:["']?pullRequest["']?)\s*:\s*["']([^"']+)["']/g)].map((match) => match[1]),
);
const pullRequestPropertyCount = linkObjects.reduce(
  (total, links) => total + [...links.matchAll(/(?:["']?pullRequest["']?)\s*:/g)].length,
  0,
);
assert.equal(
  pullRequestPropertyCount,
  pullRequests.length,
  "Every upstream contribution URL must be a literal quoted URL, including quoted or unquoted property keys.",
);
for (const value of pullRequests) {
  const url = new URL(value);
  assert.equal(url.protocol, "https:", "Upstream contribution links must use HTTPS.");
  assert.equal(url.hostname, "github.com", "Upstream contribution links must point to GitHub.");
  assert.ok(/^\/[^/]+\/[^/]+\/pull\/\d+$/.test(url.pathname), "Contribution link must point to a pull request: " + value);
  assert.ok(approvedPullRequests.has(value), "Unexpected upstream contribution URL: " + value);
}

// Keep the visible labels and both link surfaces consistent.
for (const label of ["All Work", "Independent", "Tools", "Client Work", "Creative"]) {
  assert.ok(dashboard.includes('label: "' + label + '"'), "Missing category filter label: " + label);
}
assert.ok(projectCard.includes("project.links?.pullRequest"), "Project cards must display upstream contribution links.");
assert.ok(projectWindow.includes("project.links?.pullRequest"), "Project details must display upstream contribution links.");
assert.ok(projectCard.includes('rel="noopener noreferrer"'), "Card external links must use safe external-link attributes.");
assert.ok(projectWindow.includes('rel="noopener noreferrer"'), "Detail external links must use safe external-link attributes.");
assert.ok(projectCard.includes("project.links.liveLabel || \"Live website\""), "Card live-link labels must have a safe fallback.");
assert.ok(projectWindow.includes('project.links.liveLabel || "Live website"'), "Detail live-link labels must have a safe fallback.");

console.log(
  "Project registry checks passed: " +
    ids.length +
    " unique records; all categories/statuses valid; " +
    linkedSources.length +
    " approved public sources; " +
    liveLinks.length +
    " labelled live destinations; " +
    pullRequests.length +
    " verified contribution references; no unapproved source links.",
);
