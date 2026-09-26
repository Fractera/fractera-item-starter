// ВИДЫ БЛОКОВ, КОТОРЫЕ СТОЯТ В ЭТОМ ЭЛЕМЕНТЕ (шаг 314-2).
//
// 🪦 КАТАЛОГ НА 60+ ВИДОВ И ПАПКА `sections/` УДАЛЕНЫ ИЗ ШАБЛОНА по слову владельца 2026-09-26: «Мы же сделали для этого
// специально отдельный микро service который управляет блоками … мы должны передать навык которые позволит ему самому
// определять стоит он забирать хочет или нет через MCP блоки». Блоки живут в элементе «Блоки»; элемент берёт себе только
// нужные командой `npx shadcn add @fractera/<имя>` (адрес реестра — `BLOCKS_REGISTRY_URL`) и владеет копией.
//
// 🔒 ОДИН ВИД ЗДЕСЬ — ОДИН ПОСТАВЛЕННЫЙ БЛОК В `components/blocks/` И ОДНА СТРОКА В `lib/content/blocks/registry.tsx`.
// Имя вида — имя блока в реестре «Блоков» (`hero-centered`): фабрика `page-body` на неизвестный вид падает с командой
// установки именно этого имени.

export type Link = { label: string; href: string }

export type Block =
  | { kind: 'p'; text: string }
  | { kind: 'section-head'; id: string; title: string; badge?: string }
  | { kind: 'hero-centered'; pill?: string; title: string; description: string; cta?: Link; secondary?: Link }
  | { kind: 'warning-card'; title: string; text: string }

/** Вопрос и ответ раздела FAQ — рисует блок `faq` из «Блоков», он же ставит разметку `FAQPage`. */
export type FaqPair = { q: string; a: string }

/** Строка оглавления. Оглавления в «Блоках» нет; тип остаётся для данных, которые его несут. */
export type TocItem = { id: string; text: string; children?: { id: string; text: string }[] }
