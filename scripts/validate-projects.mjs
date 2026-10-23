import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const source = await readFile(new URL("../lib/data/projects.ts", import.meta.url), "utf8");
const ids = [...source.matchAll(/\bid:\s*"([^"]+)"/g)].map((match) => match[1]);

assert.ok(ids.length >= 15, "The registry must include the selected project records.");
assert.equal(new Set(ids).size, ids.length, "Project IDs must be unique.");

for (const field of ["title", "subtitle", "role", "category", "status", "description", "problem", "solution", "contribution", "impact", "architecture", "highlight"]) {
  const count = [...source.matchAll(new RegExp("\\b" + field + ":\\s*\\\"", "g"))].length;
  assert.equal(count, ids.length, "Every project must include the field: " + field);
}

const expectedPublicRepositories = [
  "https://github.com/frpboy/Scrobblix",
  "https://github.com/frpboy/NahThatsFake",
  "https://github.com/frpboy/adblocker-test-lab",
  "https://github.com/frpboy/autoreadme",
  "https://github.com/frpboy/repo-verse",
  "https://github.com/frpboy/ashique-digital",
  "https://github.com/frpboy/Metly",
  "https://github.com/frpboy/Henna-by-Chippy",
  "https://github.com/frpboy/Sanu-Weds-Bijeesh",
  "https://github.com/frpboy/his-birthday",
];

const linkedRepositories = [...source.matchAll(/\bgithub:\s*"([^"]+)"/g)].map((match) => match[1]);
assert.equal(
  [...source.matchAll(/\bgithub:/g)].length,
  linkedRepositories.length,
  "Every GitHub link must use a double-quoted string literal.",
);
assert.equal(
  [...source.matchAll(/\b(?:live|documentation):/g)].length,
  [...source.matchAll(/\b(?:live|documentation):\s*"([^"]+)"/g)].length,
  "Every live and documentation link must use a double-quoted string literal.",
);
for (const expected of expectedPublicRepositories) {
  assert.ok(linkedRepositories.includes(expected), "Expected public source link is missing: " + expected);
}

for (const value of linkedRepositories) {
  const url = new URL(value);
  assert.equal(url.protocol, "https:", "Repository links must use HTTPS.");
  assert.equal(url.hostname, "github.com", "Repository links must point to GitHub.");
  const segments = url.pathname.split("/").filter(Boolean);
  assert.equal(segments.length, 2, "Source links must point to a repository, not a profile: " + value);
  assert.notEqual(segments[1].toLowerCase(), "frpboy", "A profile page is not a repository URL.");
  assert.ok(!value.endsWith(".git"), "Use the browser URL for a repository link.");
}

for (const match of source.matchAll(/\b(?:live|documentation):\s*"([^"]+)"/g)) {
  const url = new URL(match[1]);
  assert.equal(url.protocol, "https:", "External links must use HTTPS.");
  assert.notEqual(url.hostname, "github.com", "Do not label a repository as a live demo or documentation link.");
}

const disallowedPrivateSourceNames = ["truebite", "medireport", "zerpai", "sahakar-accounts", "sahakar-daily-accounts", "sahakar-po", "specly", "reddit-sniper"];
for (const name of disallowedPrivateSourceNames) {
  assert.ok(!linkedRepositories.some((value) => value.toLowerCase().split("/").includes(name)), "Do not publish a source URL for private or unverified repository: " + name);
}

console.log("Project registry checks passed: " + ids.length + " unique records, required fields present, source URLs valid, private source links excluded.");
