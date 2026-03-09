"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { ArrowLeft, Trophy, Gavel, ScrollText, Coins, Pencil, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Confetti } from "@/components/confetti"
import { ClassSelector } from "@/components/class-selector"
import { RankingView } from "@/components/ranking-view"
import { AuctionSetup, AuctionLive } from "@/components/auction-view"
import { HistoryView } from "@/components/history-view"
import type { CursosState, SubastaState } from "@/lib/xp-types"

import { supabase } from "@/lib/supabaseClient"

import {
  getCursos,
  crearCurso,
  agregarAlumno,
  eliminarAlumno,
  modificarXP
} from "@/lib/db"

const APP_NAME_KEY = "xp_system_app_name"
const DEFAULT_APP_NAME = "XP Banking Pro"

const CONFETTI_COLORS = [
  "oklch(0.87 0.17 85)",
  "oklch(0.58 0.22 27)",
  "oklch(0.6 0.2 250)",
  "oklch(0.65 0.2 145)",
]

export function XPSystem() {

  const [cursos, setCursos] = useState<CursosState>({})
  const [cursoActivo, setCursoActivo] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  const [appName, setAppName] = useState(DEFAULT_APP_NAME)
  const [editingName, setEditingName] = useState(false)
  const [nameInput, setNameInput] = useState(DEFAULT_APP_NAME)

  const nameInputRef = useRef<HTMLInputElement>(null)

  const [confetti, setConfetti] = useState<any[]>([])

  const [subasta, setSubasta] = useState<SubastaState>({
    activa: false,
    item: "",
    pujaActual: 0,
    ganadorIdx: null,
    incremento: 10,
  })

  const [timeLeft, setTimeLeft] = useState(30)

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Cargar datos desde Supabase

  useEffect(() => {

    async function loadData() {

      const data = await getCursos()

      setCursos(data)

      const savedName = localStorage.getItem(APP_NAME_KEY)

      if (savedName) {
        setAppName(savedName)
        setNameInput(savedName)
      }

      setMounted(true)

    }

    loadData()

  }, [])

  useEffect(() => {

    if (editingName && nameInputRef.current) {

      nameInputRef.current.focus()
      nameInputRef.current.select()

    }

  }, [editingName])

  const handleSaveName = useCallback(() => {

    const trimmed = nameInput.trim()

    if (trimmed) {

      setAppName(trimmed)

      localStorage.setItem(APP_NAME_KEY, trimmed)

    } else {

      setNameInput(appName)

    }

    setEditingName(false)

  }, [nameInput, appName])

  const launchConfetti = useCallback(() => {

    const particles = Array.from({ length: 60 }).map((_, i) => ({

      id: i,
      x: Math.random() * 100,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      delay: Math.random() * 2,
      size: Math.random() * 8 + 6,

    }))

    setConfetti(particles)

    setTimeout(() => setConfetti([]), 4000)

  }, [])

  const registrarLog = useCallback(

    (msg: string) => {

      if (!cursoActivo) return

      setCursos(prev => {

        const data = { ...prev[cursoActivo] }

        const historial = [...(data.historial || [])]

        historial.unshift({

          fecha: new Date().toLocaleTimeString(),
          mensaje: msg,

        })

        return { ...prev, [cursoActivo]: { ...data, historial } }

      })

    },

    [cursoActivo]

  )

  // Crear curso

  const handleCreateClass = async (nombre: string) => {

    if (cursos[nombre]) return

    const { data, error } = await crearCurso(nombre)

    if (error) {

      console.error(error)

      return

    }

    setCursos(prev => ({

      ...prev,

      [nombre]: {

        alumnos: [],
        historial: [],
        id: data?.[0]?.id,
	maxSupply:1000000

      }

    }))

  }

  const handleDeleteClass = (nombre: string) => {

    setCursos(prev => {

      const next = { ...prev }

      delete next[nombre]

      return next

    })

  }

  // Agregar alumno

  const handleAddAlumno = async (nombre: string) => {

    if (!cursoActivo) return

    const curso = cursos[cursoActivo]

    const { data, error } = await agregarAlumno(curso.id, nombre)

    if (error) {

      console.error(error)

      return

    }

    setCursos(prev => {

      const dataCurso = { ...prev[cursoActivo] }

      dataCurso.alumnos = [

        ...dataCurso.alumnos,

        {

          id: data?.[0]?.id,
          nombre,
          xp: 0

        }

      ]

      return { ...prev, [cursoActivo]: dataCurso }

    })

    registrarLog(`Nuevo alumno: ${nombre}`)

  }

  // Eliminar alumno

  const handleRemoveAlumno = async (idx: number) => {

    if (!cursoActivo) return

    const alumno = cursos[cursoActivo].alumnos[idx]

    await eliminarAlumno(alumno.id)

    const alumnoName = alumno.nombre

    setCursos(prev => {

      const data = { ...prev[cursoActivo] }

      data.alumnos = data.alumnos.filter((_, i) => i !== idx)

      return { ...prev, [cursoActivo]: data }

    })

    registrarLog(`Alumno eliminado: ${alumnoName}`)

  }

  // Modificar XP

  const handleModifyXP = async (idx: number, value: number) => {

    if (!cursoActivo) return

    const alumno = cursos[cursoActivo].alumnos[idx]

    const nuevoXP = Math.max(0, alumno.xp + value)

    await modificarXP(alumno.id, nuevoXP)

    setCursos(prev => {

      const data = { ...prev[cursoActivo] }

      const alumnos = [...data.alumnos]

      alumnos[idx] = {

        ...alumnos[idx],
        xp: nuevoXP

      }

      return { ...prev, [cursoActivo]: { ...data, alumnos } }

    })

  }

  // Subasta

  const handleStartSubasta = (e: React.FormEvent) => {

    e.preventDefault()

    if (!subasta.item.trim()) return

    setTimeLeft(30)

    setSubasta({

      ...subasta,
      activa: true,
      pujaActual: 0,
      ganadorIdx: null,

    })

    registrarLog(`SUBASTA INICIADA: ${subasta.item}`)

  }

  const handleBid = (alumnoIdx: number) => {

    if (timeLeft <= 0 || !cursoActivo) return

    const alumno = cursos[cursoActivo].alumnos[alumnoIdx]

    const nuevaPuja = subasta.pujaActual + subasta.incremento

    if (alumno.xp >= nuevaPuja) {

      setSubasta({

        ...subasta,
        pujaActual: nuevaPuja,
        ganadorIdx: alumnoIdx,

      })

      setTimeLeft(prev => Math.min(prev + 5, 30))

    }

  }

  const handleFinishSubasta = () => {

    if (subasta.ganadorIdx !== null && cursoActivo) {

      const ganador = cursos[cursoActivo].alumnos[subasta.ganadorIdx]

      setCursos(prev => {

        const data = { ...prev[cursoActivo] }

        const alumnos = [...data.alumnos]

        alumnos[subasta.ganadorIdx!] = {

          ...alumnos[subasta.ganadorIdx!],
          xp: alumnos[subasta.ganadorIdx!].xp - subasta.pujaActual,

        }

        return { ...prev, [cursoActivo]: { ...data, alumnos } }

      })

      registrarLog(

        `VENTA: ${ganador.nombre} gano "${subasta.item}" por ${subasta.pujaActual} XP`

      )

      launchConfetti()

    }

    setSubasta(prev => ({ ...prev, activa: false }))

  }

  if (!mounted) {

    return (

      <div className="flex min-h-screen items-center justify-center bg-background">

        <div className="animate-pulse text-muted-foreground">

          Cargando...

        </div>

      </div>

    )

  }

  return (
    <div className="relative min-h-screen bg-background">
      <Confetti particles={confetti} />

      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-4xl items-center gap-4 px-4">

          {cursoActivo && (
            <Button variant="ghost" size="icon" onClick={() => setCursoActivo(null)}>
              <ArrowLeft className="size-5" />
            </Button>
          )}

          <div className="flex items-center gap-3">
            <Coins className="size-5 text-primary" />
            <h1 className="font-bold">{appName}</h1>
          </div>

          <div className="ml-auto flex items-center gap-4">

            {cursoActivo && (
              <span className="text-xs text-muted-foreground font-mono">
                {cursos[cursoActivo]?.alumnos.reduce((sum, a) => sum + a.xp, 0)} XP total
              </span>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                await supabase.auth.signOut()
                window.location.href = "/login"
              }}
            >
              Cerrar sesión
            </Button>

          </div>

        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-6">

        {!cursoActivo ? (

          <ClassSelector
            cursos={cursos}
            appName={appName}
            onSelectClass={setCursoActivo}
            onCreateClass={handleCreateClass}
            onDeleteClass={handleDeleteClass}
          />

        ) : (

          <Tabs defaultValue="ranking">

            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="ranking">Ranking</TabsTrigger>
              <TabsTrigger value="subasta">Subasta</TabsTrigger>
              <TabsTrigger value="historial">Historial</TabsTrigger>
            </TabsList>

            <TabsContent value="ranking">
              <RankingView
                cursoData={cursos[cursoActivo]}
                cursoName={cursoActivo}
                onModifyXP={handleModifyXP}
                onAddAlumno={handleAddAlumno}
                onRemoveAlumno={handleRemoveAlumno}
              />
            </TabsContent>

            <TabsContent value="subasta">
              {!subasta.activa ? (
                <AuctionSetup
                  subasta={subasta}
                  onUpdateSubasta={(updates) =>
                    setSubasta(prev => ({ ...prev, ...updates }))
                  }
                  onStart={handleStartSubasta}
                />
              ) : (
                <AuctionLive
                  subasta={subasta}
                  timeLeft={timeLeft}
                  cursoData={cursos[cursoActivo]}
                  onBid={handleBid}
                  onFinish={handleFinishSubasta}
                />
              )}
            </TabsContent>

            <TabsContent value="historial">
              <HistoryView historial={cursos[cursoActivo]?.historial || []} />
            </TabsContent>

          </Tabs>

        )}

      </main>
    </div>
  )
}