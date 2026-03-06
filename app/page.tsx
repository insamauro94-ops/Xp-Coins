"use client"

import { useState } from "react"

import ClassSelector from "@/components/class-selector"
import StudentList from "@/components/student-list"
import HistoryView from "@/components/history-view"
import AuctionView from "@/components/auction-view"

import { Alumno, HistorialEntry, SubastaState } from "@/lib/xp-types"

export default function Page() {
  const [curso, setCurso] = useState<string | null>(null)

  const [alumnos, setAlumnos] = useState<Alumno[]>([
    { id: "1", nombre: "Juan", xp: 0 },
    { id: "2", nombre: "Maria", xp: 0 },
  ])

  const [historial, setHistorial] = useState<HistorialEntry[]>([])

  const [subasta, setSubasta] = useState<SubastaState>({
    premio: "",
    pujaActual: 0,
    incremento: 1,
    ganadorIdx: null,
  })

  function addXP(id: string) {
    setAlumnos((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, xp: a.xp + 1 } : a
      )
    )

    setHistorial((h) => [
      { mensaje: "Se agregó XP", fecha: new Date().toLocaleString() },
      ...h,
    ])
  }

  function removeXP(id: string) {
    setAlumnos((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, xp: a.xp - 1 } : a
      )
    )
  }

  if (!curso) {
    return <ClassSelector cursos={["1A", "2A"]} onSelect={setCurso} />
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Curso {curso}</h1>

      <StudentList
        alumnos={alumnos}
        onAddXP={addXP}
        onRemoveXP={removeXP}
      />

      <AuctionView
        subasta={subasta}
        onUpdate={(data) =>
          setSubasta((s) => ({ ...s, ...data }))
        }
      />

      <HistoryView historial={historial} />
    </div>
  )
}