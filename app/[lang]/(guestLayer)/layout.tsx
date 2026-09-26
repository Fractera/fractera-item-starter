import type { Metadata } from "next"
import { GuestGate } from "./_components/guest-gate.client"
import { guestUi } from "./_components/guest.i18n"

// ГОСТЕВАЯ ГРУППА (шаг 314-2) — третья рядом с публичной и защищённой. Её страницы открываются только с сессией, и если
// её нет, посетитель автоматически получает гостевой аккаунт. Закрыта от поиска: у каждого своя сессия, индексировать нечего.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default async function Layout(
  { children, params }: { children: React.ReactNode; params: Promise<{ lang: string }> },
) {
  const { lang } = await params
  const ui = guestUi(lang)
  return <GuestGate signingIn={ui.signingIn} failed={ui.failed}>{children}</GuestGate>
}
