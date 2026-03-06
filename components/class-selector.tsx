"use client"

import { useState } from "react"

interface Props {
  cursos: string[]
  onSelect: (curso: string) => void
}

export default function ClassSelector({ cursos, onSelect }: Props) {
  const [nuevoCurso, setNuevoCurso] = useState("")

  return (
    <div style={{ padding: 20 }}>
      <h2>Seleccionar Curso</h2>

      {cursos.map((curso) => (
        <div key={curso} style={{ marginBottom: 10 }}>
          <button onClick={() => onSelect(curso)}>
            {curso}
          </button>
        </div>
      ))}

      <input
        placeholder="Nuevo curso"
        value={nuevoCurso}
        onChange={(e) => setNuevoCurso(e.target.value)}
      />

      <button
        onClick={() => {
          if (nuevoCurso.trim()) {
            onSelect(nuevoCurso.trim())
            setNuevoCurso("")
          }
        }}
      >
        Crear
      </button>
    </div>
  )
}