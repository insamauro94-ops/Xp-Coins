"use client"

import { HistorialEntry } from "@/types/xp-types"

interface Props {
  historial: HistorialEntry[]
}

export default function HistoryView({ historial }: Props) {

  return (
    <div style={{ marginTop: 30 }}>
      <h2>Historial</h2>

      {historial.map((entry, i) => (
        <div key={i} style={{ marginBottom: 8 }}>
          <strong>{entry.mensaje}</strong>
          <div style={{ fontSize: 12 }}>
            {entry.fecha}
          </div>
        </div>
      ))}
    </div>
  )
}