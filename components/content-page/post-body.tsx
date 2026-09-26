import type { Block } from '@/lib/content/blocks/types'
import { renderBlocks } from '@/lib/content/blocks/registry'

// PostBody — тонкая обёртка над набором блоков элемента (`lib/content/blocks/registry.tsx`, фабрика `page-body` из
// «Блоков»). Любая поверхность с содержимым рисует блоки одинаково; новый вид добавляется в одном месте (314-2).
export function PostBody({ blocks }: { blocks: Block[]; lang?: string }) {
  return <div className="flex flex-col gap-6">{renderBlocks(blocks)}</div>
}
