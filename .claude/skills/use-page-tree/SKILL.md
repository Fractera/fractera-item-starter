---
name: use-page-tree
description: >
  How a page is added to this Fractera element — as a FOLDER OF DATA under a branch, read by the one child route of
  that branch, never as a new `page.tsx`. Load it before creating anything under `app/`, whenever the person asks for
  "a new page", "a section", "an article", "a page for the role X", "the same page in Russian", when a text on a page
  must be corrected, and whenever a build is slow and you are about to look for the cause. The thing you cannot guess:
  Next compiles every route file on its own, so a site that grows one `page.tsx` per page builds slower with every page —
  measured on this node as 1252 s for 300 page files against 98 s for the same 300 pages through one template. The
  build succeeds either way; nothing warns you until the person waits an hour.
---

# use-page-tree

> Informational, not binding: know a better way for the case in front of you — do it your way and say so. The one thing
> that is not optional: a new page never arrives as a new route file.

## The rule

**A page is a folder of data. A branch has code only at its root.** Each branch is `layout.tsx` + `page.tsx` (its root)
and one `[slug]/page.tsx` (all its children). A child lives in `<branch>/_pages/<slug>/`. `scripts/check-routes.mjs`
runs first in `npm run build` and fails on any route file outside its closed list.

## Why — measured, not believed (node step 298, Next 16.2)

| built | total |
|---|---|
| a site of 40 pages | 103 s |
| + 100 pages as separate `page.tsx` | 183 s |
| + 300 pages as separate `page.tsx` | **1252 s** |
| + the same 300 pages through one template | **98 s** |

A production build is always the whole app; the only lever is how many route files the app has.

## Where things are

| What | Where |
|---|---|
| branches | `app/[lang]/(publicLayer)` · `(protectedLayer)/{account,staff,finance,admin}` · `(guestLayer)/guest` |
| reading the tree | `lib/page-tree.ts` — `branchRoot`, `branchChild`, `branchChildren`, `wordsIn` |
| building a root and a child | `lib/branch-page.tsx` — `rootPage`, `childRoute` |
| working widgets of a page | `lib/page-widgets.tsx` |
| block kinds a page may use | `lib/content/blocks/types.ts` + the set in `lib/content/blocks/registry.tsx` |
| the guard | `scripts/check-routes.mjs` |

## Adding a page — files of data, no code

```
<branch>/_pages/<slug>/meta.json   { "order": 30, "roles": ["buyer"] }
<branch>/_pages/<slug>/en.json     { "title": "…", "description": "…", "keywords": "", "blocks": [ { "kind": "p", "text": "…" } ] }
<branch>/_pages/<slug>/ru.json     { "title": "…", "description": "…", "blocks": [ … ] }
```

- The address is the branch plus the folder: `/<lang>/account/<slug>`; for the public branch `/<lang>/<slug>`.
- `en.json` is required; every other language overrides it. A language without its file shows English.
- `roles` (protected branches) puts a second lock on the page on top of the branch lock; the architect always passes.
  `{roles}` inside a paragraph prints the same list the lock uses.
- `widget` names a working part from `lib/page-widgets.tsx` (a table, a form); the page stays a folder of data.
- `blocks` are kinds of the block set. A kind the set does not have → take it from the Blocks element
  (`npx shadcn add @fractera/<name>`, the address in `BLOCKS_REGISTRY_URL`), add one line to the set and to `types.ts`.
- There is no list of pages anywhere: the folder is the page — in the sitemap and in the map for agents it appears by
  itself. Delete the folder and it is gone everywhere.

## Drawn on the first visit, fresh every five minutes

The build draws only the roots of the branches. A child's `generateStaticParams` returns `[]`: it is drawn on its first
visit, kept on disk, and refreshed by the next visit after five minutes (`revalidate = 300`, classic mode — do not switch
to Cache Components on your own). Texts are read at run time from the element folder (`ELEMENT_DIR`), so a corrected
paragraph appears within those five minutes without a rebuild; code changes need a rebuild.

**After every text change run `npm run pages:refresh`** (`scripts/refresh-pages.mjs` → `POST /api/revalidate` on this
machine, key in the header, never in the address): the next visit shows the change at once. Tell the person: "the change
is live, reload the page" — or, if the command failed, "it will appear within five minutes".

## Correcting a page someone talks about

People name pages by their words. Search `app/**/_pages/**/<lang>.json` for those words; the matching folder is the
page. Fix the paragraph in that language, then check the other languages for the same mistake.

## Every block has an address — and you answer with its link

Every block in `<lang>.json` carries a `bid` (a letter and four base36 characters, the same in every language). The person
may bring an address copied in the core's Preview («Click to update» → the core's task window):

```
Page: /ru/privacy
File: app/[lang]/(publicLayer)/_pages/privacy/ru.json
Block: kns6w (p)
Link: /ru/privacy#block=kns6w
```

Open that file, find that `bid`, edit that block and nothing else.

**When you finish editing a block, end your answer with the block's link** and one sentence for the person: "Open
Preview, paste the link into «Find block» and press Find — the page scrolls to the block and frames it for 3 seconds."

- The link is `/<lang>/<path>#block=<bid>`. Take the `Link` line of the address you were given. If you found the block
  yourself, build it: public root `/<lang>`, public page `/<lang>/<slug>`, protected branch `/<lang>/<branch>` and its
  page `/<lang>/<branch>/<slug>`, guest `/<lang>/guest/<slug>`; the `bid` is in the JSON.
- `<lang>` is the language file you edited. Edited several blocks — one link per block.
- No host and no port: the node's port changes and the Preview adds its own element's address.
- A new block has no `bid` yet: run `npm run blocks:ids` first, then give its link.

## The real exception

A new branch (a new root) is new code and a decision of the person: ask first, then add its files to `ALLOWED` in
`scripts/check-routes.mjs` with the reason. A behaviour that more than one page needs becomes a widget or a block kind,
and the pages stay data.

## Proof this rule is guarded

Add `app/[lang]/(publicLayer)/x/page.tsx` → `npm run build` stops with `===ROUTES_FAILED===`; remove it →
`===ROUTES_OK===`.
