// СЛОВА ГОСТЕВОЙ ГРУППЫ (шаг 314-2). `en` основа, `ru` перевод.
export type GuestUi = {
  title: string
  text: string
  warningTitle: string
  warningText: string
  signingIn: string
  failed: string
}

const DICT: Record<string, GuestUi> = {
  en: {
    title: 'Guest page',
    text: 'Visitors who open this page are registered automatically under a guest account.',
    warningTitle: 'Keep in mind',
    warningText: 'Every guest visit adds a new record to the database. If you decide to offer this, be careful: it puts real load on your application. Use it only where it is truly necessary.',
    signingIn: 'Creating a guest account…',
    failed: 'The guest account could not be created: the sign-in service did not return a session. The page does not retry by itself, so that no extra records are created.',
  },
  ru: {
    title: 'Гостевая страница',
    text: 'Пользователи, которые зашли на эту страницу, автоматически зарегистрированы под гостевым аккаунтом.',
    warningTitle: 'Имейте в виду',
    warningText: 'Каждый гостевой заход создаёт новую запись в базе данных. Если вы решили предоставлять эту услугу, будьте осторожны: это создаёт реальную нагрузку на ваше приложение. Используйте её только в самых необходимых случаях.',
    signingIn: 'Создаю гостевой аккаунт…',
    failed: 'Гостевой аккаунт не создан: служба входа не вернула сессию. Страница не повторяет попытку сама, чтобы не плодить записи.',
  },
}

export function guestUi(lang: string): GuestUi {
  return DICT[lang] ?? DICT.en
}
