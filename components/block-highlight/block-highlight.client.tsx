"use client"

import { useCallback, useEffect, useState } from "react"
import type { BlockHighlightWords } from "./block-highlight.i18n"

// ПОДСВЕТКА БЛОКОВ В РЕЖИМЕ АРХИТЕКТОРА (node step 317-3). Образец — FineTuneOverlay сайта 22slots: рамка поверх блока,
// рисуется отдельным слоем `position: fixed` (страница не меняется; портал не нужен — островок и так стоит в конце `<body>`), у рамки — имя блока и «Скопировать адрес».
//
// 🔒 ВКЛЮЧАЕТ ЯДРО, А НЕ ПОСЕТИТЕЛЬ. Кнопка «Подсветка» в Preview ядра шлёт в окно просмотра сообщение
// `{ type: "fractera:highlight", on }`; островок слушает только свой источник — https той же зоны или localhost на машине
// узла (то же правило, что `lib/sibling-origin.ts` на сервере). Посетитель сайта подсветку не увидит: его страница не
// открыта в окне ядра, и сообщения ему никто не пошлёт.
// 🔒 АДРЕС = СТРАНИЦА · ФАЙЛ · БЛОК: `data-page` / `data-file` ставит страница ветки (`lib/branch-page.tsx`), `data-block`
// (постоянный `bid`) и `data-kind` — фабрика `page-body` из «Блоков». Блоку ничего знать не нужно.
// 🔒 АДРЕС УХОДИТ И В БУФЕР, И В ЯДРО: в окне чужого источника браузер может закрыть буфер обмена, и тогда адрес покажет и
// даст скопировать сама панель Preview.

type Target = { rect: DOMRect; bid: string; kind: string; page: string; file: string }

const LOCAL = new Set(["localhost", "127.0.0.1", "[::1]"])

function zoneOf(host: string): string {
  const labels = host.split(".")
  return labels.length > 2 ? labels.slice(1).join(".") : host
}

/** Свой источник: localhost на машине узла или https той же зоны, что и этот сайт. */
function ownOrigin(origin: string): boolean {
  let url: URL
  try { url = new URL(origin) } catch { return false }
  const host = window.location.hostname
  if (LOCAL.has(host)) return LOCAL.has(url.hostname)
  if (url.protocol !== "https:") return false
  const zone = zoneOf(host)
  return url.hostname === zone || url.hostname.endsWith(`.${zone}`)
}

/** У обёртки `display: contents` своей коробки нет — рамка обнимает её детей. */
function boxOf(el: Element): DOMRect | null {
  const rects = Array.from(el.children).map((c) => c.getBoundingClientRect()).filter((r) => r.width > 0 && r.height > 0)
  if (rects.length === 0) return null
  const left = Math.min(...rects.map((r) => r.left))
  const top = Math.min(...rects.map((r) => r.top))
  const right = Math.max(...rects.map((r) => r.right))
  const bottom = Math.max(...rects.map((r) => r.bottom))
  return new DOMRect(left, top, right - left, bottom - top)
}

function addressText(t: Target, w: BlockHighlightWords): string {
  return `${w.page}: ${t.page}\n${w.file}: ${t.file}\n${w.block}: ${t.bid} (${t.kind})`
}

export function BlockHighlight({ words }: { words: BlockHighlightWords }) {
  const [on, setOn] = useState(false)
  const [target, setTarget] = useState<Target | null>(null)
  const [parent, setParent] = useState<{ source: MessageEventSource; origin: string } | null>(null)
  const [copied, setCopied] = useState(false)

  // Включение и выключение — только сообщением от своего источника.
  useEffect(() => {
    function onMessage(e: MessageEvent) {
      const d = e.data as { type?: string; on?: boolean } | null
      if (!d || d.type !== "fractera:highlight" || !ownOrigin(e.origin) || !e.source) return
      setOn(Boolean(d.on))
      setParent({ source: e.source, origin: e.origin })
      if (!d.on) setTarget(null)
      ;(e.source as WindowProxy).postMessage({ type: "fractera:highlight-state", on: Boolean(d.on) }, e.origin)
    }
    window.addEventListener("message", onMessage)
    return () => window.removeEventListener("message", onMessage)
  }, [])

  // Наведение: ближайший блок с адресом, рамка по его содержимому.
  useEffect(() => {
    if (!on) return
    let current: Element | null = null
    const measure = (el: Element) => {
      const rect = boxOf(el)
      const pageEl = el.closest("[data-page]")
      if (!rect) return
      setTarget({
        rect,
        bid: el.getAttribute("data-block") ?? "",
        kind: el.getAttribute("data-kind") ?? "",
        page: pageEl?.getAttribute("data-page") ?? window.location.pathname,
        file: pageEl?.getAttribute("data-file") ?? "",
      })
    }
    const onOver = (e: MouseEvent) => {
      const t = e.target as Element | null
      if (t?.closest("[data-highlight-ui]")) return
      const el = t?.closest("[data-block]") ?? null
      if (!el || !el.getAttribute("data-block")) return
      current = el
      setCopied(false)
      measure(el)
    }
    const onMove = () => current && measure(current)
    document.addEventListener("mouseover", onOver)
    window.addEventListener("scroll", onMove, true)
    window.addEventListener("resize", onMove)
    return () => {
      document.removeEventListener("mouseover", onOver)
      window.removeEventListener("scroll", onMove, true)
      window.removeEventListener("resize", onMove)
    }
  }, [on])

  const copy = useCallback(async () => {
    if (!target) return
    const text = addressText(target, words)
    let ok = false
    try {
      await navigator.clipboard.writeText(text)
      ok = true
    } catch {
      ok = false
    }
    if (parent) (parent.source as WindowProxy).postMessage({ type: "fractera:block", address: text, page: target.page, file: target.file, bid: target.bid, kind: target.kind }, parent.origin)
    setCopied(ok)
  }, [target, parent, words])

  if (!on || !target) return null
  const { rect } = target
  return (
    <div data-highlight-ui>
      <div
        aria-hidden
        className="pointer-events-none fixed rounded-sm border-2 border-primary"
        style={{ top: rect.top - 2, left: rect.left - 2, width: rect.width + 4, height: rect.height + 4, zIndex: 2147483000 }}
      />
      <div
        className="fixed flex items-center gap-2 rounded-md bg-primary px-2 py-1 text-xs text-primary-foreground shadow"
        style={{ top: Math.max(4, rect.top - 30), left: Math.max(4, rect.left), zIndex: 2147483001 }}
      >
        <span className="font-mono">{target.kind} · {target.bid}</span>
        <button type="button" onClick={copy} className="rounded bg-primary-foreground/15 px-1.5 py-0.5 hover:bg-primary-foreground/25">
          {copied ? words.copied : words.copy}
        </button>
      </div>
    </div>
  )
}
