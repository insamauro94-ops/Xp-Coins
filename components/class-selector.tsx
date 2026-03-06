"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"

import type { CursosState } from "@/lib/xp-types"

interface ClassSelectorProps {
  cursos: CursosState
  onSelectCurso: (cursoId: string) => void
}

export default function ClassSelector({
  cursos,
  onSelectCurso,
}: ClassSelectorProps) {
  const [busqueda, setBusqueda] = useState("")

  const cursosFiltrados = Object.values(cursos).filter((curso) =>
    curso.nombre.toLowerCase().includes(busqueda.toLowerCase())
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Seleccionar Curso</CardTitle>
        <CardDescription>
          Elegí el curso para ver los alumnos
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <Input
          placeholder="Buscar curso..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />

        <div className="grid gap-2">
          {cursosFiltrados.map((curso) => (
            <Button
              key={curso.id}
              variant="outline"
              onClick={() => onSelectCurso(curso.id)}
            >
              {curso.nombre}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}