import { AccessGate } from "@/components/auth/access-gate.client"
import { accessGateUi } from "@/components/auth/access-gate.i18n"
import { appDialogUi } from "@/components/dialog/app-dialog.i18n"
import { ROLES } from "./group-roles"

// ГРУППА РОЛИ `buyer` В КАТЕГОРИИ `account` (шаг 314-2). Замок категории уже стоит выше; этот пускает только свою роль
// (и архитектора — он проходит все группы, как у категорий). Список тот же, что печатает страница группы.

export default async function Layout(
  { children, params }: { children: React.ReactNode; params: Promise<{ lang: string }> },
) {
  const { lang } = await params
  return (
    <AccessGate roles={ROLES} lang={lang} ui={accessGateUi(lang)} dialogUi={appDialogUi(lang)}>
      {children}
    </AccessGate>
  )
}
