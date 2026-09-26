import type { Metadata } from "next"
import { PageHeader } from "@/components/content-page/page-header.server"
import { PostBody } from "@/components/content-page/post-body"
import { guestUi } from "../_components/guest.i18n"

// ГОСТЕВАЯ СТРАНИЦА (314-2): текст о том, что посетитель зарегистрирован гостем, и тревожная карточка — блок
// `warning-card` из «Блоков» — о цене этой услуги для базы данных (слова владельца).
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  return { title: guestUi(lang).title }
}

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const ui = guestUi(lang)
  return (
    <main className="min-h-screen bg-background">
      <div data-app-column className="px-6 py-[var(--page-py-work)]">
        <PageHeader lang={lang} breadcrumbs={[{ label: ui.title }]} title={ui.title} />
        <PostBody
          blocks={[
            { kind: "p", text: ui.text },
            { kind: "warning-card", title: ui.warningTitle, text: ui.warningText },
          ]}
        />
      </div>
    </main>
  )
}
