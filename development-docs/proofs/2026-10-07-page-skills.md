# Proof 2026-10-07 — the page skills work in a live agent

The method of `2026-10-06-wake-and-a2a-skills.md`, step 4 the judge: what the agent **ran**, read from its session transcript
(`~/.claude/projects/<roman folder>/<session>.jsonl`), not what it said. Questions 2–8 and every task were put into the live
terminal through the core's door `POST /api/agents/wake` (the person's permission: «if you can ask self»); question 1 and the
first wake came from the person in Telegram. Test work was reverted afterwards (owner: «Откатить»).

## Round 1 — understanding (session `c8240cc9`)

| # | Question (short) | Answer | Skill loaded |
|---|---|---|---|
| 1 | goals of the pages, computer off | right, more precise than the key | `telegram-channel` (answer from CLAUDE.md «Page») |
| 2 | what a page is made of | right; named the guard wrong | — |
| 3 | a docs page: blocks or what | right (`text-*`, no `text-h1`) | — |
| 4 | an orders table with filters | right, complete | **`build-widget`** |
| 5 | voice on a page, where tools live | right | — |
| 6 | an own fancy button | right; invented `asChild` | — |
| 7 | the Preview address and the answer | right, complete | **`use-highlight`** |
| 8 | delete a branch | right; found the tails (ALLOWED, A2A card) | — |

## Round 2 — building

| Task | Skills, in order | Result |
|---|---|---|
| a — docs page en/ru | `use-page-tree`, `use-typography` first | data only, same sequence and `bid` in en/ru, prebuild, live 200 + 404 control, `#block=` links |
| b — a static widget | none (read code) | widget right (`Card`, i18n, branch list, address), **live page 500** until rebuild |
| c — voice in a widget | `use-tools` | dynamic widget over `tool-voice-input`, built a Preview itself; no `#block=` for the form |
| d — trap: tool in page data + raw red button | — (knew the laws) | refused, changed nothing, named both guards, offered `Button variant="destructive"` |
| e — control after fixes, fresh session `7fd20ac8` | **`build-widget` first** | shadcn `Alert` widget, links `#block=` for the page item and the container; full prebuild green (checked by me) |

## Fixes made between runs

- Telegram: the first message of a wake vanished (paste before Claude Code took input) — the first task now goes as the `claude`
  launch argument; the wake by Telegram starts with «know yourself» (core `8e38ae9`); skill `telegram-channel` (`4e646d6`).
- `page-body`: an unknown kind fails loudly only in the build; the running site skips it with a log line (`b26d27b`) — proven by a
  spoil: 200, `[page-body] … skipped` in `svc-mzjce-err.log`.
- CLAUDE.md «Page»: load the skill of the work before building; `use-shadcn`: no `asChild`; `use-highlight`/`build-widget`: a new
  widget ends with its `#block=` link (`04e53fa`) — task e showed both.

## What this proves

| Mark | Status |
|---|---|
| CLAUDE.md PROOF 5 «Page» | PROVEN — five building tasks followed the laws (sequence, data not route files, shadcn only, tools inside widgets, addresses) |
| `use-page-tree`, `use-typography` | PROVEN (task a) |
| `build-widget` | PROVEN (question 4, task e) |
| `use-tools` | PROVEN (task c) |
| `use-highlight` | PROVEN (question 7, tasks a and e) |
| `use-shadcn` | PARTIAL — the law kept in b, c, d, e; the skill itself never loaded |
| `telegram-channel` | PROVEN (question 1: loaded, answered with `reply`) |

Not proven: voice and toast in a browser (a person's microphone); the reverse link in the core's Preview clicked live.
