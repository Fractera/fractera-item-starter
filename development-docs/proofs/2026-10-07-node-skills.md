# Proof 2026-10-07 — the node skills in a live agent

The method of `2026-10-06-wake-and-a2a-skills.md`: what the agent **ran**, read from its session transcript
(`~/.claude/projects/<roman folder>/<session>.jsonl`), not what it said. Every question and task was put into the live terminal
through the core's door `POST /api/agents/wake` after the person's «Включить» in Telegram; the judge checked each claim against
the code and the live site. All building work was reverted afterwards (person: «Откати и отправь откат»).

## Round 1 — understanding (sessions `bdafd854`, `2804ff95`)

| # | Question (short) | Skill loaded | Answer |
|---|---|---|---|
| 1 | lid closed for the night | **`computer-off`** | right (copy only on an own domain, sign-in and data wait, bot silent, A2A error) — the first run left the answer in thinking → fix `5948b6c` |
| 2 | print the address on business cards | — | right, from `computer-off` and «Where you live»; `temporary-domain` not needed |
| 3 | only agents, no site | **`local-node`** | right; `serve:unpublish` / `serve:publish` exist |
| 4 | copy the folder to a friend | **`project-origin`** | right; «Update» placed on github.com → fix `a6608ec` |
| 5 | where on GitHub, rename | — | right, measured the node state; the rules come from the core's `CLAUDE.md` above the folder |
| 6 | open ten languages to search | **`use-languages`** | right: changed nothing, named the risk, the person's strategy, asked |
| 7 | a page only for buyers | **`use-auth`** | roles right; said a stranger check is impossible here → fixes `6f57ea6`, `073c46e` (a page lock is signage, a door is the lock) |

## Round 2 — building (sessions `d359dd80`, `d0a1979f`, `5c888c92`, `e404a7f8`)

| Task | Skills, in order | Result |
|---|---|---|
| «My orders» empty state | `use-page-tree`, `build-widget` | built well, prebuild + spoil; promised data only and wrote code; `pages:refresh` put data live before the code → fixes `1f69a93` |
| the buyer's orders door | `build-widget`, **`use-auth`** | by the plan; stranger check by the fixed skill (public address 401 / owner 200 after the build); spoil of `check-routes`; answer before `done` |
| FAQ page (three results) | `use-page-tree`, `build-widget` | warned «data live, widget after Deploy»; prebuild 25/25, spoil; `current-step.md` written only at the end, no `use-development-docs` → fix `2dfb466` |
| About page + footer link | **`use-development-docs`** first, `use-page-tree` | step written into `current-step.md` before the first edit, kept on events; plan wrong (footer off) → stopped and asked; link with «Live site» and «Find»; fr debt recorded. No plan in `steps-new/` (called it small), no spoil |

Measured by the judge: `roman.throughsongs.com/api/i18n/translate` → 401, `127.0.0.1` → 400 past the lock; `/ru/account/buyer/orders`
answers the same 200 HTML to a stranger and the owner; `/ru/about#block=hyuvq` present on the public address; `footerPages` false.

## What this proves

| Mark | Status |
|---|---|
| `computer-off`, `local-node`, `use-languages` | PROVEN — loaded by the description, answers right |
| `use-auth` | PROVEN — loaded twice; after the fix the door task planned the stranger check right |
| `project-origin` | PARTIAL — loaded, answer right; the «Update» line changed after the run |
| `use-development-docs` | PARTIAL — loaded first, step kept on events; plan in `steps-new/` not made |
| `use-tests-before-dev-finish`, `use-element-tree` | PARTIAL — the law kept (spoils, tree), the skill never loaded |
| `temporary-domain`, `github-repositories` | not proven — never loaded; the same knowledge came from `CLAUDE.md` of the element and the core |
| `use-site-menu`, `deploy-element`, `github-element`, `cloudflare-connection` | not proven — written or changed after the runs |
