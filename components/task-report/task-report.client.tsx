"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { TaskReportWords } from "./task-report.i18n"

// ОКНО ОТЧЁТА О ЗАДАЧЕ (узел, шаг 356-2). Слово владельца 2026-10-01: «…&report-modal=… перехват такого параметра и вывод на окно …
// Закрытие этого окна удаляет данный параметр». Открывается, только если в адресе есть `?report=` и страница открыта на этой машине
// (127.0.0.1 / localhost — так открывается предпросмотр); отчёт берётся у двери `/api/task-report` (вшит в сборку). До оживления
// ничего не рисует — статике и поиску не мешает. Закрытие убирает `report` из адреса, якорь и прочие параметры остаются.
type Report = { task: string; done?: string[]; check?: string[] }

export function TaskReport({ words }: { words: TaskReportWords }) {
  const [report, setReport] = useState<Report | null | "missing">(null)

  useEffect(() => {
    const url = new URL(window.location.href)
    if (!url.searchParams.has("report")) return
    if (!["127.0.0.1", "localhost", "[::1]"].includes(url.hostname)) return
    fetch("/api/task-report", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d: { report?: Report | null } | null) => setReport(d?.report ?? "missing"))
      .catch(() => setReport("missing"))
  }, [])

  function close() {
    setReport(null)
    const url = new URL(window.location.href)
    url.searchParams.delete("report")
    window.history.replaceState(window.history.state, "", url.pathname + url.search + url.hash)
  }

  if (report === null) return null
  return (
    <Dialog open onOpenChange={(o) => { if (!o) close() }}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg" data-task-report>
        <DialogHeader>
          <DialogTitle>{words.title}</DialogTitle>
          <DialogDescription>{report === "missing" ? words.missing : report.task}</DialogDescription>
        </DialogHeader>
        {report !== "missing" && (
          <div className="flex flex-col gap-4 text-sm">
            {report.done && report.done.length > 0 && (
              <section className="flex flex-col gap-1.5">
                <p className="font-semibold text-foreground">{words.done}</p>
                <ul className="list-disc pl-5 text-muted-foreground">{report.done.map((d) => <li key={d}>{d}</li>)}</ul>
              </section>
            )}
            {report.check && report.check.length > 0 && (
              <section className="flex flex-col gap-1.5">
                <p className="font-semibold text-foreground">{words.check}</p>
                <ol className="list-decimal pl-5 text-muted-foreground">{report.check.map((c) => <li key={c}>{c}</li>)}</ol>
              </section>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
