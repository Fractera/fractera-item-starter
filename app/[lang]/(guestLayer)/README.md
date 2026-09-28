# `(guestLayer)` — the guest branch

Not a route of its own: a route group. Inside — one branch, `guest/` (`/<lang>/guest`), for visitors who must be someone
in the database without signing in: a visitor who opens it becomes a guest automatically (owner's word, node step 314-2:
«users who came to this page were automatically registered under a guest account»).

## When to use it

- The page needs a person, not a session-less visitor: saving a cart, a draft, a vote, progress — before any sign-in.
- The page is **not for search**: the branch is closed with `robots: noindex` (every visitor has their own session).
- Not for pages every visitor may read → `(publicLayer)`. Not for pages behind a role → `(protectedLayer)`.

## How the lock works

`guest/layout.tsx` wraps the branch in `_components/guest-gate.client.tsx`. In the browser it asks `/api/me`:

- session exists → the page is shown;
- no session → the browser goes to `<sign-in service>/api/auth/guest?redirectUrl=<this page>`; the service creates a user with
  the role `guest`, sets the session and returns here;
- back here and still no session → the page says so (`gate.failed`) and **does not go again**: one attempt per tab
  (`sessionStorage` mark `guest-login-tried`), otherwise every circle would create one more guest in the database.

The decision is taken in the browser; the server does not read the session, so the pages stay static. The lock's words
are the field `gate` (`signingIn`, `failed`) in `guest/_data/<lang>.json`.

## Under which conditions it works — measured by reading the code, node step 330

The sign-in service address comes from `authBase()` in `lib/runtime-urls.ts`: bare IP / `localhost` → `<host>:3001`,
a domain → `auth.<apex of the address>`.

| Where the element is opened | Guest sign-in goes to | Works |
|---|---|---|
| a subdomain of the node's zone (`<id>.<zone>`) | `auth.<zone>` — the node's sign-in service | yes: its cookie is on the zone |
| the element's own domain (`<domain>`, step 324) | `auth.<domain>` — does not exist | **no** — the single sign-in centre of step 328 covers «Sign in», not the guest door |
| the node machine (`localhost`, bare IP) | `<host>:3001` — not the node's sign-in port | **no** — the step 328 fix covers «Sign in», not the guest door |

The two «no» rows are a debt, named here until the guest door goes through the same centre as «Sign in».

## The rule of the frame

The branch grows only inside its frame: `guest/layout.tsx` + `guest/page.tsx`, one `guest/[slug]/page.tsx`, and pages as
data folders in `guest/_pages/` — see `guest/README.md`. `scripts/check-routes.mjs` fails the build on any other route file.
