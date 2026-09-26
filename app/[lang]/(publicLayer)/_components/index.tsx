import { createContentPage } from '@/lib/content/create-content-page'
import { homePage, data } from '../_data'
import { meta } from '../_data/meta'

// Корневая страница элемента — та же фабрика, что у любой страницы с содержимым; данные — `../_data` (en + ru).
// Шаблон (314-2): виджеты и ряд под первым экраном сайта root убраны вместе с его содержимым.
const page = createContentPage({
  data,
  resolve: homePage,
  meta,
  titleInBody: true,
})

export const generateMetadata = page.generateMetadata
export default page.Page
