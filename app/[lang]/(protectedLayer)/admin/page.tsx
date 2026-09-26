import { rootPage } from '@/lib/branch-page'

// Корень ветки «admin» — /<lang>/admin. Слова — ./_data; дети — ./_pages/<slug>/, их рисует ./[slug].
const page = rootPage({ segments: ['(protectedLayer)', 'admin'], subPath: '/admin' })

export const revalidate = 300
export const generateMetadata = page.generateMetadata
export default page.Page
