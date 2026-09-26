import type { Block, FaqPair } from '@/lib/content/blocks/types'
import { resolveFields, resolveLocalizedBody } from '@/lib/content/resolve'
import { ownId } from '@/lib/own-id'
import { en } from './en'
import { ru } from './ru'

// Данные главной страницы — ТА ЖЕ АРХИТЕКТУРА, ЧТО У ПОСТА (шаг 508): содержимое — данные в языковых ячейках, рисует
// набор блоков элемента (`lib/content/blocks/registry.tsx`, фабрика `page-body` из «Блоков»).
//
// 🔒 ШАБЛОН ЭЛЕМЕНТА (314-2). Первый экран — блок `hero-centered` из «Блоков»; он говорит человеку, что перед ним
// стартовый шаблон, который достроит его агент Claude Code, и ведёт двумя кнопками к подписке и терминалу ЭТОГО элемента.
// 🪦 Подстановки прежнего сайта (адрес панели, число ролей, ряд под первым экраном, кнопка после разделов) убраны вместе
// с его содержимым и каталогом видов.

export type HomeCell = {
  title: string
  description: string
  /** Ключевые слова страницы — того же вида, что у правовых страниц. */
  keywords: string
  blocks: Block[]
  /** Вопросы и ответы — рисует блок `faq` из «Блоков» последней секцией, он же ставит разметку `FAQPage`. */
  faq?: FaqPair[]
}

export type HomeData = {
  en: HomeCell
  overrides: Record<string, Partial<HomeCell>>
}

export const data: HomeData = { en, overrides: { ru } }

// 🔒 АДРЕСА КНОПОК — СТРАНИЦЫ ЭТОГО ЭЛЕМЕНТА В СЛОЕ АРХИТЕКТОРА ЯДРА. Путь относительный: `/<язык>/architect/*` сайт
// переадресует на ядро (`next.config.ts`, `ARCHITECT_URL`), поэтому адреса ядра в коде элемента нет. Имя элемента — из
// паспорта при отрисовке (`lib/own-id.ts`); имени нет — кнопка ведёт на `#`, а не в чужую группу.
// В данных стоит путь без имени — `/<язык>/architect/build/<страница>`; имя вставляется здесь.
const ARCHITECT_PAGE = /^\/([a-z]{2})\/architect\/(build\/[a-z-]+)$/

function fill(blocks: Block[], _lang: string): Block[] {
  const at = (href: string) => {
    const m = href.match(ARCHITECT_PAGE)
    if (!m) return href
    const id = ownId()
    return id ? `/${m[1]}/architect/${id}/${m[2]}` : '#'
  }
  return blocks.map(b =>
    b.kind === 'hero-centered'
      ? {
          ...b,
          ...(b.cta ? { cta: { ...b.cta, href: at(b.cta.href) } } : {}),
          ...(b.secondary ? { secondary: { ...b.secondary, href: at(b.secondary.href) } } : {}),
        }
      : b,
  )
}

/** Содержимое главной на языке: перевод, иначе английская основа. */
export function homePage(lang: string): HomeCell {
  const override = data.overrides[lang]
  const fields = resolveFields(data.en, override ?? {}, ['title', 'description', 'keywords'] as const)
  const body = resolveLocalizedBody({ blocks: data.en.blocks }, override ? { blocks: override.blocks } : undefined)
  return { ...fields, blocks: fill(body.blocks, lang), faq: override?.faq ?? data.en.faq }
}
