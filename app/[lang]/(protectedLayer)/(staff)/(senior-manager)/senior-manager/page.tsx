import type { Metadata } from "next"
import { RolePage, rolePageTitle } from "../../../_components/role-page"
import { ROLES } from "../group-roles"

// Страница роли `senior_manager` (314-2): текст — общий словарь `_components/role-page.i18n.ts` (en, ru).
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  return { title: rolePageTitle(lang, "senior_manager") }
}

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  return <RolePage lang={lang} role="senior_manager" allowed={ROLES} />
}
