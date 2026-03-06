"use client"

import { HistorialEntry } from "@/lib/xp-types"

interface Props {
  historial: HistorialEntry[]
}

export default function HistoryView({ historial }: Props) {
  return (
    <div style={{ marginTop: 20 }}>
      <h3>Historial</h3>

      {historial.length === 0 && <p>No hay historial</p>}

      {historial.map((entry, i) => (
        <div key={i} style={{ borderBottom: "1px solid #ccc", padding: 5 }}>
          <div>{entry.mensaje}</div>
          <small>{entry.fecha}</small>
        </div>
      ))}
    </div>
  )
}