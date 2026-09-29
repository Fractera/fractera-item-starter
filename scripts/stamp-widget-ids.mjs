// АДРЕСА ПОДСВЕТКИ В КОДЕ ВИДЖЕТОВ (node step 335). Подсветка в Preview рамкой обводит элемент с `data-block`. Страницы из
// данных получают адрес от фабрики `page-body` (`bid` в `<язык>.json`, сторож `check-block-ids.mjs`). Виджет — код, который
// агент сгенерировал сам (лендинг `widgetOnly`, таблица, форма), — фабрику обходит, и без этой процедуры в нём ноль адресов:
// «включил подсветку и ничего не увидел» (владелец 2026-09-28).
//
// 🔒 ПРОЦЕДУРА ПОСЛЕ ГЕНЕРАЦИИ: написал или переписал виджет → `npm run widgets:ids`. Скрипт читает TSX каждого виджета,
// названного в `lib/page-widgets.tsx` (папки `components/<имя>/` из его импортов), компилятором TypeScript и ставит
// `data-block="<буква + 4 base36>"` на каждый элемент-контейнер (CONTAINERS ниже), у которого адреса нет. Стоящие адреса не
// трогает — повторный прогон ничего не меняет, и адрес, однажды скопированный архитектором, не уезжает.
// Без `--fix` — сторож в `prebuild`: контейнер без адреса валит сборку с командой лечения.
//
// Адрес из «Скопировать адрес» ищется в коде: `git grep 'data-block="k3f9a"' components/`. Элемент внутри `.map()` несёт один
// адрес на все повторы — это адрес места в коде, а не экземпляра.
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'node:fs'
import { join, relative, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { randomBytes } from 'node:crypto'
import ts from 'typescript'

const ROOT = join(fileURLToPath(new URL('.', import.meta.url)), '..')
const FIX = process.argv.includes('--fix')
const CONTAINERS = new Set([
  'section', 'header', 'footer', 'main', 'article', 'aside', 'nav', 'div', 'ol', 'ul', 'li',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'figure', 'blockquote', 'form', 'table',
])
const rel = (p) => relative(ROOT, p).split(sep).join('/')

function files(dir, ext, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) files(p, ext, out)
    else if (name.endsWith(ext)) out.push(p)
  }
  return out
}

// Папки виджетов — из импортов реестра `lib/page-widgets.tsx`: новый виджет попадает под процедуру той же строкой, что его подключает.
const registry = readFileSync(join(ROOT, 'lib/page-widgets.tsx'), 'utf8')
const dirs = [...new Set([...registry.matchAll(/from\s+['"]@\/components\/([^/'"]+)/g)].map((m) => m[1]))]
  .map((d) => join(ROOT, 'components', d))
  .filter((d) => existsSync(d) && statSync(d).isDirectory())

// Занятые адреса — во всём DOM сайта: `bid` данных и уже стоящие в коде.
const taken = new Set()
for (const f of files(join(ROOT, 'app'), '.json')) for (const m of readFileSync(f, 'utf8').matchAll(/"bid":\s*"([a-z0-9]+)"/g)) taken.add(m[1])
for (const f of files(join(ROOT, 'components'), '.tsx')) for (const m of readFileSync(f, 'utf8').matchAll(/data-block="([a-z0-9]+)"/g)) taken.add(m[1])

function newId() {
  const a = 'abcdefghijklmnopqrstuvwxyz0123456789'
  for (;;) {
    const b = randomBytes(5)
    let id = a[b[0] % 26]
    for (let i = 1; i < 5; i++) id += a[b[i] % 36]
    if (!taken.has(id)) { taken.add(id); return id }
  }
}

const missing = []
let stamped = 0
for (const dir of dirs) {
  for (const file of files(dir, '.tsx')) {
    const text = readFileSync(file, 'utf8')
    const sf = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
    const spots = []
    const visit = (node) => {
      if ((ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) && ts.isIdentifier(node.tagName) && CONTAINERS.has(node.tagName.text)) {
        const has = node.attributes.properties.some((a) => ts.isJsxAttribute(a) && a.name.getText(sf) === 'data-block')
        if (!has) {
          const { line } = sf.getLineAndCharacterOfPosition(node.tagName.getStart(sf))
          spots.push({ at: node.tagName.end, where: `${rel(file)}:${line + 1} <${node.tagName.text}>` })
        }
      }
      ts.forEachChild(node, visit)
    }
    visit(sf)
    if (!spots.length) continue
    if (!FIX) { missing.push(...spots.map((s) => s.where)); continue }
    let out = text
    for (const s of spots.sort((a, b) => b.at - a.at)) out = `${out.slice(0, s.at)} data-block="${newId()}"${out.slice(s.at)}`
    writeFileSync(file, out)
    stamped += spots.length
    console.log(`  ${rel(file)}: +${spots.length}`)
  }
}

if (missing.length) {
  for (const m of missing) console.error(`  ${m}`)
  console.error(`===WIDGET_IDS_FAILED=== контейнеров без адреса подсветки: ${missing.length}. Поставить: npm run widgets:ids`)
  process.exit(1)
}
console.log(`===WIDGET_IDS_OK===${stamped ? ` поставлено адресов: ${stamped}` : ''} у каждого контейнера виджетов (${dirs.length} папок) есть data-block`)
