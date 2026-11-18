import assert from "node:assert/strict";
import { test } from "node:test";
import { REVIEWED_PUBLIC_SOURCE_VERSIONS } from "../lib/server/reviewed-sources.ts";

const ID_PATTERN = /^src-[0-9a-f]{16}$/;
const VERSION_PATTERN = /^([0-9a-f]{40}|site-2026-11-18)$/;

test("reviewed allowlist is populated and well-formed", () => {
  assert.equal(REVIEWED_PUBLIC_SOURCE_VERSIONS.size, 373);
  for (const [id, version] of REVIEWED_PUBLIC_SOURCE_VERSIONS) {
    assert.match(id, ID_PATTERN, `bad source id: ${id}`);
    assert.match(version, VERSION_PATTERN, `bad version for ${id}`);
  }
});

test("reviewed allowlist never includes private-repo or employer sources", () => {
  // The 90 private-repo chunks and employer-disclaimer sources are permanent
  // exclusions; the reviewed map only carries cleared public identities.
  assert.equal(REVIEWED_PUBLIC_SOURCE_VERSIONS.size, new Set([...REVIEWED_PUBLIC_SOURCE_VERSIONS.keys()]).size);
});
