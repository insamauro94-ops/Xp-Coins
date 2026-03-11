"use client"

import { useState, useEffect } from "react"
import { Coins, Trophy, Medal, Award, Users, Eye } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/lib/supabaseClient"

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

interface Alumno {
  id: string
  nombre: string
  xp: number
}

interface StudentClassViewProps {
  curso: string
}

export function StudentClassView({ curso }: StudentClassViewProps) {
  const [loading, setLoading] = useState(true)
  const [alumnos, setAlumnos] = useState<Alumno[]>([])
  const [cursoNombre, setCursoNombre] = useState("")
  const [appName, setAppName] = useState("XP Banking Pro")

  async function cargarCurso() {
    const decodedCurso = decodeURIComponent(curso)

    const { data: cursoData } = await supabase
      .from("cursos")
      .select("*")
      .eq("nombre", decodedCurso)
      .single()

    if (!cursoData) {
      setLoading(false)
      return
    }

    setCursoNombre(cursoData.nombre)

    const { data: alumnosData } = await supabase
      .from("alumnos")
      .select("*")
      .eq("curso_id", cursoData.id)

    setAlumnos(alumnosData || [])
    setLoading(false)
  }

  useEffect(() => {
    cargarCurso()

    const interval = setInterval(() => {
      cargarCurso()
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Cargando ranking...</div>
      </div>
    )
  }

  if (!cursoNombre) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="text-center space-y-3">
          <Users className="mx-auto size-12 text-muted-foreground/40" />
          <p className="text-lg font-semibold text-foreground">Clase no encontrada</p>
        </div>
      </div>
    )
  }

  const sorted = [...alumnos].sort((a, b) => b.xp - a.xp)

  const topXP = sorted[0]?.xp || 1
  const totalXP = alumnos.reduce((sum, a) => sum + a.xp, 0)

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-lg items-center gap-3 px-4">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary/15">
            <Coins className="size-5 text-primary" />
          </div>

          <div className="min-w-0 flex-1">
            <h1 className="truncate text-lg font-bold text-foreground leading-tight">
              {appName}
            </h1>
            <p className="text-xs text-muted-foreground">{cursoNombre}</p>
          </div>

          <Badge className="gap-1.5 bg-secondary text-muted-foreground border-border">
            <Eye className="size-3" />
            Solo lectura
          </Badge>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 py-6 space-y-6">

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-border bg-card p-4 text-center">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">
              Alumnos
            </p>
            <p className="mt-1 font-mono text-2xl font-bold text-foreground">
              {alumnos.length}
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-4 text-center">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">
              XP Total
            </p>
            <p className="mt-1 font-mono text-2xl font-bold text-primary">
              {totalXP}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider px-1">
            Ranking
          </h3>

          {sorted.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-card/50 p-10 text-center">
              <Trophy className="mx-auto mb-3 size-10 text-muted-foreground/40" />
              <p className="text-muted-foreground">No hay alumnos todavía</p>
            </div>
          ) : (
            <div className="space-y-2">
              {sorted.map((al, rank) => (
                <div
                  key={al.id}
                  className={`flex items-center gap-4 rounded-xl border p-4 ${getRankBg(rank)}`}
                >
                  <div className="flex size-10 items-center justify-center rounded-lg bg-secondary">
                    {getRankIcon(rank) || (
                      <span className="text-sm font-bold text-muted-foreground">
                        #{rank + 1}
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground truncate">
                      {al.nombre}
                    </p>

                    <div className="mt-1 flex items-center gap-2">
                      <div className="h-1.5 flex-1 max-w-32 rounded-full bg-secondary">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{
                            width: `${Math.min(
                              100,
                              (al.xp / Math.max(1, topXP)) * 100
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <Badge className="bg-primary/15 text-primary border-primary/25 px-3 py-1.5 font-mono text-sm font-bold">
                    {al.xp} XP
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>

      </main>
    </div>
  )
}