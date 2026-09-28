# Who you are

You are the agent of one element of a Fractera node. This folder is the element: its site, its pages, its data. You work
here only. The element was born from the Fractera item template, and the template gives it one thing above all: **a frame
of routes that does not grow with the number of pages.** Grow the element inside that frame.

> Status (node step 314-2, 2026-09-26): the code follows this tree. `scripts/check-routes.mjs` keeps the list of route
> files closed; the only working page that is more than text (`admin/users`) is a folder of data naming its widget.


## 🛑 Multi-agent development is forbidden — all development is sequential (owner, 2026-09-28)

The owner, verbatim: «a categorical ban on multi-agent development … all development is sequential only». One agent, one
task at a time, step by step: no sub-agents, no parallel agents, no agent teams, no background agents splitting the work.
Long work is a sequence of steps with its state written down, never a fan-out. This holds for every agent of the project —
the core, the element template and every element.

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
    │       └── _pages/ admin/ · users/ · site-settings/
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
  remote service to appear. Design fonts included (node step 315): `scripts/local-fonts.mjs` copies the `@fontsource*`
  files listed in `lib/design/local-fonts.json` into `public/fonts/` before every build, and `lib/design-css.ts` links
  `/fonts/<slug>.css` by family name. A new catalogue font = a row in that table + its npm package; the script fails the
  build if a catalogue family has no files.
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
- **The guest branch signs a visitor in by itself.** No session → the site's own `/guest-in`, and the proxy sends it where a
  guest is made (the node's sign-in centre on an own domain, the sign-in service's `/api/auth/guest` elsewhere, node step
  331): a user with the role `guest` is created and the visitor comes back; one attempt per tab. Each guest visit is a new record in the
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
«Copy address» gives «page · file · block · link» — the exact paragraph to edit. Visitors never see it: the island
(`components/block-highlight/`) wakes only on a message from the node's own origin. When the person brings such an
address, open that file and find that `bid`.

**The way back (node step 318): when you finish editing a block, end your answer with its link**
`/<lang>/<path>#block=<bid>` — the `Link` line of the address you got, or built from the page path and the `bid` — and
tell the person: "Open Preview, paste the link into «Find block» and press Find". The Preview opens that page, scrolls to
the block and frames it for 3 seconds. One link per edited block; no host, no port. How to build the path — skill
`use-page-tree`.

## Finding a page someone talks about

People name pages by their words, not by their addresses. Search the data: `_pages/**/<lang>.json` for the words the
person used; the folder that matches is the page. There is no hand-written list of pages — it would drift from the
folders on the first new page. A machine map for outside agents, if ever needed, is generated from `lib/page-tree.ts`.

<!-- The rest of this instruction is written in the next parts of node step 314. -->

## Your address and your links to the node (node step 324)

- **Your main address is given by the node, not by settings.** When the owner connects an own domain to this element and
  picks the main address (subdomain or domain), the node writes `SERVICE_DATA_DIR/domain.json`; `lib/own-site.ts` makes
  `getAppConfig().url` (and `seo.canonicalBase`) that address — canonical, sitemap, hreflang and og follow it. Never
  write the address into APP-CONFIG yourself: the project settings and the node would overwrite it.
- **Links to CONFIG and Design can be off** (`SERVICE_DATA_DIR/links.json`, `linkOn()`): off, the project settings are not
  laid over this element's own `APP-CONFIG` / `PLATFORM-CONFIG` / `DESIGN-CONFIG`, and the design is not pulled. With the
  CONFIG link off, the architect edits the site's name, texts, SEO, images and languages on the page
  `/<lang>/admin/site-settings` (`components/site-settings/`, door `/api/settings/app`); with it on, that door answers 409.
  The Blocks link off removes the `@fractera` registry from `components.json` — write your own blocks then.
- **Languages are built in.** A new language set chosen on that page reaches the site after a rebuild of the element
  (the owner: core → the element → Deployments). Until then the site keeps its current languages — say so.
- **The node's core is the one outside origin this element trusts** (`/api/core-origin`): the Preview highlight works on
  any main address. Do not widen `lib/sibling-origin.ts` or the highlight island beyond it.
- **Sign-in on the element's own domain goes through the node's sign-in centre** (node step 328). The node's sign-in
  cookie does not live on another domain, so «Sign in» there leads to `<node auth>/api/auth/sso`, the centre sends a
  one-time code back to `/api/auth/callback`, and the element keeps a ticket cookie (`fractera-ticket`) that
  `lib/auth/ticket.ts` checks with the centre on every request. Signing out in the centre ends it on every domain.
  Never set or read the node's own session cookie here, and never widen `next` of the callback beyond a local path.

## Describing this element to the node (node steps 325-2, 329)

The element has two descriptions that must agree: its own passport `OWN-SERVICE-PROPS.json` (`summary` — 2-3 plain
sentences on what it does and for whom; `provides` — 1-20 capability names like `order-form`) and its record in the
node's common registry in the core. When the owner sends the task «Describe this AGI element…» (the core's «Generate»):
write the two passport fields, commit that one file, then run **`npm run describe:publish`** — it hands the passport to the
core over the machine's loopback (the core's port is asked from the node, never remembered), and the core checks the
shape and writes the registry record. `DESCRIBE_FAILED` names what to fix; fix it and run again. A future skill
`describe-element` will carry this procedure; while it does not exist, the task text is the procedure.
