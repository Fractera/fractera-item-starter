import { rootPage } from '@/lib/branch-page'

// Корень гостевой ветки — /<lang>/guest: текст и тревожная карточка (блок warning-card из «Блоков»). Слова — ./_data.
const page = rootPage({ segments: ['(guestLayer)', 'guest'], subPath: '/guest' })

export const revalidate = 300
export const generateMetadata = page.generateMetadata
export default page.Page
