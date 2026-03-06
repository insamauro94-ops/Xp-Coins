"use client"

import { Alumno } from "@/lib/xp-types"

interface Props {
  alumnos: Alumno[]
  onAddXP: (id: string) => void
  onRemoveXP: (id: string) => void
}

export default function StudentList({ alumnos, onAddXP, onRemoveXP }: Props) {
  return (
    <div style={{ marginTop: 20 }}>
      <h3>Alumnos</h3>

      {alumnos.map((alumno) => (
        <div
          key={alumno.id}
          style={{
            display: "flex",
            gap: 10,
            marginBottom: 10,
            alignItems: "center",
          }}
        >
          <strong>{alumno.nombre}</strong>
          <span>{alumno.xp} XP</span>

          <button onClick={() => onAddXP(alumno.id)}>+1</button>
          <button onClick={() => onRemoveXP(alumno.id)}>-1</button>
        </div>
      ))}
    </div>
  )
}