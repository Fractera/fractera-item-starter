# Proof 2026-10-06 — the wake, the detection skills and A2A work as written

Why this file exists — the person, verbatim:
«инструкция будет расти и мы будем её проверять каждую опцию именно так как проверили сейчас… иначе мы будем забывать что и когда доказали»
(the instruction will grow; every part is proven the way it was proven today, and the proof is written down so that nobody
forgets what was proven and when).

## How it was proven (the method to repeat)

1. A real task arrives the way it arrives in life: another element of the node (`gyr1i`) sends roman an A2A task with
   `npm run a2a -- send roman "<question>"` (official A2A SDK client).
2. roman's agent is off; the core asks the person in Telegram; the person presses «Включить и ответить».
3. The answer is read back through the SDK: `npm run a2a -- status roman <taskId>`.
4. What the agent actually did is read from its own session transcript
   (`~/.claude/projects/<roman folder>/<session>.jsonl`): every tool call with its time. Not what the agent says it did —
   what it ran.

A section counts as proven only when step 4 shows the behaviour the section asks for. Reading the instruction is not a proof.

## Runs

| Time (local) | Task | Question | What the transcript shows | Result |
|---|---|---|---|---|
| 21:06 | `1768c4ff-…` | «Where is your current step?» | read `current-step.md`, answered `npm run a2a -- reply`, wrote the order summary; **did not** run the passport | COMPLETED — the wake rule alone was skipped |
| 21:51 | `04b93354-…` | «Who are you, on which port, which elements are next to you?» | **first** `npm run passport` (the wake task now says so); cut it with `head`, then went around it to the core's registry (`curl`, a core file) | COMPLETED — passport first, but the node part was missed |
| 22:02 | `c97dd5b7-…` | the same question | **first** `npm run passport -- me` and `npm run passport -- project`, read whole; `npm run a2a -- reply`; order summary; no `curl`, no core files | COMPLETED — native/custom named right |

Answer of the last run, verbatim: "I am roman (id mzjce), a custom element of the throughsongs.com node: an information desk on a
landing page that answers visitors by text and voice, at https://roman.throughsongs.com. On this machine I run on port 24687
(http://localhost:24687). Next to me: the native elements auth, data, config, design, root (throughsongs.com) and blocks, plus the
custom element gyr1i — you."

Fixes made between the runs: the wake task starts with «know yourself and the node» (commit `ccbb19d`); short passport modes
`-- me` / `-- project` and the skills, the wake rule and the wake task use them (`516ef18`).

## What this proves in CLAUDE.md

| Mark | Section | Status | What exactly |
|---|---|---|---|
| PROOF 1 | «On wake — know yourself and the node» | proven | the agent runs `passport -- me` and `-- project` first and uses them instead of the core's files |
| PROOF 2 | «Two natures» | partial | the **worker** path: an A2A task is done and answered with `reply`, an order summary is written. Not proven: the **builder** path, «unsure — ask», «describe or build?» |
| PROOF 3 | «Skills by nature» | partial | every-element skills proven live: `own-service-props-detection`, `node-elements-detection`, `a2a-conversation`, `order-summary`. Not proven: every builder skill, `passport-description` |

Not proven at all yet: the tree (routes, pages), every builder skill.

## Commits at the time of the proof

roman `516ef18` (passport modes, skills, wake rule, wake task) · `ccbb19d` · `e09f1d7` (skill a2a-conversation) · `15f4196` (A2A on
the SDK) · core `f1832a6`.
