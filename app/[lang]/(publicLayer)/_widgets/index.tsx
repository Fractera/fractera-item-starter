import type { ReactNode } from 'react'
import { LandingAgent } from './static/widget-static-landing-agent'

// ВИДЖЕТЫ ЭТОЙ ВЕТКИ (владелец 2026-10-07: «удалили маршрут — проект чистый»). Страница ветки называет виджет в `meta.json` →
// `"widget"`; ищется он только здесь. Удалили ветку — список ушёл вместе с ней.
export const WIDGETS: Record<string, (lang: string) => ReactNode> = {
  // Главная — лендинг агента элемента на весь экран (`meta.widgetOnly`).
  'widget-static-landing-agent': (lang) => <LandingAgent lang={lang} />,
}
