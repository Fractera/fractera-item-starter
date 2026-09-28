import "server-only"
import { readFileSync } from "fs"
import { join } from "path"
import { elementRoot } from "@/lib/page-tree"

// НАВЫК ДИЗАЙНА ЭЛЕМЕНТА (шаг 333-3/333-4): поле `designSkill` паспорта `OWN-SERVICE-PROPS.json`. Читается сервером из папки
// элемента (`ELEMENT_DIR`) и уходит в островки пропсом. Нет поля или паспорта — `null`.
export function designSkill(): string | null {
  try {
    const props = JSON.parse(readFileSync(join(elementRoot(), "OWN-SERVICE-PROPS.json"), "utf8")) as { designSkill?: unknown }
    return typeof props.designSkill === "string" && props.designSkill.trim() ? props.designSkill.trim() : null
  } catch {
    return null
  }
}
