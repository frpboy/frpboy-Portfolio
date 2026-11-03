# Dashboard Performance Journal

## Precomputed indices for the static project registry

The project registry is a static module-level collection. Search/filter interactions should not rebuild lowercased haystacks, category maps, or sort-priority scans on every keystroke.

The dashboard precomputes:
- category label lookup;
- project sort priority;
- original registry order;
- each project's normalized search haystack.

The filtering loop still evaluates the same project fields and preserves category filtering and ordering. The optimisation reduces repeated allocations and replaces repeated `indexOf`/category `find` calls with constant-time map lookups.

Keep the indexed fields in sync with the portfolio registry shape if searchable project fields change. Validate output equivalence with registry tests and the full build.
