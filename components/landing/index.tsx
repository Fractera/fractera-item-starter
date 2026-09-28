import { Bot, Boxes, Globe2, Sparkles, Database, KeyRound, Languages, Code2, ArrowRight, type LucideIcon } from "lucide-react"
import { landingWords } from "./words"
import s from "./landing.module.css"

// ЛЕНДИНГ ГЛАВНОЙ ЭЛЕМЕНТА (узел, шаг 330-4). Слово владельца: «сбрось сейчас зависимость от блоков … рисуй так как будто тебя
// наняли для участия в соревновании против дизайна OpenAI … создаёшь виджет landing и устанавливаешь его главную страницу
// вместо того чтобы тащить туда блоки». Отсюда: своя вёрстка, свои цвета, ни «Блоков», ни токенов «Дизайна».
//
// 🔒 ОДНА КОПИЯ СЛОВ. Тексты главной — те же блоки `(publicLayer)/_data/<язык>.json` (их же читают агенты через `index.md`);
// лендинг раскладывает их по-своему. Поле `landing` там же несёт только то, чего у блоков нет: слоган второго уровня с
// подсказкой, заголовки карточек, цифру, фишки «под капотом», финальный призыв.
// 🔒 СТАТИКА: серверный компонент, в браузер не уходит ни строки JavaScript; движение — только CSS и выключается при
// `prefers-reduced-motion`. Подсказка «?» открывается наведением и фокусом клавиатуры, без скрипта.

const CARD_ICONS: LucideIcon[] = [Bot, Boxes, Globe2, Sparkles]
const CHIP_ICONS: LucideIcon[] = [Database, KeyRound, Languages, Code2]

export function Landing({ lang }: { lang: string }) {
  const w = landingWords(lang)
  if (!w) return null
  const { hero, can, hood, x } = w

  return (
    <div className={s.page}>
      {/* ── Первый экран ─────────────────────────────────────────────────────────────────────────────────────── */}
      <section className={s.hero}>
        <div className={s.aurora} aria-hidden="true">
          <span className={s.blobA} />
          <span className={s.blobB} />
          <span className={s.blobC} />
        </div>
        <div className={s.grid} aria-hidden="true" />
        <div className="relative mx-auto flex max-w-5xl flex-col items-center px-6 pb-24 pt-24 text-center sm:pt-32">
          {hero.pill && (
            <span className={s.pill}>
              <span className={s.dot} aria-hidden="true" />
              {hero.pill}
            </span>
          )}
          <h1 className={s.title}>{hero.title}<span className={s.titleSub}>{x.titleSub}</span></h1>
          <p className={s.lead}>{hero.description}</p>

          <p className={s.claim}>
            <span className={s.claimText}>{x.claim}</span>
            <span className={s.hintWrap}>
              <button type="button" className={s.hintBtn} aria-label={x.claimHintLabel} aria-describedby="landing-claim-hint">?</button>
              <span role="tooltip" id="landing-claim-hint" className={s.hint}>{x.claimHint}</span>
            </span>
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            {hero.cta && (
              <a href={hero.cta.href} className={s.ctaPrimary}>
                {hero.cta.label}
                <ArrowRight className="size-4" aria-hidden="true" />
              </a>
            )}
            {hero.secondary && <a href={hero.secondary.href} className={s.ctaGhost}>{hero.secondary.label}</a>}
          </div>
        </div>
      </section>

      {/* ── Что умеет ────────────────────────────────────────────────────────────────────────────────────────── */}
      <section className="relative mx-auto max-w-6xl px-6 py-24">
        <h2 className={s.h2}>{can.title}</h2>
        <div className={s.bento}>
          {can.texts.map((text, i) => {
            const Icon = CARD_ICONS[i % CARD_ICONS.length]
            return (
              <article key={i} className={`${s.card} ${i === 1 ? s.cardWide : ""} ${i === 3 ? s.cardAccent : ""}`}>
                <span className={s.icon}><Icon className="size-5" aria-hidden="true" /></span>
                {i === 1 && (
                  <p className={s.stat}>
                    <span className={s.statValue}>{x.stat.value}</span>
                    <span className={s.statLabel}>{x.stat.label}</span>
                  </p>
                )}
                {x.cards[i] && <h3 className={s.cardTitle}>{x.cards[i]}</h3>}
                <p className={s.cardText}>{text}</p>
              </article>
            )
          })}
        </div>
      </section>

      {/* ── Под капотом ─────────────────────────────────────────────────────────────────────────────────────── */}
      <section className="relative mx-auto max-w-6xl px-6 pb-24">
        <div className={s.hood}>
          <div className="max-w-xl">
            <h2 className={s.h2Left}>{hood.title}</h2>
            {hood.texts.map((t, i) => <p key={i} className={s.hoodText}>{t}</p>)}
          </div>
          <ul className={s.chips}>
            {x.chips.map((c, i) => {
              const Icon = CHIP_ICONS[i % CHIP_ICONS.length]
              return (
                <li key={c} className={s.chip}>
                  <Icon className="size-4" aria-hidden="true" />
                  {c}
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      {/* ── Финал ─────────────────────────────────────────────────────────────────────────────────────────────── */}
      <section className={s.closing}>
        <div className="relative mx-auto flex max-w-3xl flex-col items-center px-6 py-24 text-center">
          <h2 className={s.closingTitle}>{x.closingTitle}</h2>
          <p className={s.lead}>{x.closingText}</p>
          {hero.cta && (
            <a href={hero.cta.href} className={`${s.ctaPrimary} mt-10`}>
              {hero.cta.label}
              <ArrowRight className="size-4" aria-hidden="true" />
            </a>
          )}
        </div>
      </section>
    </div>
  )
}
