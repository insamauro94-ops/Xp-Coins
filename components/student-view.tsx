"use client"

import { useState, useEffect } from "react"
import { Coins, Trophy, Medal, Award, Users, Eye } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { CursosState, Alumno } from "@/lib/xp-types"

const STORAGE_KEY = "xp_system_vFinal_Pro"
const APP_NAME_KEY = "xp_system_app_name"
const DEFAULT_APP_NAME = "XP Banking Pro"

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

interface StudentViewProps {
  curso: string
  alumno: string
}

export function StudentView({ curso, alumno }: StudentViewProps) {
  const [mounted, setMounted] = useState(false)
  const [cursos, setCursos] = useState<CursosState>({})
  const [appName, setAppName] = useState(DEFAULT_APP_NAME)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) setCursos(JSON.parse(saved))
      const savedName = localStorage.getItem(APP_NAME_KEY)
      if (savedName) setAppName(savedName)
    } catch {
      // ignore
    }
    setMounted(true)
  }, [])

  // Auto-refresh every 5 seconds to pick up changes from the teacher
  useEffect(() => {
    const interval = setInterval(() => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY)
        if (saved) setCursos(JSON.parse(saved))
      } catch {
        // ignore
      }
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Cargando...</div>
      </div>
    )
  }

  const decodedCurso = decodeURIComponent(curso)
  const decodedAlumno = decodeURIComponent(alumno)
  const cursoData = cursos[decodedCurso]

  if (!cursoData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="text-center space-y-3">
          <Users className="mx-auto size-12 text-muted-foreground/40" />
          <p className="text-lg font-semibold text-foreground">Clase no encontrada</p>
          <p className="text-sm text-muted-foreground">
            La clase &quot;{decodedCurso}&quot; no existe en este dispositivo.
          </p>
        </div>
      </div>
    )
  }

  const alumnoData = cursoData.alumnos.find(
    (a) => a.nombre.toLowerCase() === decodedAlumno.toLowerCase()
  )

  if (!alumnoData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="text-center space-y-3">
          <Users className="mx-auto size-12 text-muted-foreground/40" />
          <p className="text-lg font-semibold text-foreground">Alumno no encontrado</p>
          <p className="text-sm text-muted-foreground">
            &quot;{decodedAlumno}&quot; no existe en la clase &quot;{decodedCurso}&quot;.
          </p>
        </div>
      </div>
    )
  }

  // Sort all students by XP to determine rank
  const sorted = [...cursoData.alumnos]
    .map((a, idx) => ({ ...a, originalIdx: idx }))
    .sort((a, b) => b.xp - a.xp)

  const myRank = sorted.findIndex(
    (a) => a.nombre.toLowerCase() === decodedAlumno.toLowerCase()
  )

  const topXP = sorted[0]?.xp || 1

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-lg items-center gap-3 px-4">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary/15">
            <Coins className="size-5 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-lg font-bold text-foreground leading-tight">
              {appName}
            </h1>
            <p className="text-xs text-muted-foreground">{decodedCurso}</p>
          </div>
          <Badge className="gap-1.5 bg-secondary text-muted-foreground border-border">
            <Eye className="size-3" />
            Solo lectura
          </Badge>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 py-6 space-y-6">
        {/* Student spotlight card */}
        <div className="rounded-2xl border-2 border-primary/30 bg-primary/5 p-6 text-center space-y-4">
          <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-primary/15">
            {getRankIcon(myRank) || (
              <span className="text-xl font-black text-muted-foreground">#{myRank + 1}</span>
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground text-balance">{alumnoData.nombre}</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Puesto #{myRank + 1} de {cursoData.alumnos.length}
            </p>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Coins className="size-8 text-primary" />
            <span className="font-mono text-5xl font-black text-primary">
              {alumnoData.xp}
            </span>
            <span className="text-xl font-bold text-primary/70">XP</span>
          </div>
          {/* XP bar */}
          <div className="mx-auto max-w-xs">
            <div className="h-2 rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-primary transition-all duration-700"
                style={{
                  width: `${Math.min(100, (alumnoData.xp / Math.max(1, topXP)) * 100)}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Full ranking */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider px-1">
            Ranking de la clase
          </h3>
          <div className="space-y-2">
            {sorted.map((al, rank) => {
              const isMe = al.nombre.toLowerCase() === decodedAlumno.toLowerCase()
              return (
                <div
                  key={al.originalIdx}
                  className={`flex items-center gap-4 rounded-xl border p-4 transition-all ${
                    isMe
                      ? "border-primary/40 bg-primary/10 ring-1 ring-primary/20"
                      : getRankBg(rank)
                  }`}
                >
                  <div className="flex size-10 items-center justify-center rounded-lg bg-secondary text-foreground">
                    {getRankIcon(rank) || (
                      <span className="text-sm font-bold text-muted-foreground">#{rank + 1}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-semibold truncate ${isMe ? "text-primary" : "text-foreground"}`}>
                      {al.nombre}
                      {isMe && (
                        <span className="ml-2 text-xs font-normal text-primary/70">(Tu)</span>
                      )}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <div className="h-1.5 flex-1 max-w-32 rounded-full bg-secondary">
                        <div
                          className="h-full rounded-full bg-primary transition-all duration-500"
                          style={{
                            width: `${Math.min(100, (al.xp / Math.max(1, topXP)) * 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <Badge
                    className={`px-3 py-1.5 font-mono text-sm font-bold ${
                      isMe
                        ? "bg-primary/20 text-primary border-primary/30"
                        : "bg-primary/15 text-primary border-primary/25"
                    }`}
                  >
                    {al.xp} XP
                  </Badge>
                </div>
              )
            })}
          </div>
        </div>
      </main>
    </div>
  )
}
