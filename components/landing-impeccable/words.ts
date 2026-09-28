import { branchRoot } from "@/lib/page-tree"

// СЛОВА ЛЕНДИНГА — ОДНА КОПИЯ НА ТРИ ОФОРМЛЕНИЯ (330-4, 330-5). Главная (`landing`), «Дизайн 1» (`landing-taste`) и
// «Дизайн 2» (`landing-impeccable`) рисуют одно и то же задание по-разному: слова каждого берутся отсюда, из данных главной
// `(publicLayer)/_data/<язык>.json`. Блоки несут общий текст (его же читают агенты через `index.md`), поле `landing` — то,
// чего у блоков нет.

export type Link = { label: string; href: string }
type Block = { kind: string; id?: string; title?: string; text?: string; pill?: string; description?: string; cta?: Link; secondary?: Link }

export type LandingExtra = {
  titleSub: string
  claim: string
  claimHint: string
  claimHintLabel: string
  cards: string[]
  chips: string[]
  closingTitle: string
  closingText: string
  closingImage?: { src: string; alt: string }
  short: string
  outcomesLabel: string
  outcomes: { name: string; text: string }[]
  board: {
    from: string
    fromValue: string
    destination: string
    platform: string
    departs: string
    when: string
    connections: string
    included: string
    closing: string
  }
}

export type LandingWords = {
  hero: { pill?: string; title: string; description: string; cta?: Link; secondary?: Link }
  can: { title: string; texts: string[] }
  hood: { title: string; texts: string[] }
  x: LandingExtra
}

function section(blocks: Block[], id: string): { title: string; texts: string[] } {
  const at = blocks.findIndex((b) => b.kind === "section-head" && b.id === id)
  if (at < 0) return { title: "", texts: [] }
  const texts: string[] = []
  for (const b of blocks.slice(at + 1)) {
    if (b.kind !== "p") break
    texts.push(b.text ?? "")
  }
  return { title: blocks[at].title ?? "", texts }
}

/** Слова лендинга на языке `lang`; нет данных — `null` (виджет не рисует ничего, страница не падает). */
export function landingWords(lang: string): LandingWords | null {
  const root = branchRoot("(publicLayer)")
  const words = {
    ...(root?.en as { blocks?: Block[]; landing?: LandingExtra } | undefined),
    ...(root?.overrides[lang] as { blocks?: Block[]; landing?: LandingExtra } | undefined),
  }
  const blocks = words.blocks ?? []
  const hero = blocks.find((b) => b.kind === "hero-centered")
  if (!hero || !words.landing) return null
  return {
    hero: { pill: hero.pill, title: hero.title ?? "", description: hero.description ?? "", cta: hero.cta, secondary: hero.secondary },
    can: section(blocks, "what-it-can-do"),
    hood: section(blocks, "under-the-hood"),
    x: words.landing,
  }
}
