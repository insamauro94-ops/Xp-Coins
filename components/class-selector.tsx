"use client"

import { Curso } from "@/types/xp-types"

interface Props {
  cursos: Curso[]
  onSelect: (curso: Curso) => void
}

export default function ClassSelector({ cursos, onSelect }: Props) {
  return (
    <div style={{ padding: 40 }}>
      <h2>Seleccionar Curso</h2>

      {cursos.map((c) => (
        <button
          key={c}
          onClick={() => onSelect(c)}
          style={{
            margin: 10,
            padding: 10,
            fontSize: 16
          }}
        >
          {c}
        </button>
      ))}
    </div>
  )
}