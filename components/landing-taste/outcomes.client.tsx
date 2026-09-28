"use client"

import { useState } from "react"
import s from "./taste.module.css"

// ТРИ НАПРАВЛЕНИЯ — живой компонент вместо картинки первого экрана («Дизайн 1», навык taste: не фальшивый скриншот, а
// настоящий переключатель). Смена вкладки — переход состояния, единственное движение внутри островка. Без таймеров:
// вкладка меняется только рукой человека.

export function Outcomes({ label, items }: { label: string; items: { name: string; text: string }[] }) {
  const [at, setAt] = useState(0)
  const item = items[at]
  if (!item) return null
  return (
    <div className={s.outcomes}>
      <p className={s.outcomesLabel}>{label}</p>
      <div className={s.segmented} role="tablist" aria-label={label}>
        {items.map((it, i) => (
          <button
            key={it.name}
            type="button"
            role="tab"
            id={`outcome-tab-${i}`}
            aria-selected={i === at}
            aria-controls="outcome-panel"
            className={i === at ? s.segOn : s.seg}
            onClick={() => setAt(i)}
          >
            {it.name}
          </button>
        ))}
      </div>
      <div key={at} id="outcome-panel" role="tabpanel" aria-labelledby={`outcome-tab-${at}`} className={s.panel}>
        <p className={s.panelName}>{item.name}</p>
        <p className={s.panelText}>{item.text}</p>
      </div>
    </div>
  )
}
