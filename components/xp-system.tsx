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

const STORAGE_KEY = "xp_system_vFinal_Pro"
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
  const [confetti, setConfetti] = useState<Array<{
    id: number; x: number; color: string; delay: number; size: number
  }>>([])

  const [subasta, setSubasta] = useState<SubastaState>({
    activa: false,
    item: "",
    pujaActual: 0,
    ganadorIdx: null,
    incremento: 10,
  })
  const [timeLeft, setTimeLeft] = useState(30)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) setCursos(JSON.parse(saved))
      const savedName = localStorage.getItem(APP_NAME_KEY)
      if (savedName) {
        setAppName(savedName)
        setNameInput(savedName)
      }
    } catch {
      // ignore parse errors
    }
    setMounted(true)
  }, [])

  // Focus input when editing name
  useEffect(() => {
    if (editingName && nameInputRef.current) {
      nameInputRef.current.focus()
      nameInputRef.current.select()
    }
  }, [editingName])

  // Save to localStorage on change
  useEffect(() => {
    if (mounted) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cursos))
    }
  }, [cursos, mounted])

  // Save when the user leaves the page (close tab, navigate away, switch tabs, minimize)
  const cursosRef = useRef(cursos)
  useEffect(() => {
    cursosRef.current = cursos
  }, [cursos])

  useEffect(() => {
    const saveState = () => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cursosRef.current))
      } catch {
        // ignore storage errors
      }
    }

    const handleBeforeUnload = () => {
      saveState()
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        saveState()
      }
    }

    const handlePageHide = () => {
      saveState()
    }

    window.addEventListener("beforeunload", handleBeforeUnload)
    document.addEventListener("visibilitychange", handleVisibilityChange)
    window.addEventListener("pagehide", handlePageHide)

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      window.removeEventListener("pagehide", handlePageHide)
    }
  }, [])

  // Auction timer
  useEffect(() => {
    if (subasta.activa && timeLeft > 0) {
      timerRef.current = setInterval(() => setTimeLeft((prev) => prev - 1), 1000)
    } else if (timeLeft === 0 && subasta.activa) {
      if (timerRef.current) clearInterval(timerRef.current)
      launchConfetti()
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subasta.activa, timeLeft])

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
      setCursos((prev) => {
        const data = { ...prev[cursoActivo] }
        const historial = [...(data.historial || [])]
        historial.unshift({ fecha: new Date().toLocaleTimeString(), mensaje: msg })
        return { ...prev, [cursoActivo]: { ...data, historial } }
      })
    },
    [cursoActivo]
  )

  const handleCreateClass = (nombre: string) => {
    if (cursos[nombre]) return
    setCursos((prev) => ({
      ...prev,
      [nombre]: { alumnos: [], historial: [], maxSupply: 1000 },
    }))
  }

  const handleDeleteClass = (nombre: string) => {
    setCursos((prev) => {
      const next = { ...prev }
      delete next[nombre]
      return next
    })
  }

  const handleAddAlumno = (nombre: string) => {
    if (!cursoActivo) return
    setCursos((prev) => {
      const data = { ...prev[cursoActivo] }
      data.alumnos = [...data.alumnos, { nombre, xp: 0 }]
      return { ...prev, [cursoActivo]: data }
    })
    registrarLog(`Nuevo alumno: ${nombre}`)
  }

  const handleRemoveAlumno = (idx: number) => {
    if (!cursoActivo) return
    const alumnoName = cursos[cursoActivo].alumnos[idx]?.nombre
    setCursos((prev) => {
      const data = { ...prev[cursoActivo] }
      data.alumnos = data.alumnos.filter((_, i) => i !== idx)
      return { ...prev, [cursoActivo]: data }
    })
    if (alumnoName) registrarLog(`Alumno eliminado: ${alumnoName}`)
  }

  const handleModifyXP = (idx: number, value: number) => {
    if (!cursoActivo) return
    setCursos((prev) => {
      const data = { ...prev[cursoActivo] }
      const alumnos = [...data.alumnos]
      alumnos[idx] = { ...alumnos[idx], xp: Math.max(0, alumnos[idx].xp + value) }
      return { ...prev, [cursoActivo]: { ...data, alumnos } }
    })
  }

  const handleStartSubasta = (e: React.FormEvent) => {
    e.preventDefault()
    if (!subasta.item.trim()) return
    setTimeLeft(30)
    setSubasta({ ...subasta, activa: true, pujaActual: 0, ganadorIdx: null })
    registrarLog(`SUBASTA INICIADA: ${subasta.item} (Incrementos de ${subasta.incremento} XP)`)
  }

  const handleBid = (alumnoIdx: number) => {
    if (timeLeft <= 0 || !cursoActivo) return
    const alumno = cursos[cursoActivo].alumnos[alumnoIdx]
    const nuevaPuja = subasta.pujaActual + subasta.incremento

    if (alumno.xp >= nuevaPuja) {
      setSubasta({ ...subasta, pujaActual: nuevaPuja, ganadorIdx: alumnoIdx })
      setTimeLeft((prev) => Math.min(prev + 5, 30))
    }
  }

  const handleFinishSubasta = () => {
    if (subasta.ganadorIdx !== null && cursoActivo) {
      const ganador = cursos[cursoActivo].alumnos[subasta.ganadorIdx]
      setCursos((prev) => {
        const data = { ...prev[cursoActivo] }
        const alumnos = [...data.alumnos]
        alumnos[subasta.ganadorIdx!] = {
          ...alumnos[subasta.ganadorIdx!],
          xp: alumnos[subasta.ganadorIdx!].xp - subasta.pujaActual,
        }
        return { ...prev, [cursoActivo]: { ...data, alumnos } }
      })
      registrarLog(
        `VENTA CERRADA: ${ganador.nombre} gano "${subasta.item}" por ${subasta.pujaActual} XP`
      )
      launchConfetti()
    }
    setSubasta((prev) => ({ ...prev, activa: false }))
  }

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Cargando...</div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-background">
      <Confetti particles={confetti} />

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-4xl items-center gap-4 px-4">
          {cursoActivo && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setCursoActivo(null)
                setSubasta((prev) => ({ ...prev, activa: false }))
              }}
              className="text-muted-foreground hover:text-foreground"
              aria-label="Volver al menu"
            >
              <ArrowLeft className="size-5" />
            </Button>
          )}
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary/15">
              <Coins className="size-5 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              {editingName ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    handleSaveName()
                  }}
                  className="flex items-center gap-1.5"
                >
                  <input
                    ref={nameInputRef}
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    onBlur={handleSaveName}
                    onKeyDown={(e) => {
                      if (e.key === "Escape") {
                        setNameInput(appName)
                        setEditingName(false)
                      }
                    }}
                    className="h-7 rounded-md border border-primary/40 bg-input px-2 text-lg font-bold text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    maxLength={30}
                  />
                  <Button
                    type="submit"
                    variant="ghost"
                    size="icon"
                    className="size-7 text-primary hover:text-primary"
                  >
                    <Check className="size-4" />
                    <span className="sr-only">Guardar nombre</span>
                  </Button>
                </form>
              ) : (
                <button
                  onClick={() => {
                    setNameInput(appName)
                    setEditingName(true)
                  }}
                  className="group flex items-center gap-1.5"
                  aria-label="Editar nombre de la aplicacion"
                >
                  <h1 className="truncate text-lg font-bold text-foreground leading-tight">
                    {appName}
                  </h1>
                  <Pencil className="size-3 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                </button>
              )}
              {cursoActivo && (
                <p className="text-xs text-muted-foreground">{cursoActivo}</p>
              )}
            </div>
          </div>

          {cursoActivo && (
            <div className="ml-auto">
              <span className="text-xs text-muted-foreground font-mono">
                {cursos[cursoActivo]?.alumnos.reduce((sum, a) => sum + a.xp, 0)} XP total
              </span>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
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
          <Tabs defaultValue="ranking" className="space-y-6">
            <TabsList className="bg-secondary w-full grid grid-cols-3">
              <TabsTrigger value="ranking" className="gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Trophy className="size-4" />
                <span className="hidden sm:inline">Ranking</span>
              </TabsTrigger>
              <TabsTrigger value="subasta" className="gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Gavel className="size-4" />
                <span className="hidden sm:inline">Subasta</span>
              </TabsTrigger>
              <TabsTrigger value="historial" className="gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <ScrollText className="size-4" />
                <span className="hidden sm:inline">Historial</span>
              </TabsTrigger>
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
                    setSubasta((prev) => ({ ...prev, ...updates }))
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
