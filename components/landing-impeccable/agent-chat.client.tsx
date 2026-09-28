"use client"

import { useEffect, useRef, useState } from "react"
import { UserRound } from "lucide-react"
import { Conversation, ConversationContent, ConversationScrollButton } from "@/components/ai-elements/conversation"
import { Message, MessageContent } from "@/components/ai-elements/message"
import { Shimmer } from "@/components/ai-elements/shimmer"
import { ChainOfThought, ChainOfThoughtContent, ChainOfThoughtHeader, ChainOfThoughtStep } from "@/components/ai-elements/chain-of-thought"
import { Tool, ToolContent, ToolHeader, ToolInput, ToolOutput } from "@/components/ai-elements/tool"
import { Task, TaskContent, TaskItem, TaskTrigger } from "@/components/ai-elements/task"
import { Confirmation, ConfirmationAccepted, ConfirmationTitle } from "@/components/ai-elements/confirmation"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import base from "./impeccable.module.css"

// ИМИТАЦИЯ ЧАТА АГЕНТОВ НА ПЕРВОМ ЭКРАНЕ (шаг 333-12). Слово владельца: «имитацию чата между агентами, которые создают
// приложения … слева агент-регистратор, справа ему отвечают люди и агенты людей … как стрим»; «используй как можно больше
// элементов из ui elements, всегда отмечай в каком контракте идёт a2a, m2m, h2a … аватарку человека в виде иконки».
// Собрано из AI Elements: Conversation, Message, Shimmer, Chain of Thought, Tool, Task, Confirmation (Message — облегчённый,
// без streamdown, выбор владельца), метки контракта — Badge, человек — Avatar со значком. Шрифт — как код в Telegram, цвет —
// роль «плакат». Только широкий экран, без градиента.
// 🔒 СТАТИКА ЦЕЛА: сервер отдаёт весь разговор; островок, увидев чат на экране, проигрывает его заново — по одной реплике,
// с «печатает…» перед каждой. Ушёл с экрана — пауза, вернулся — продолжает. При «уменьшить движение» разговор стоит целиком.

type Contract = "a2a" | "m2m" | "h2a"
type Item = {
  side: "left" | "right"
  who: string
  text: string
  contract: Contract
  kind?: "thinking" | "tool" | "confirm" | "task"
  title?: string
  steps?: string[]
  checks?: string[]
  tool?: string
  input?: unknown
  output?: unknown
  accepted?: string
}

/** Классы, которые страница может заменить своими («Дизайн агента», `components/landing-agent/`); без них — вид главной. */
export type AgentChatClass =
  | "chat" | "chatHead" | "chatDot" | "chatLog" | "chatContent" | "chatMsg" | "msgMeta" | "msgMetaRight" | "msgWho"
  | "msgAvatar" | "contract" | "msgText" | "msgTextRight" | "aeBlock" | "typing" | "typingRight"
type Classes = Record<AgentChatClass, string>

const TYPING_MS = 1100
const READ_MS = 1700
const LOOP_MS = 6000

function isHuman(item: Item): boolean {
  return item.contract === "h2a" && item.side === "right"
}

function Extra({ item, s }: { item: Item; s: Classes }) {
  if (item.kind === "thinking" && item.steps) {
    return (
      <ChainOfThought defaultOpen className={s.aeBlock}>
        <ChainOfThoughtHeader>{item.title}</ChainOfThoughtHeader>
        <ChainOfThoughtContent>
          {item.steps.map((st, i) => <ChainOfThoughtStep key={i} label={st} status="complete" />)}
        </ChainOfThoughtContent>
      </ChainOfThought>
    )
  }
  if (item.kind === "tool" && item.tool) {
    return (
      <Tool defaultOpen className={s.aeBlock}>
        <ToolHeader type={`tool-${item.tool}` as `tool-${string}`} state="output-available" />
        <ToolContent>
          <ToolInput input={item.input} />
          <ToolOutput output={item.output} errorText={undefined} />
        </ToolContent>
      </Tool>
    )
  }
  if (item.kind === "confirm" && item.title) {
    return (
      <Confirmation approval={{ id: "sign", approved: true }} state="approval-responded" className={s.aeBlock}>
        <ConfirmationTitle>{item.title}</ConfirmationTitle>
        <ConfirmationAccepted>
          <span>{item.accepted}</span>
        </ConfirmationAccepted>
      </Confirmation>
    )
  }
  if (item.kind === "task" && item.checks) {
    return (
      <Task defaultOpen className={s.aeBlock}>
        <TaskTrigger title={item.title ?? ""} />
        <TaskContent>
          {item.checks.map((c, i) => <TaskItem key={i}>{c}</TaskItem>)}
        </TaskContent>
      </Task>
    )
  }
  return null
}

export function AgentChat({ label, items, contractLabels, classes }: {
  label: string
  items: Item[]
  contractLabels: Record<Contract, string>
  classes?: Partial<Classes>
}) {
  const s: Classes = { ...(base as Classes), ...classes }
  const box = useRef<HTMLDivElement>(null)
  // `null` — ещё не запускались: показан весь разговор, как его отдал сервер.
  const [shown, setShown] = useState<{ count: number; typing: boolean } | null>(null)
  const visible = useRef(false)

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const el = box.current
    if (!el) return
    let timer: ReturnType<typeof setTimeout> | null = null
    let state = { count: 0, typing: true }

    const tick = () => {
      if (!visible.current) return
      if (state.count >= items.length) {
        timer = setTimeout(() => { state = { count: 0, typing: true }; setShown(state); tick() }, LOOP_MS)
        return
      }
      if (state.typing) {
        timer = setTimeout(() => { state = { count: state.count, typing: false }; setShown(state); tick() }, TYPING_MS)
      } else {
        timer = setTimeout(() => { state = { count: state.count + 1, typing: true }; setShown(state); tick() }, READ_MS)
      }
    }

    const io = new IntersectionObserver(([e]) => {
      visible.current = e.isIntersecting
      if (timer) { clearTimeout(timer); timer = null }
      if (e.isIntersecting) { setShown(state); tick() }
    }, { threshold: 0.35 })
    io.observe(el)
    return () => { io.disconnect(); if (timer) clearTimeout(timer) }
  }, [items])

  const count = shown === null ? items.length : shown.count + (shown.typing ? 0 : 1)
  const list = items.slice(0, count)
  const typingItem = shown !== null && shown.typing ? items[shown.count] : null

  return (
    <div ref={box} className={s.chat} aria-label={label}>
      <p className={s.chatHead}>
        <span className={s.chatDot} aria-hidden="true" />
        {label}
      </p>
      <Conversation className={s.chatLog}>
        <ConversationContent className={s.chatContent}>
          {list.map((m, i) => (
            <Message key={i} from={m.side === "right" ? "user" : "assistant"} className={s.chatMsg}>
              <div className={m.side === "right" ? s.msgMetaRight : s.msgMeta}>
                {isHuman(m) && (
                  <Avatar className={s.msgAvatar}>
                    <AvatarFallback><UserRound className="size-3.5" aria-hidden="true" /></AvatarFallback>
                  </Avatar>
                )}
                <span className={s.msgWho}>{m.who}</span>
                <Badge variant="outline" className={s.contract} title={contractLabels[m.contract]}>{m.contract}</Badge>
              </div>
              <MessageContent className={m.side === "right" ? s.msgTextRight : s.msgText}>{m.text}</MessageContent>
              <Extra item={m} s={s} />
            </Message>
          ))}
          {typingItem && (
            <div className={typingItem.side === "right" ? s.typingRight : s.typing}>
              <Shimmer as="span" duration={1.4}>{`${typingItem.who} …`}</Shimmer>
            </div>
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>
    </div>
  )
}
