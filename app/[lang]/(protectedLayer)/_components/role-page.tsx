import { PageHeader } from '@/components/content-page/page-header.server'
import { PostBody } from '@/components/content-page/post-body'
import { rolePageUi } from './role-page.i18n'

// СТРАНИЦА ОДНОЙ РОЛИ (шаг 314-2, слово владельца: «страницы которая должна просто возвращать какой-то текст что вы
// находитесь на странице которое защищается авторизацией и предоставляет доступ для роли и перечисления роли»).
// Одна на все группы ролей: группа называет свою роль и список допущенных — тот же, что у её замка в `layout.tsx`.
export function RolePage({ lang, role, allowed }: { lang: string; role: string; allowed: readonly string[] }) {
  const ui = rolePageUi(lang)
  const title = ui.title.replace('{role}', role)
  return (
    <main className="min-h-screen bg-background">
      <div data-app-column className="px-6 py-[var(--page-py-work)]">
        <PageHeader lang={lang} breadcrumbs={[{ label: title }]} title={title} />
        <PostBody
          blocks={[
            { kind: 'p', text: ui.text.replace('{role}', `**${role}**`) },
            { kind: 'p', text: ui.allowed.replace('{roles}', allowed.join(', ')) },
          ]}
        />
      </div>
    </main>
  )
}

export function rolePageTitle(lang: string, role: string): string {
  return rolePageUi(lang).title.replace('{role}', role)
}
