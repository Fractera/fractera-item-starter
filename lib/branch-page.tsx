import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { AccessGate } from '@/components/auth/access-gate.client'
import { accessGateUi } from '@/components/auth/access-gate.i18n'
import { appDialogUi } from '@/components/dialog/app-dialog.i18n'
import { createContentPage } from '@/lib/content/create-content-page'
import type { Block } from '@/lib/content/blocks/types'
import { branchChild, branchRoot, wordsIn, type TreePage } from '@/lib/page-tree'
import { pageWidget } from '@/lib/page-widgets'
import { ownId } from '@/lib/own-id'

// СТРАНИЦЫ ВЕТКИ ИЗ ДЕРЕВА ДАННЫХ (node step 314-2). Два файла маршрута на ветку и больше ни одного: корень
// (`<ветка>/page.tsx` → `rootPage`) и ребёнок (`<ветка>/[slug]/page.tsx` → `childRoute`). Всё остальное — данные.
//
// 🔒 РЕБЁНОК РИСУЕТСЯ ПРИ ПЕРВОМ ЗАХОДЕ И 5 МИНУТ ОТДАЁТСЯ ГОТОВЫМ: `generateStaticParams` пустой (сборка детей не рисует
// вовсе — её время не зависит от числа страниц), `dynamicParams` включён, `revalidate = 300` стоит в файле маршрута.
// 🔒 ЗАМОК РЕБЁНКА — ИЗ ЕГО ДАННЫХ (`meta.roles`) поверх замка ветки в `layout.tsx`; архитектор проходит всегда.

const ARCHITECT_PAGE = /^\/([a-z]{2})\/architect\/(build\/[a-z-]+)$/

/** Ссылки на страницы ЭТОГО элемента в слое архитектора: в данных без имени, имя — из паспорта при отрисовке. */
function fillElementLinks(blocks: Block[]): Block[] {
  const at = (href: string) => {
    const m = href.match(ARCHITECT_PAGE)
    if (!m) return href
    const id = ownId()
    return id ? `/${m[1]}/architect/${id}/${m[2]}` : '#'
  }
  return blocks.map((b) =>
    b.kind === 'hero-centered'
      ? {
          ...b,
          ...(b.cta ? { cta: { ...b.cta, href: at(b.cta.href) } } : {}),
          ...(b.secondary ? { secondary: { ...b.secondary, href: at(b.secondary.href) } } : {}),
        }
      : b,
  )
}

/** `{roles}` в тексте страницы — список её замка (роли из `meta.roles` + архитектор): один список, два читателя. */
function allowedRoles(page: TreePage): string[] | null {
  const roles = page.meta.roles
  if (!roles || roles.length === 0) return null
  return roles.includes('architect') ? roles : [...roles, 'architect']
}

function contentOf(page: TreePage, lang: string) {
  const w = wordsIn(page, lang)
  const roles = allowedRoles(page)?.join(', ')
  const blocks = fillElementLinks(w.blocks).map((b) =>
    roles && b.kind === 'p' && b.text.includes('{roles}') ? { ...b, text: b.text.replace('{roles}', roles) } : b,
  )
  return { title: w.title, description: w.description, keywords: w.keywords ?? '', blocks, faq: w.faq }
}

type Crumb = { label: string; href?: string }

/**
 * АДРЕС СТРАНИЦЫ ДЛЯ ПОДСВЕТКИ (317-2): обёртка `display: contents` (на вёрстку не влияет) с `data-page` — адрес страницы —
 * и `data-file` — файл данных, из которого нарисован этот язык. Рамка подсветки берёт отсюда «страница · файл», а из
 * блока — его `bid`; этого достаточно, чтобы агент открыл ровно тот абзац.
 */
function PageAddress({ page, file, children }: { page: string; file: string; children: React.ReactNode }) {
  return <div data-page={page} data-file={file} style={{ display: 'contents' }}>{children}</div>
}

function dataFile(tree: TreePage, dir: string[], lang: string): string {
  const name = tree.overrides[lang] ? `${lang}.json` : 'en.json'
  return ['app', '[lang]', ...dir, name].join('/')
}

/**
 * Корень ветки: `segments` — путь папки ветки внутри `app/[lang]`, `subPath` — её адрес без языка.
 * 🔒 Данные читаются при каждой отрисовке, не при загрузке модуля: иначе правка JSON не дошла бы до сайта без перезапуска.
 */
export function rootPage(opts: { segments: string[]; subPath: string; titleInBody?: boolean; crumbs?: boolean }) {
  function build() {
    const page = branchRoot(...opts.segments)
    if (!page) throw new Error(`branch root without _data/en.json: ${opts.segments.join('/')}`)
    return createContentPage({
      data: { overrides: page.overrides },
      meta: { subPath: opts.subPath, ogImage: page.meta.ogImage ?? '/og-default.png' },
      resolve: (lang) => contentOf(page, lang),
      titleInBody: opts.titleInBody,
      chrome: opts.crumbs === false ? undefined : (_lang, c) => ({ breadcrumbs: [{ label: c.title }] }),
    })
  }
  async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
    return build().generateMetadata({ params })
  }
  async function Page({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params
    const P = build().Page
    const tree = branchRoot(...opts.segments)
    return (
      <PageAddress page={`/${lang}${opts.subPath}`} file={tree ? dataFile(tree, [...opts.segments, '_data'], lang) : ''}>
        <P params={Promise.resolve({ lang })} />
      </PageAddress>
    )
  }
  return { generateMetadata, Page }
}

/** Ребёнок ветки: одна страница на все папки `<ветка>/_pages/<slug>/`. */
export function childRoute(opts: { segments: string[]; subPath: string }) {
  function build(slug: string) {
    const page = branchChild(opts.segments, slug)
    if (!page) return null
    const root = branchRoot(...opts.segments)
    const widget = page.meta.widget
    const factory = createContentPage({
      data: { overrides: page.overrides },
      meta: { subPath: `${opts.subPath}/${slug}`, ogImage: page.meta.ogImage ?? '/og-default.png' },
      resolve: (lang) => contentOf(page, lang),
      afterBody: widget ? (lang) => pageWidget(widget, lang) : undefined,
      chrome: (lang, c) => {
        const crumbs: Crumb[] = []
        if (root && opts.subPath) crumbs.push({ label: wordsIn(root, lang).title, href: `/${lang}${opts.subPath}` })
        crumbs.push({ label: c.title })
        return { breadcrumbs: crumbs, backHref: `/${lang}${opts.subPath}`, backLabel: root ? wordsIn(root, lang).title : undefined }
      },
    })
    return { page, factory }
  }

  async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }): Promise<Metadata> {
    const { lang, slug } = await params
    const b = build(slug)
    return b ? b.factory.generateMetadata({ params: Promise.resolve({ lang }) }) : {}
  }

  async function Page({ params }: { params: Promise<{ lang: string; slug: string }> }) {
    const { lang, slug } = await params
    const b = build(slug)
    if (!b) notFound()
    const body = (
      <PageAddress page={`/${lang}${opts.subPath}/${slug}`} file={dataFile(b.page, [...opts.segments, '_pages', slug], lang)}>
        <b.factory.Page params={Promise.resolve({ lang })} />
      </PageAddress>
    )
    const allowed = allowedRoles(b.page)
    if (!allowed) return body
    return (
      <AccessGate roles={allowed} lang={lang} ui={accessGateUi(lang)} dialogUi={appDialogUi(lang)}>
        {body}
      </AccessGate>
    )
  }

  /** Сборка детей не рисует: каждый ребёнок рисуется при первом заходе. */
  function generateStaticParams(): { slug: string }[] {
    return []
  }

  return { generateMetadata, Page, generateStaticParams }
}
