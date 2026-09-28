import "@fontsource-variable/geist"
import { ArrowUpRight, Database, KeyRound, Languages, Code2, type LucideIcon } from "lucide-react"
import { landingWords } from "@/components/landing/words"
import { Outcomes } from "./outcomes.client"
import s from "./taste.module.css"

// «ДИЗАЙН 1» — ТОТ ЖЕ ЛЕНДИНГ ПО НАВЫКУ taste (Leon Lin, `.claude/skills/design-taste-frontend`), шаг 330-5.
//
// Design Read: product landing for founders and builders, with a confident Linear-clean language, leaning toward Tailwind
// utilities + Geist + restrained CSS motion. Dials: DESIGN_VARIANCE 7, MOTION_INTENSITY 5, VISUAL_DENSITY 4.
// Palette: neutral zinc base + one accent (cobalt), locked on every section; light and dark follow the site theme.
// Shape rule: interactive elements are full pills, surfaces are 16px, nothing else.
// Real product imagery does not exist yet: the hero asset is a real working component (the three outcomes), not a
// fake screenshot; the section «what it can do» uses a pattern and a filled accent cell for visual variation.
// Words: the same data as the home page (`components/landing/words.ts`), no string in code.

const CHIP_ICONS: LucideIcon[] = [Database, KeyRound, Languages, Code2]

export function LandingTaste({ lang }: { lang: string }) {
  const w = landingWords(lang)
  if (!w) return null
  const { hero, can, hood, x } = w

  return (
    <div className={s.page}>
      <section data-app-column className="grid grid-cols-1 gap-12 px-6 pb-20 pt-16 md:grid-cols-12 md:items-end md:pt-24">
        <div className="md:col-span-7">
          <h1 className={s.h1}>
            {hero.title}
            <span className={s.h1Sub}>{x.titleSub}</span>
          </h1>
          <p className={s.lede}>{x.short}</p>
          <div className={`${s.enter3} mt-9 flex flex-wrap gap-3`}>
            {hero.cta && (
              <a href={hero.cta.href} className={s.btnPrimary}>
                {hero.cta.label}
                <ArrowUpRight className="size-4" strokeWidth={1.5} aria-hidden="true" />
              </a>
            )}
            {hero.secondary && <a href={hero.secondary.href} className={s.btnSecondary}>{hero.secondary.label}</a>}
          </div>
        </div>
        <div className={`${s.enter4} md:col-span-5`}>
          <Outcomes label={x.outcomesLabel} items={x.outcomes} />
        </div>
      </section>

      <section className={s.statement}>
        <div data-app-column className="px-6 py-20 md:py-28">
          <p className={s.claim}>
            {x.claim}
            <span className={s.hintWrap}>
              <button type="button" className={s.hintBtn} aria-label={x.claimHintLabel} aria-describedby="taste-claim-hint">?</button>
              <span role="tooltip" id="taste-claim-hint" className={s.hint}>{x.claimHint}</span>
            </span>
          </p>
          <p className={s.body}>{hero.description}</p>
        </div>
      </section>

      <section data-app-column className="px-6 py-20 md:py-28">
        <h2 className={s.h2}>{can.title}</h2>
        <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-6">
          {can.texts[0] && (
            <article className={`${s.cell} md:col-span-4`}>
              <h3 className={s.h3}>{x.cards[0]}</h3>
              <p className={s.cellText}>{can.texts[0]}</p>
            </article>
          )}
          {can.texts[1] && (
            <article className={`${s.cell} ${s.cellAccent} md:col-span-2`}>
              <p className={s.stat}>{x.stat.value}</p>
              <p className={s.statLabel}>{x.stat.label}</p>
              <h3 className={`${s.h3} mt-auto`}>{x.cards[1]}</h3>
              <p className={s.cellTextOn}>{can.texts[1]}</p>
            </article>
          )}
          {can.texts[2] && (
            <article className={`${s.cell} ${s.cellPattern} md:col-span-2`}>
              <h3 className={s.h3}>{x.cards[2]}</h3>
              <p className={s.cellText}>{can.texts[2]}</p>
            </article>
          )}
          {can.texts[3] && (
            <article className={`${s.cell} ${s.cellTint} md:col-span-4`}>
              <h3 className={s.h3}>{x.cards[3]}</h3>
              <p className={s.cellText}>{can.texts[3]}</p>
            </article>
          )}
        </div>
      </section>

      <section data-app-column className="grid grid-cols-1 gap-12 px-6 pb-20 md:grid-cols-2 md:items-center md:pb-28">
        <div>
          <h2 className={s.h2}>{hood.title}</h2>
          {hood.texts.map((t, i) => <p key={i} className={s.body}>{t}</p>)}
        </div>
        <ul className="grid grid-cols-2 gap-3">
          {x.chips.map((c, i) => {
            const Icon = CHIP_ICONS[i % CHIP_ICONS.length]
            return (
              <li key={c} className={s.tile}>
                <Icon className="size-5" strokeWidth={1.5} aria-hidden="true" />
                <span>{c}</span>
              </li>
            )
          })}
        </ul>
      </section>

      <section className={s.closing}>
        <div data-app-column className="px-6 py-20 md:py-28">
          <h2 className={s.closingTitle}>{x.closingTitle}</h2>
          <p className={s.body}>{x.closingText}</p>
          {hero.cta && (
            <a href={hero.cta.href} className={`${s.btnPrimary} mt-9`}>
              {hero.cta.label}
              <ArrowUpRight className="size-4" strokeWidth={1.5} aria-hidden="true" />
            </a>
          )}
        </div>
      </section>
    </div>
  )
}
