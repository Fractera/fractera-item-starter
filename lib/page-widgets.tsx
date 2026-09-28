import type { ReactNode } from 'react'
import { UsersTable } from '@/components/users-table/index.client'
import { usersTableUi } from '@/components/users-table/ui.i18n'
import { SiteSettings } from '@/components/site-settings'
import { GuestAccount } from '@/components/guest-account'
import { LandingAgent } from '@/components/landing-agent'

// РАБОЧИЕ ВИДЖЕТЫ СТРАНИЦ ДЕРЕВА (node step 314-2). Страница-данные, у которой кроме текста есть работа (таблица, форма),
// называет свой виджет в `meta.json` → `"widget": "<имя>"`; ребёнок ветки рисует его под текстом. Так у рабочей страницы
// нет собственного файла маршрута — она остаётся папкой данных, а код живёт в `components/`.
// Новый виджет — строка здесь. Имя, которого здесь нет, не рисует ничего.

const WIDGETS: Record<string, (lang: string) => ReactNode> = {
  'users-table': (lang) => <UsersTable lang={lang} ui={usersTableUi(lang)} />,
  // 324-8: свои настройки элемента — копия редактора CONFIG (admin/_pages/site-settings).
  'site-settings': (lang) => <SiteSettings lang={lang} />,
  // 331-2: гостевая страница — «Вернуться» туда, откуда пришёл, и «Удалить мою учётную запись и покинуть сайт».
  'guest-account': (lang) => <GuestAccount lang={lang} />,
  // 333-15: главная — лендинг агента элемента (навык impeccable, цвета по формуле от «Дизайна»), на весь экран (meta.widgetOnly).
  // Слово владельца: «зачем нам две страницы, оставь только главную … design-agent и должна стать главной».
  'landing-agent': (lang) => <LandingAgent lang={lang} />,
}

export function pageWidget(name: string, lang: string): ReactNode {
  return WIDGETS[name]?.(lang) ?? null
}
