"use client"

import { useEffect, useState, type ReactNode } from "react"

// ЗАМОК ГОСТЕВОЙ ГРУППЫ (шаг 314-2, слово владельца: «пользователи которые зашли на эту страницу автоматически
// зарегистрировались под гостевым аккаунтом»). Сессия есть — страница показывается. Сессии нет — браузер уходит на свой `/guest-in`,
// прокси ведёт к двери, где делают гостя (331): она создаёт пользователя с ролью `guest`, ставит сессию и возвращает сюда.
//
// 🔒 ОДНА ПОПЫТКА НА ВКЛАДКУ. Если после возврата сессии всё ещё нет (кука не легла на этот адрес, служба вернула не
// сюда), страница говорит об этом и НЕ уходит снова: иначе каждый круг создавал бы в базе ещё одного гостя.
// 🔒 Страница остаётся статической: решение принимается в браузере, сервер сессию не читает.

const MARK = "guest-login-tried"

type State = "checking" | "in" | "redirecting" | "failed"

function tried(): boolean {
  try { return sessionStorage.getItem(MARK) === "1" } catch { return false }
}
function markTried(): void {
  try { sessionStorage.setItem(MARK, "1") } catch { /* хранилище недоступно — попытка всё равно одна: мы уходим со страницы */ }
}

export function GuestGate({ children, signingIn, failed }: { children: ReactNode; signingIn: string; failed: string }) {
  const [state, setState] = useState<State>("checking")

  useEffect(() => {
    let alive = true
    fetch("/api/me", { cache: "no-store", credentials: "include" })
      .then((r) => (r.ok ? r.json() : null))
      .then((me: { userId?: string } | null) => {
        if (!alive) return
        if (me?.userId) {
          try { sessionStorage.removeItem(MARK) } catch { /* нечего чистить */ }
          return setState("in")
        }
        if (tried()) return setState("failed")
        markTried()
        setState("redirecting")
        // 331: свой `/guest-in` — прокси этого сайта знает, где делают гостя (центр узла на своём домене, служба входа
        // зоны, порт службы из реестра на машине); браузер этого не знает.
        window.location.href = `/guest-in?redirectUrl=${encodeURIComponent(window.location.href)}`
      })
      .catch(() => alive && setState("failed"))
    return () => { alive = false }
  }, [])

  if (state === "in") return <>{children}</>
  return (
    <main className="min-h-screen bg-background">
      <div data-app-column className="px-6 py-[var(--page-py-work)]">
        <p className="text-sm text-muted-foreground" role={state === "failed" ? "alert" : "status"}>
          {state === "failed" ? failed : signingIn}
        </p>
      </div>
    </main>
  )
}
