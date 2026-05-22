# Changesets

This folder is the source of truth for what changes the next release of
`@aromedia/contracts-sdk` includes. It is read by [Changesets](https://github.com/changesets/changesets)
to bump the version and generate the CHANGELOG.

## Adding a changeset

Run from the repo root:

```bash
npm run changeset
```

The CLI will:
1. Ask which package(s) the change affects (there's only one in this repo).
2. Ask whether it's a `patch`, `minor`, or `major` change.
3. Ask for a short summary that will appear in the CHANGELOG.

It then writes a markdown file in this folder (e.g. `quiet-llamas-rest.md`)
which you commit alongside your code change.

## Semver guidance for this SDK

- **patch** (`0.1.0` → `0.1.1`): bug fixes, doc updates, internal refactors
  that don't affect the public API.
- **minor** (`0.1.0` → `0.2.0`): new exports, new optional parameters,
  added contract methods or hooks. Anything that's backward-compatible.
- **major** (`0.1.0` → `1.0.0`): removed or renamed exports, changed
  parameter types, contract address registry layout changes that consumers
  may rely on. Anything that could break existing code.

ABI shape changes coming from a contracts repo upgrade are usually
**minor** when additive and **major** when they change or remove existing
functions/events.

## What happens on merge

When a PR with one or more changeset files merges to `main`, the release
workflow opens (or updates) a "Version Packages" PR that:
- consumes all pending changesets
- bumps the version in `package.json`
- prepends the changes to `CHANGELOG.md`

Merging that PR triggers the publish step.
