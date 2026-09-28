import "@fontsource/barlow-condensed/500.css"
import "@fontsource/barlow-condensed/600.css"
import "@fontsource/barlow-condensed/700.css"
import "@fontsource/barlow/400.css"
import "@fontsource/barlow/500.css"
import "@fontsource/barlow/600.css"
import { ArrowRight } from "lucide-react"
import { landingWords } from "./words"
import s from "./impeccable.module.css"

// ГЛАВНАЯ ЭЛЕМЕНТА — ЛЕНДИНГ ПО НАВЫКУ impeccable (Paul Bakaus, `.claude/skills/impeccable`), шаги 330-5, 330-8.
// Владелец выбрал его из трёх вариантов («design-2-impeccable to root, another to trash»); варианты taste и первый удалены.
// Мир — швейцарское табло отправлений: идея — вокзал, элемент — поезд, который от него отходит. Договор направления —
// `DIRECTION.md` рядом (только для разработки). Цвета — исходная палитра табло (333-7, откат; эталон для формулы пресетов).Серверный компонент: единственное движение — перелистывание букв табло
// на CSS, один раз при загрузке, выключено при «уменьшить движение». Слова — данные главной (`./words.ts`).

function Flap({ text, row }: { text: string; row: number }) {
  return (
    <span className={s.flapWord} aria-label={text}>
      {Array.from(text).map((ch, i) => (
        <span
          key={i}
          aria-hidden="true"
          className={ch === " " ? s.flapGap : s.flap}
          style={{ ["--i" as string]: i, ["--row" as string]: row }}
        >
          {ch === " " ? "" : ch}
        </span>
      ))}
    </span>
  )
}

export function LandingImpeccable({ lang }: { lang: string }) {
  const w = landingWords(lang)
  if (!w) return null
  const { hero, can, hood, x } = w
  const b = x.board

  return (
    <div className={s.page}>
      <section className={s.sign}>
        <div className={s.wrap}>
          <h1 className={s.signTitle}>{hero.title}</h1>
          <p className={s.signSub}>{x.titleSub}</p>
        </div>
      </section>

      <section className={s.hall}>
        <div className={s.wrap}>
          <div className={s.board}>
            <div className={s.boardTop}>
              <span className={s.boardLabel}>{b.from}</span>
              <span className={s.origin}><Flap text={b.fromValue} row={0} /></span>
            </div>
            <div className={s.boardHead} aria-hidden="true">
              <span>{b.destination}</span>
              <span className={s.colPlatform}>{b.platform}</span>
              <span className={s.colDeparts}>{b.departs}</span>
            </div>
            <ol className={s.rows}>
              {x.outcomes.map((o, i) => (
                <li key={o.name} className={s.row}>
                  <div className={s.dest}>
                    <Flap text={o.name} row={i + 1} />
                    <span className={s.via}>{o.text}</span>
                  </div>
                  <span className={s.platform} aria-label={`${b.platform} ${i + 1}`}>{i + 1}</span>
                  <span className={s.departs}>
                    <span className={s.lamp} aria-hidden="true" />
                    {b.when}
                  </span>
                </li>
              ))}
            </ol>
            <div className={s.ticker}>
              <span>{x.claim}</span>
              <span className={s.hintWrap}>
                <button type="button" className={s.hintBtn} aria-label={x.claimHintLabel} aria-describedby="board-claim-hint">?</button>
                <span role="tooltip" id="board-claim-hint" className={s.hint}>{x.claimHint}</span>
              </span>
            </div>
          </div>

          <div className={s.actions}>
            {hero.cta && (
              <a href={hero.cta.href} className={s.go}>
                {hero.cta.label}
                <ArrowRight className="size-5" strokeWidth={2} aria-hidden="true" />
              </a>
            )}
            {hero.secondary && <a href={hero.secondary.href} className={s.alt}>{hero.secondary.label}</a>}
          </div>
          <p className={s.lead}>{hero.description}</p>
        </div>
      </section>

      <section className={s.poster}>
        <div className={s.wrap}>
          <h2 className={s.posterTitle}>{can.title}</h2>
          <p className={s.posterSub}>{b.connections}</p>
          <ol className={s.timetable}>
            {can.texts.map((t, i) => (
              <li key={i} className={s.tRow}>
                <span className={s.tName}>{x.cards[i]}</span>
                <span className={s.tText}>{t}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className={s.hall}>
        <div className={s.wrap}>
          <div className={s.ticket}>
            <div className={s.ticketMain}>
              <h2 className={s.ticketTitle}>{hood.title}</h2>
              {hood.texts.map((t, i) => <p key={i} className={s.ticketText}>{t}</p>)}
            </div>
            <div className={s.ticketStub}>
              <p className={s.stubHead}>{b.included}</p>
              <ul className={s.stubList}>
                {x.chips.map((c) => <li key={c}>{c}</li>)}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className={s.depart}>
        <div className={s.wrap}>
          <h2 className={s.departTitle}>{b.closing}</h2>
          <p className={s.departText}>{x.closingText}</p>
          {hero.cta && (
            <a href={hero.cta.href} className={s.go}>
              {hero.cta.label}
              <ArrowRight className="size-5" strokeWidth={2} aria-hidden="true" />
            </a>
          )}
        </div>
      </section>
    </div>
  )
}
