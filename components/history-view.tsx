"use client"

import type { HistorialEntry } from "@/lib/xp-types"

interface Props {
  historial: HistorialEntry[]
}

export default function HistoryView({ historial }: Props) {
  return (
    <div style={{ padding: 20 }}>
      <h2>Historial</h2>

      {historial.length === 0 && <p>No hay movimientos todavía</p>}

      {historial.map((entry, i) => (
        <div key={i} style={{ marginBottom: 10 }}>
          <div>{entry.mensaje}</div>
          <div style={{ fontSize: 12, color: "gray" }}>{entry.fecha}</div>
        </div>
      ))}
    </div>
  )
}