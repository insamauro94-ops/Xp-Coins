"use client"

import { useState } from "react"
import { Plus, ChevronRight, Users, Trash2, Link2, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import type { CursosState } from "@/lib/xp-types"

interface ClassSelectorProps {
  cursos: CursosState
  appName: string
  onSelectClass: (name: string) => void
  onCreateClass: (name: string) => void
  onDeleteClass: (name: string) => void
}

export function ClassSelector({ cursos, appName, onSelectClass, onCreateClass, onDeleteClass }: ClassSelectorProps) {
  const [nombre, setNombre] = useState("")
  const [copiedClass, setCopiedClass] = useState<string | null>(null)

  const handleCopyClassLink = (className: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const url = `${window.location.origin}/alumno/${encodeURIComponent(className)}`
    navigator.clipboard.writeText(url).then(() => {
      setCopiedClass(className)
      setTimeout(() => setCopiedClass(null), 2000)
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!nombre.trim()) return
    onCreateClass(nombre.trim())
    setNombre("")
  }

  const classNames = Object.keys(cursos)

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-bold text-foreground text-balance">
          Bienvenido a {appName}
        </h2>
        <p className="text-sm text-muted-foreground">Selecciona o crea una clase para comenzar</p>
      </div>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">Crear Nueva Clase</CardTitle>
          <CardDescription>Agrega una nueva clase para comenzar a gestionar XP</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex gap-3">
            <Input
              placeholder="Nombre de la Clase..."
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="flex-1 bg-input text-foreground placeholder:text-muted-foreground"
            />
            <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="mr-1 size-4" />
              Crear
            </Button>
          </form>
        </CardContent>
      </Card>

      {classNames.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider px-1">
            Tus Clases
          </h3>
          {classNames.map((c) => (
            <Card
              key={c}
              className="group border-border bg-card transition-all hover:border-primary/50 hover:shadow-[0_0_15px_rgba(250,204,21,0.08)]"
            >
              <CardContent className="flex items-center justify-between py-4">
                <button
                  onClick={() => onSelectClass(c)}
                  className="flex flex-1 items-center gap-3 text-left"
                >
                  <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Users className="size-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">{c}</p>
                    <p className="text-xs text-muted-foreground">
                      {cursos[c].alumnos.length} alumno{cursos[c].alumnos.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <ChevronRight className="size-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                </button>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`ml-2 transition-colors ${
                    copiedClass === c
                      ? "text-accent"
                      : "text-muted-foreground hover:text-primary"
                  }`}
                  onClick={(e) => handleCopyClassLink(c, e)}
                  aria-label={`Copiar link de la clase ${c}`}
                >
                  {copiedClass === c ? (
                    <Check className="size-4" />
                  ) : (
                    <Link2 className="size-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-destructive"
                  onClick={(e) => {
                    e.stopPropagation()
                    if (confirm(`Eliminar la clase "${c}"?`)) {
                      onDeleteClass(c)
                    }
                  }}
                >
                  <Trash2 className="size-4" />
                  <span className="sr-only">Eliminar clase {c}</span>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {classNames.length === 0 && (
        <div className="rounded-xl border border-dashed border-border bg-card/50 p-8 text-center">
          <Users className="mx-auto mb-3 size-10 text-muted-foreground/50" />
          <p className="text-muted-foreground">No tienes clases todavia</p>
          <p className="text-sm text-muted-foreground/70">Crea tu primera clase para comenzar</p>
        </div>
      )}
    </div>
  )
}
