import type { ReactNode } from 'react'
import { PageBody, type BlockSet } from '@/components/blocks/page-body'
import { P } from '@/components/blocks/p'
import { SectionHead } from '@/components/blocks/section-head'
import { HeroCentered } from '@/components/blocks/hero-centered'
import { WarningCard } from '@/components/blocks/warning-card'
import { Faq } from '@/components/blocks/faq'
import type { Block } from './types'

// НАБОР БЛОКОВ ЭТОГО ЭЛЕМЕНТА И ОТРИСОВКА СТРАНИЦЫ (шаг 314-2).
//
// 🔒 РИСУЕТ ФАБРИКА `page-body` ИЗ «БЛОКОВ», А НЕ СВОЙ КАТАЛОГ. Здесь только набор — какие блоки стоят в проекте. Новый
// блок: `npx shadcn add @fractera/<имя>` → строка в наборе → вид в `types.ts`. Вид без строки — ошибка сборки
// с командой установки, а не пустое место на странице.
// 🪦 Прежняя отрисовка через `sections/` (62 вида) удалена вместе с каталогом.

export const BLOCK_SET: BlockSet = {
  p: P,
  'section-head': SectionHead,
  'hero-centered': HeroCentered,
  'warning-card': WarningCard,
  faq: Faq,
}

/** Нарисовать список блоков по порядку; `keyPrefix` держит ключи уникальными между вызовами на одной странице. */
export function renderBlocks(blocks: (Block | { kind: 'faq'; title: string; items: { q: string; a: string }[] })[], keyPrefix = 'blk'): ReactNode {
  return <PageBody key={keyPrefix} blocks={blocks} set={BLOCK_SET} />
}
