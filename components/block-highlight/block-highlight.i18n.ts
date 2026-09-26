// СЛОВА ПОДСВЕТКИ БЛОКОВ (317-3). `en` основа, `ru` перевод; строки выбирает сервер и передаёт островку пропсом.
export type BlockHighlightWords = { copy: string; copied: string; page: string; file: string; block: string; link: string }

const DICT: Record<string, BlockHighlightWords> = {
  en: { copy: "Copy address", copied: "Copied", page: "Page", file: "File", block: "Block", link: "Link" },
  ru: { copy: "Скопировать адрес", copied: "Скопировано", page: "Страница", file: "Файл", block: "Блок", link: "Ссылка" },
}

export function blockHighlightWords(lang: string): BlockHighlightWords {
  return DICT[lang] ?? DICT.en
}
