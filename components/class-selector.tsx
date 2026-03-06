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
  onSelect: (curso: string) => void
}

export function ClassSelector({ cursos, onSelect }: ClassSelectorProps) {
  const [nuevoCurso, setNuevoCurso] = useState("")

  return (
    <Card className="">
      <CardHeader className="">
        <CardTitle className="">Seleccionar Curso</CardTitle>
        <CardDescription className="">
          Elegí un curso o crea uno nuevo
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {Object.keys(cursos).map((curso) => (
          <Button
            key={curso}
            onClick={() => onSelect(curso)}
            className="w-full"
          >
            {curso}
          </Button>
        ))}

        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Nuevo curso..."
            value={nuevoCurso}
            onChange={(e) => setNuevoCurso(e.target.value)}
            className=""
          />

          <Button
            onClick={() => {
              if (nuevoCurso.trim()) {
                onSelect(nuevoCurso.trim())
                setNuevoCurso("")
              }
            }}
          >
            Crear
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}