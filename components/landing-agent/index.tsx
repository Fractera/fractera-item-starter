import "@fontsource/barlow-condensed/500.css"
import "@fontsource/barlow-condensed/600.css"
import "@fontsource/barlow-condensed/700.css"
import "@fontsource/barlow/400.css"
import "@fontsource/barlow/500.css"
import "@fontsource/barlow/600.css"
import "@fontsource-variable/jetbrains-mono"
import { ArrowRight, Code } from "lucide-react"
import { landingWords, type LandingExtra } from "./words"
import { AgentChat } from "./agent-chat.client"
import { StaticImage } from "@/components/media/static-image.server"
import s from "./landing-agent.module.css"
import { SplitFlap } from "./split-flap.client"

// Чат агентов главной (333-12) — тот же островок, свой вид: классы этого виджета вместо классов главной.
const chatClasses = {
  chat: s.chat, chatHead: s.chatHead, chatDot: s.chatDot, chatLog: s.chatLog, chatContent: s.chatContent,
  chatMsg: s.chatMsg, msgMeta: s.msgMeta, msgMetaRight: s.msgMetaRight, msgWho: s.msgWho, msgAvatar: s.msgAvatar,
  contract: s.contract, msgText: s.msgText, msgTextRight: s.msgTextRight, aeBlock: s.aeBlock, typing: s.typing,
  typingRight: s.typingRight, system: s.system, systemStamp: s.systemStamp, systemBadge: s.systemBadge, endCta: s.endCta,
}

// «ДИЗАЙН АГЕНТА» — ЛЕНДИНГ ГЛАВНОЙ, ПЕРЕРИСОВАННЫЙ АГЕНТОМ ЭЛЕМЕНТА ПО НАВЫКУ impeccable НА ЭТАЛОННОМ МАКЕТЕ
// (`components/landing-impeccable/`, правило «The reference maquette comes first» в `impeccable-on-design.md`). Мир тот же —
// швейцарское табло отправлений, та же композиция и тот же контраст; цвета — отношения к `--primary` (README.md). Табло
// висит на стене и не двигается; движутся только флапы: каждое слово табло — барабаны split-flap (островок
// `split-flap.client.tsx`, набор флапов — `drum.ts`), главное окно перебирает три назначения, и строка назначения зажигает
// свою платформу (`data-shown` на табло). Слова — данные главной через `landingWords`; для чтения экраном и поиска слово
// стоит рядом обычным текстом, барабаны скрыты.

export function LandingAgent({ lang }: { lang: string }) {
  const w = landingWords(lang)
  if (!w) return null
  const { hero, can, hood, x } = w
  const b = x.board
  const outcomes = x.outcomes.slice(0, 3)
  const openSource = (x as LandingExtra & { openSource?: string }).openSource

  return (
    <div className={s.page}>
      {/* Первый экран (слово владельца, 333-16): на широком — две колонки во всю высоту первого экрана; слева табличка
          «Открытый код» в верхнем левом углу, название и подзаголовок; справа чат агентов прямо на фоне таблички. */}
      <section className={s.sign}>
        <div className={`${s.wrap} ${s.signGrid}`}>
          <div className={s.signMain}>
            <div className={s.signRow}>
              <h1 className={s.signTitle}>{hero.title}</h1>
              {openSource && (
                // Эмалевая табличка на стене вокзала: белая эмаль, кант цвета табло, квадрат-«платформа» со знаком кода.
                <p className={s.plate}>
                  <span className={s.plateMark} aria-hidden="true"><Code className="size-4" strokeWidth={2.5} /></span>
                  {openSource}
                </p>
              )}
            </div>
            <p className={s.signSub}>{x.titleSub}</p>
          </div>
          {x.chat && (
            <div className={s.signChat}>
              <AgentChat label={x.chat.label} items={x.chat.items} contractLabels={x.chat.contractLabels} endCta={x.chat.endCta} classes={chatClasses} />
            </div>
          )}
        </div>
      </section>

      <section className={s.hall}>
        <div className={s.wrap}>
            <div className={s.board} data-board data-shown="0">
              <div className={s.boardTop}>
                <span className={s.boardLabel}>{b.from}</span>
                <span className={s.origin}>
                  <span className={s.srOnly}>{b.fromValue}</span>
                  <SplitFlap words={[b.fromValue]} className={s.flapWord} />
                </span>
              </div>
              <div className={s.display} aria-hidden="true">
                <span className={s.displayLabel}>{b.destination}</span>
                <SplitFlap words={outcomes.map((o) => o.name)} className={s.displayField} announce />
              </div>
              <div className={s.boardHead} aria-hidden="true">
                <span>{b.destination}</span>
                <span className={s.colPlatform}>{b.platform}</span>
                <span className={s.colDeparts}>{b.departs}</span>
              </div>
              <ol className={s.rows}>
                {outcomes.map((o, i) => (
                  <li key={o.name} className={s.row}>
                    <div className={s.dest}>
                      <span className={s.srOnly}>{o.name}</span>
                      <SplitFlap words={[o.name]} className={s.flapWord} />
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
                  <button type="button" className={s.hintBtn} aria-label={x.claimHintLabel} aria-describedby="agent-claim-hint">?</button>
                  <span role="tooltip" id="agent-claim-hint" className={s.hint}>{x.claimHint}</span>
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
        {x.closingImage && (
          // Как на главной (333-11): на широком экране картинка справа во всю высоту экрана, ширина — по её пропорции;
          // правая половина видна целиком, левая уходит в цвет табло. Размытое превью (base64) и webp/avif — StaticImage.
          <div className={s.departArt}>
            <StaticImage src={x.closingImage.src} alt={x.closingImage.alt} fill sizes="(min-width: 1024px) 180vh, 1px" className={s.departImg} />
          </div>
        )}
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
