// СЛОВА СТРАНИЦЫ РОЛИ (шаг 314-2). `en` основа, `ru` перевод; `{role}` и `{roles}` подставляет страница.
export type RolePageUi = { title: string; text: string; allowed: string }

const DICT: Record<string, RolePageUi> = {
  en: {
    title: 'Page for the role {role}',
    text: 'You are on a page protected by authorization. It grants access to the role {role}.',
    allowed: 'Roles allowed here: {roles}.',
  },
  ru: {
    title: 'Страница роли {role}',
    text: 'Вы находитесь на странице, которая защищается авторизацией. Она предоставляет доступ для роли {role}.',
    allowed: 'Роли, которым открыт доступ: {roles}.',
  },
}

export function rolePageUi(lang: string): RolePageUi {
  return DICT[lang] ?? DICT.en
}
