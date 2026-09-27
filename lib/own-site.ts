import { readFileSync } from "fs"
import { join } from "path"

// СВОЙ АДРЕС ЭЛЕМЕНТА (шаг 324-5, решение владельца 2026-09-28: «с каким доменом по умолчанию работать: … третьего уровня
// либо … двух уровневый»). У проекта один `url` — адрес корня, и настройки проекта (CONFIG) раздают его всем; у элемента,
// которому узел выдал свой главный адрес, он свой. Узел пишет его в папку данных элемента (`SERVICE_DATA_DIR/domain.json`,
// поле `url`) при «Подключить» и при выборе главного адреса; элемент читает на каждый запрос — без пересборки, страницы
// перерисовывает `revalidate`, которую узел зовёт в ответ на то же нажатие.
// Нет файла или поля — элемент живёт настройками проекта, как раньше.

/** Источник ядра своего узла (`https://architect.<зона>`) из файла домена узла, или `null` — узел без своего домена.
 *  324-6: элемент с собственным главным адресом живёт в чужой для ядра зоне; доверие к ядру — по этому точному адресу,
 *  а не по зоне. */
export function nodeCoreOrigin(): string | null {
  const file = process.env.NODE_DOMAIN_FILE?.trim()
  if (!file) return null
  try {
    const h = (JSON.parse(readFileSync(file, "utf8")) as { architectHostname?: unknown }).architectHostname
    return typeof h === "string" && /^[a-z0-9.-]+$/.test(h) ? `https://${h}` : null
  } catch {
    return null
  }
}

// СВЯЗИ ЭЛЕМЕНТА С УЗЛОМ (шаг 324-7, решение владельца 2026-09-28: «новый раздел который отрубает синхронизацию проекта от
// CONFIG, от блоков, от дизайна и позволяет проекту продолжить своё развитие абсолютно самостоятельно»). Переключатели — в
// «Настройках» элемента у ядра; состояние узел пишет в `SERVICE_DATA_DIR/links.json` (`{ config, design, blocks }`).
// Нет файла или ключа — связь включена, как было всегда. Выключенная: CONFIG — копия настроек проекта не ложится поверх
// своих файлов и не забирается; Дизайн — оформление не забирается. «Блоки» узел выключает в `components.json` сам.
export type LinkKind = "config" | "design" | "blocks"

export function linkOn(kind: LinkKind): boolean {
  const dir = process.env.SERVICE_DATA_DIR?.trim()
  if (!dir) return true
  try {
    return (JSON.parse(readFileSync(join(dir, "links.json"), "utf8")) as Record<string, unknown>)[kind] !== false
  } catch {
    return true
  }
}

export function ownSiteUrl(): string | null {
  const dir = process.env.SERVICE_DATA_DIR?.trim()
  if (!dir) return null
  try {
    const url = (JSON.parse(readFileSync(join(dir, "domain.json"), "utf8")) as { url?: unknown }).url
    return typeof url === "string" && /^https:\/\/[a-z0-9.-]+$/.test(url) ? url : null
  } catch {
    return null
  }
}
