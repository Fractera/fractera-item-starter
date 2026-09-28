import { SettingsEditorIsland } from "./settings-editor.client"
import { LanguagesIsland } from "./languages-island.client"
import { fieldsUi } from "./fields.i18n"
import { groupsUi } from "./groups.i18n"
import { siteSettingsWords } from "./site-settings.i18n"
import { ALL_LANGUAGE_METADATA } from "@/lib/site-settings/language-metadata"
import { linkOn } from "@/lib/own-site"

// СТРАНИЦА «НАСТРОЙКИ САЙТА» ЭЛЕМЕНТА (шаги 324-8, 324-9). Копия редактора CONFIG (группы basics · seo · metaMedia и
// языки), адаптированная под один элемент: островки ходят в дверь элемента `/api/settings/app`, которая пишет его
// `APP-CONFIG` — только при выключенной связи с CONFIG. Подписи полей выбирает сервер и отдаёт островкам пропсами.
// Переключатели функций CONFIG сюда не перенесены (решение владельца 2026-09-28: «настройку переключателя я не хотел бы
// сейчас перекидывать»).

const GROUPS = ["basics", "seo", "metaMedia"] as const

function builtLanguages(): { langs: string[]; def: string } {
  const langs = (process.env.NEXT_PUBLIC_SUPPORTED_LANGUAGES ?? "en").split(",").map((s) => s.trim()).filter(Boolean)
  const def = process.env.NEXT_PUBLIC_DEFAULT_LOCALE?.trim() || langs[0] || "en"
  return { langs: langs.length ? langs : ["en"], def }
}

export function SiteSettings({ lang }: { lang: string }) {
  const w = siteSettingsWords(lang)
  const { langs, def } = builtLanguages()
  const catalogue = Object.values(ALL_LANGUAGE_METADATA)
    .map((m) => ({ code: m.code, flag: m.flag, nativeName: m.nativeName, englishName: m.englishName, tier: m.aiTier }))
    .sort((a, b) => a.englishName.localeCompare(b.englishName))
  const linked = linkOn("config")
  return (
    <div className="flex flex-col gap-8" data-site-settings={linked ? "linked" : "own"}>
      <p className={linked ? "rounded-md border border-warning/50 bg-warning/10 px-3 py-2 text-sm text-foreground" : "text-sm text-muted-foreground"}>
        {linked ? w.linked : w.own}
      </p>
      {GROUPS.map((group) => (
        <SettingsEditorIsland key={group} group={group} lang={lang} langs={langs} defaultLang={def} editLangLabel={w.editLang} ui={fieldsUi(lang)} words={w.access} />
      ))}
      <section className="flex flex-col gap-3" aria-label={w.languagesTitle}>
        <p className="text-sm text-muted-foreground">{w.languagesNote}</p>
        <LanguagesIsland catalogue={catalogue} built={langs} builtDefault={def} ui={groupsUi(lang)} words={w.access} />
      </section>
    </div>
  )
}
