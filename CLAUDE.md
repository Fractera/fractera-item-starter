# Who you are

You are the agent of one element of a Fractera node. This folder is the element: its site, its pages, its data. You work
here only. The element was born from the Fractera item template, and the template gives it one thing above all: **a frame
of routes that does not grow with the number of pages.** Grow the element inside that frame.

> Status (node step 314-2, 2026-09-26): the code follows this tree. `scripts/check-routes.mjs` keeps the list of route
> files closed; the only working page that is more than text (`admin/users`) is a folder of data naming its widget.

## The frame — Next 16.2, and why it is shaped like this

A Next build compiles every route file (`page.tsx`, `route.ts`) as its own entry point, and the build time grows with the
number of those files, not with the number of pages. Measured on this node (step 298): an empty site built in 103 s;
with 300 extra `page.tsx` files, 1252 s; with the same 300 pages served by one dynamic template, 98 s. A site that adds
pages as files ends up building for tens of minutes. So the code of a branch is only its root, and every page below the
root is data.

```
<element>/
├── .claude/
│   ├── skills/*
│   └── hooks/*
├── lib/
│   ├── page-tree.ts
│   ├── branch-page.tsx
│   └── page-widgets.tsx
├── scripts/
│   └── check-routes.mjs
└── app/[lang]/
    ├── layout.tsx
    │
    ├── (publicLayer)/
    │   ├── README.md
    │   ├── page.tsx
    │   ├── _data/ {meta,en,ru}.json
    │   ├── [slug]/
    │   │   ├── page.tsx
    │   │   ├── index.md/route.ts
    │   │   └── README.md
    │   └── _pages/
    │       ├── README.md
    │       ├── privacy/       {meta,en,ru}.json
    │       ├── terms/         {meta,en,ru}.json
    │       ├── cookies/       {meta,en,ru}.json
    │       └── accessibility/ {meta,en,ru}.json
    │
    ├── (protectedLayer)/
    │   ├── layout.tsx
    │   ├── README.md
    │   ├── account/
    │   │   ├── layout.tsx
    │   │   ├── page.tsx
    │   │   ├── _data/ {meta,en,ru}.json
    │   │   ├── [slug]/page.tsx
    │   │   ├── README.md
    │   │   └── _pages/
    │   │       ├── README.md
    │   │       └── user/ · buyer/ · vip-user/ · subscriber-lite/ · subscriber-standard/ · subscriber-max/
    │   ├── staff/
    │   │   ├── layout.tsx · page.tsx · _data/ · [slug]/page.tsx · README.md
    │   │   └── _pages/ manager/ · senior-manager/ · support-manager/ · delivery-manager/ · content-editor/
    │   ├── finance/
    │   │   ├── layout.tsx · page.tsx · _data/ · [slug]/page.tsx · README.md
    │   │   └── _pages/ finance/
    │   └── admin/
    │       ├── layout.tsx · page.tsx · _data/ · [slug]/page.tsx · README.md
    │       └── _pages/ admin/ · users/
    │
    └── (guestLayer)/
        └── guest/
            ├── layout.tsx
            ├── page.tsx
            ├── _data/ {meta,en,ru}.json
            ├── [slug]/page.tsx
            ├── README.md
            └── _pages/README.md
```

`*` — the set is not fixed yet; it is filled as the element grows.

**How to read it.** A branch is a folder with a `layout.tsx` and a `page.tsx` at its root — the only code the branch has.
Its children live in `_pages/<slug>/` as data (`meta.json`, `en.json`, `ru.json`) and are all served by the one `[slug]`
route of the branch. To add a page, add a folder of data. To add a branch, ask the person first: a branch is new code,
and the list of route files is closed — `scripts/check-routes.mjs` fails the build on any route file it does not know.

## Pages: static, drawn on the first visit, fresh every five minutes

- **The build draws only the roots of the branches.** A child is drawn the first time someone opens it, kept on disk and
  served from there; after five minutes the next visit refreshes it. That is why the build time does not depend on how
  many pages the element has.
- **Tell the person when a change becomes visible — every time you change a text.** Pages refresh on a five-minute
  timer (incremental static regeneration): after the timer runs out, the first visit still shows the old page and starts
  the redraw, the next visit shows the new one. So without anything else, a corrected text is visible **at most five
  minutes and one reload later**. Do not leave the person waiting: after a text change run `npm run pages:refresh` — it
  calls the element's `POST /api/revalidate` on this machine, and the next visit shows the change at once. Then say so:
  "the change is live, reload the page". If the command fails, say that the change will appear within five minutes.
  🛑 Never put a secret into an address to refresh pages — a key in a URL leaks into history, logs and `Referer`, and a
  static page that reads the address stops being static; `AUTH_SECRET` signs the sessions and never leaves the server.
- **Page text is read at run time.** `_pages/<slug>/<lang>.json` is read by `lib/page-tree.ts` while the site runs, not
  baked into the build: a corrected paragraph shows up within those five minutes without a rebuild. Code changes still
  need a rebuild.
- **The site works without the internet.** Once drawn, a page is a file on this machine; nothing on it may depend on a
  remote service to appear. Known gap, named so it is not mistaken for done: design fonts are still linked from
  `fonts.googleapis.com` — offline the page opens with the system font (node step 315 will serve fonts from the node).
- **The five-minute mechanism** (Next 16.2, from its own docs in `node_modules/next/dist/docs`): in the classic mode this
  template uses today, `export const revalidate = 300` with `generateStaticParams` returning `[]` and `dynamicParams`
  left on. Under Cache Components the same is `cacheLife({ revalidate: 300 })` — note that the `'minutes'` preset
  revalidates every **one** minute, not five. Which mode the template settles on is an open decision of the node owner;
  do not switch modes on your own.
- **Every page has text in English and Russian**, in its own data folder: `en.json` is the base and is required,
  `ru.json` overrides it. A language without its file falls back to English — a readable page, never a hole. No visible
  string lives in code.

## Role access

- **Four categories, four protected branches:** `account`, `staff`, `finance`, `admin`. The `layout.tsx` at the root of a
  branch is the lock of the category: it admits the roles of that category (`lib/roles.ts` → `PROTECTED_GROUP_ROLES`).
- **A child narrows it.** Its `meta.json` names the roles that open it; the `[slug]` template of the branch puts the
  second lock on the page with exactly those roles. The page shows who it admits from the same list — one list, two
  readers, so the lock and the text cannot disagree.
- **The architect passes every lock.** `architect` is in every category and every child by default.
- **The guest branch signs a visitor in by itself.** No session → the sign-in service's `/api/auth/guest` creates a user
  with the role `guest` and brings the visitor back; one attempt per tab. Each guest visit is a new record in the
  database: offer it only where it is truly needed.
- **Protected and guest pages are closed to search engines**; only the public branch is indexed.

## Every route carries a README.md

Each route folder and each `_pages/` folder has a `README.md`: what the folder is, the rule of the frame it follows, and a
full example of a page folder (`meta.json`, `en.json`, `ru.json`). An agent that opens only that README can add a page
correctly without reading the rest of the code.

## Every block has an address

Each block in page data carries a permanent `bid` (a letter and four base36 characters, the same in every language):
`scripts/check-block-ids.mjs` fails the build on a missing or repeated one, `npm run blocks:ids` fills the missing. The
branch page wraps itself in `data-page` / `data-file`, and `page-body` (from the Blocks element) gives each block
`data-block` / `data-kind`. The architect turns on **Highlight** in the core's Preview: a frame over the hovered block,
«Copy address» gives «page · file · block» — the exact paragraph to edit. Visitors never see it: the island
(`components/block-highlight/`) wakes only on a message from the node's own origin. When the person brings such an
address, open that file and find that `bid`.

## Finding a page someone talks about

People name pages by their words, not by their addresses. Search the data: `_pages/**/<lang>.json` for the words the
person used; the folder that matches is the page. There is no hand-written list of pages — it would drift from the
folders on the first new page. A machine map for outside agents, if ever needed, is generated from `lib/page-tree.ts`.

<!-- The rest of this instruction is written in the next parts of node step 314. -->
