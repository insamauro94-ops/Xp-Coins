"use client"

import { useState } from "react"

type Alumno = {
  id: string
  nombre: string
  xp: number
}

interface RankingViewProps {
  alumnos: Alumno[]
  onAdd: (nombre: string) => void
  onRemove: (id: string) => void
  onAddXP: (id: string) => void
  onRemoveXP: (id: string) => void
}

export default function RankingView({
  alumnos,
  onAdd,
  onRemove,
  onAddXP,
  onRemoveXP,
}: RankingViewProps) {
  const [nuevo, setNuevo] = useState("")

  const ranking = [...alumnos].sort((a, b) => b.xp - a.xp)

  return (
    <div style={{ marginTop: 20 }}>

      <h2>Ranking de XP</h2>

      <div style={{ marginBottom: 10 }}>
        <input
          value={nuevo}
          onChange={(e) => setNuevo(e.target.value)}
          placeholder="Nombre del alumno"
        />

        <button
          onClick={() => {
            if (nuevo.trim()) {
              onAdd(nuevo)
              setNuevo("")
            }
          }}
        >
          Agregar
        </button>
      </div>

      {ranking.map((a, i) => (
        <div
          key={a.id}
          style={{
            display: "flex",
            gap: 10,
            alignItems: "center",
            marginBottom: 5,
          }}
        >
          <strong>
            #{i + 1} {a.nombre}
          </strong>

          <span>{a.xp} XP</span>

          <button onClick={() => onAddXP(a.id)}>+XP</button>
          <button onClick={() => onRemoveXP(a.id)}>-XP</button>

          <button onClick={() => onRemove(a.id)}>Eliminar</button>
        </div>
      ))}
    </div>
  )
}