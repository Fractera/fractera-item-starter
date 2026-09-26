import { blocksToMarkdown, faqToMarkdown } from './blocks-to-markdown'
import { urlFor, mdUrlFor } from '@/lib/seo/alternates'
import { getAppConfig, metaForLang } from '@/config/app-config'
import { branchChildren, wordsIn } from '@/lib/page-tree'

// ПЕРЕЧЕНЬ ПУБЛИЧНЫХ ПОВЕРХНОСТЕЙ — ОДИН НА ВЕСЬ AIO (шаг 505).
//
// Отсюда берут содержимое три вещи: `llms.txt` (карта), `llms-full.txt` (полные
// тексты) и markdown-версия каждой страницы. Один перечень означает, что новая
// страница появляется во всех трёх сразу либо не появляется нигде — расхождение
// между картой и сайтом физически невозможно.
//
// 🔒 ЗДЕСЬ ТОЛЬКО ПУБЛИЧНОЕ. Страницы за ролью (`(protectedLayer)`) в перечень не
// входят и входить не могут: карта для ИИ — это приглашение прочитать, а
// закрытые адреса приглашать нельзя. Проверка `check:aio` следит за этим.
//
// Товары в перечне отсутствуют НАМЕРЕННО: их множество растёт в рантайме и
// умножается на языки. Карта называет каталог; сами карточки индексируются
// картой сайта и имеют собственные markdown-версии по своему адресу. Тот же урок,
// что с `sitemap.xml`: файл, выросший до предела, перестаёт работать целиком.

export type Surface = {
  /** Путь без языка: '' — главная, '/blog' — раздел. */
  subPath: string
  title: string
  description: string
  /** Раздел карты, в который попадает ссылка. */
  section: 'main' | 'articles' | 'legal'
  /** Полный текст в markdown — считается лениво, он нужен не всем читателям. */
  body: () => string
}

// Адрес markdown-версии живёт рядом с построением остальных адресов
// (`lib/seo/alternates.ts`) — там же, где `urlFor`, чтобы одноязычный режим
// учитывался ровно один раз. Здесь он только переэкспортируется для читателей
// этого модуля.
export { mdUrlFor }

export function publicSurfaces(lang: string): Surface[] {
  const cfg = getAppConfig()
  const home = metaForLang(lang)

  const surfaces: Surface[] = [
    {
      subPath: '',
      // Имя сайта, а не заголовок страницы: последний пропущен через шаблон
      // (`%s | Сайт`) и в карте читался бы как имя, повторённое дважды.
      title: home.siteName,
      description: home.description,
      section: 'main',
      // У главной нет собственного текста в блоках: её содержимое — это
      // идентичность проекта из настроек. Честнее отдать её как описание с
      // перечнем разделов, чем выдумать текст, которого на странице нет.
      // 🔒 БЕЗ СЛУЖЕБНЫХ ПОДПИСЕЙ НА ЧУЖОМ ЯЗЫКЕ (шаг 507). Здесь стояла строка
      // «- Сайт: <адрес>», и английская главная отдавала машинному читателю
      // русское слово. Словаря у этой поверхности нет и заводить его не за чем:
      // адрес сайта — не подпись, а ссылка, и она уже стоит в карте `llms.txt`.
      body: () =>
        [`# ${home.siteName}`, '', `> ${home.description}`, ...(cfg.url ? ['', cfg.url] : [])].join('\n'),
    },
  ]

  // 🪦 СТРАНИЦЫ СОДЕРЖИМОГО САЙТА ROOT (agi-item, core, web3, m2m, host, items) УБРАНЫ ИЗ ШАБЛОНА ЭЛЕМЕНТА (314-2):
  // шаблон несёт архитектуру, а не продукт. Свой раздел элемент добавляет сюда своей строкой.
  // 🪦 РАЗДЕЛ /blog И ЕГО ПОСТЫ УДАЛЕНЫ (229-2, 2026-09-18).

  // 314-2: дети публичной ветки — из дерева данных; новая папка страницы попадает в карту для ИИ сама.
  for (const child of branchChildren('(publicLayer)')) {
    const page = wordsIn(child, lang)
    surfaces.push({
      subPath: `/${child.slug}`,
      title: page.title,
      description: page.description,
      section: 'legal',
      body: () =>
        [`# ${page.title}`, '', `> ${page.description}`, '', blocksToMarkdown(page.blocks, home.siteName)].join('\n').trim(),
    })
  }

  return surfaces
}

export function surfaceFor(lang: string, subPath: string): Surface | undefined {
  return publicSurfaces(lang).find(s => s.subPath === subPath)
}
