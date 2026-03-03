"use client"

import { useState } from "react"
import { Plus, ChevronUp, ChevronDown, Trophy, Medal, Award, Trash2, Link2, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import type { CursoData } from "@/lib/xp-types"

interface RankingViewProps {
  cursoData: CursoData
  cursoName: string
  onModifyXP: (idx: number, value: number) => void
  onAddAlumno: (nombre: string) => void
  onRemoveAlumno: (idx: number) => void
}

function getRankIcon(rank: number) {
  if (rank === 0) return <Trophy className="size-5 text-primary" />
  if (rank === 1) return <Medal className="size-5 text-muted-foreground" />
  if (rank === 2) return <Award className="size-5 text-[oklch(0.65_0.13_55)]" />
  return null
}

function getRankBg(rank: number) {
  if (rank === 0) return "bg-primary/10 border-primary/30"
  if (rank === 1) return "bg-secondary border-border"
  if (rank === 2) return "bg-secondary border-border"
  return "bg-card border-border"
}

export function RankingView({ cursoData, cursoName, onModifyXP, onAddAlumno, onRemoveAlumno }: RankingViewProps) {
  const [nuevoAlumno, setNuevoAlumno] = useState("")
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null)

  const handleCopyLink = (alumnoName: string, originalIdx: number) => {
    const url = `${window.location.origin}/alumno/${encodeURIComponent(cursoName)}/${encodeURIComponent(alumnoName)}`
    navigator.clipboard.writeText(url).then(() => {
      setCopiedIdx(originalIdx)
      setTimeout(() => setCopiedIdx(null), 2000)
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!nuevoAlumno.trim()) return
    onAddAlumno(nuevoAlumno.trim())
    setNuevoAlumno("")
  }

  const sortedAlumnos = [...cursoData.alumnos]
    .map((a, originalIdx) => ({ ...a, originalIdx }))
    .sort((a, b) => b.xp - a.xp)

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="flex gap-3">
        <Input
          placeholder="Nombre del alumno..."
          value={nuevoAlumno}
          onChange={(e) => setNuevoAlumno(e.target.value)}
          className="flex-1 bg-input text-foreground placeholder:text-muted-foreground"
        />
        <Button type="submit" className="bg-accent text-accent-foreground hover:bg-accent/90">
          <Plus className="mr-1 size-4" />
          Agregar
        </Button>
      </form>

      {sortedAlumnos.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card/50 p-10 text-center">
          <Trophy className="mx-auto mb-3 size-10 text-muted-foreground/40" />
          <p className="text-muted-foreground">No hay alumnos todavia</p>
          <p className="text-sm text-muted-foreground/60">Agrega alumnos para comenzar</p>
        </div>
      ) : (
        <div className="space-y-2">
          {sortedAlumnos.map((al, rank) => (
            <div
              key={al.originalIdx}
              className={`animate-count-up flex items-center gap-4 rounded-xl border p-4 transition-all ${getRankBg(rank)}`}
            >
              <div className="flex size-10 items-center justify-center rounded-lg bg-secondary text-foreground">
                {getRankIcon(rank) || (
                  <span className="text-sm font-bold text-muted-foreground">#{rank + 1}</span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground truncate">{al.nombre}</p>
                <div className="mt-1 flex items-center gap-2">
                  <div className="h-1.5 flex-1 max-w-32 rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-500"
                      style={{
                        width: `${Math.min(100, (al.xp / Math.max(1, sortedAlumnos[0]?.xp || 1)) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              <Badge className="bg-primary/15 text-primary border-primary/25 px-3 py-1.5 font-mono text-sm font-bold">
                {al.xp} XP
              </Badge>

              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 text-accent hover:bg-accent/15 hover:text-accent"
                  onClick={() => onModifyXP(al.originalIdx, 5)}
                  aria-label={`Agregar 5 XP a ${al.nombre}`}
                >
                  <ChevronUp className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 text-destructive hover:bg-destructive/15 hover:text-destructive"
                  onClick={() => onModifyXP(al.originalIdx, -5)}
                  aria-label={`Quitar 5 XP a ${al.nombre}`}
                >
                  <ChevronDown className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`size-8 transition-colors ${
                    copiedIdx === al.originalIdx
                      ? "text-accent"
                      : "text-muted-foreground hover:bg-primary/15 hover:text-primary"
                  }`}
                  onClick={() => handleCopyLink(al.nombre, al.originalIdx)}
                  aria-label={`Copiar link de ${al.nombre}`}
                >
                  {copiedIdx === al.originalIdx ? (
                    <Check className="size-3.5" />
                  ) : (
                    <Link2 className="size-3.5" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 text-muted-foreground hover:bg-destructive/15 hover:text-destructive"
                  onClick={() => {
                    if (confirm(`Eliminar a "${al.nombre}"?`)) {
                      onRemoveAlumno(al.originalIdx)
                    }
                  }}
                  aria-label={`Eliminar a ${al.nombre}`}
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
