"use client"

import { Clock, ScrollText } from "lucide-react"
import type { HistorialEntry } from "@/lib/xp-types"

interface HistoryViewProps {
  historial: HistorialEntry[]
}

export function HistoryView({ historial }: HistoryViewProps) {
  if (!historial || historial.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-card/50 p-10 text-center">
        <ScrollText className="mx-auto mb-3 size-10 text-muted-foreground/40" />
        <p className="text-muted-foreground">No hay actividad todavia</p>
        <p className="text-sm text-muted-foreground/60">Las acciones apareceran aqui</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {historial.map((entry, i) => (
        <div
          key={i}
          className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:bg-secondary/50"
        >
          <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-secondary">
            <Clock className="size-3.5 text-muted-foreground" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm text-foreground">{entry.mensaje}</p>
            <p className="mt-1 text-xs text-muted-foreground font-mono">{entry.fecha}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
