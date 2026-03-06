"use client"

import { Gavel, Zap, Crown, Timer, CircleDollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { CursoData, SubastaState } from "@/lib/xp-types"

interface AuctionSetupProps {
  subasta: SubastaState
  onUpdateSubasta: (updates: Partial<SubastaState>) => void
  onStart: (e: React.FormEvent) => void
}

export function AuctionSetup({
  subasta,
  onUpdateSubasta,
  onStart,
}: AuctionSetupProps) {
  return (
    <Card className="mx-auto max-w-lg border-border bg-card">
      <CardHeader className="space-y-0">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
            <Gavel className="size-5 text-primary" />
          </div>

          <div>
            <CardTitle className="text-foreground">
              Panel de Subastas
            </CardTitle>

            <CardDescription className="text-muted-foreground">
              Configura y lanza una subasta en vivo
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <form onSubmit={onStart} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Premio
            </label>

            <Input
              type="text"
              placeholder="Ej: Punto extra, Tarea libre..."
              value={subasta.premio}
              onChange={(e) =>
                onUpdateSubasta({ premio: e.target.value })
              }
              className="bg-input text-foreground"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Incremento por puja (XP)
            </label>

            <Input
              type="number"
              min={1}
              value={subasta.incremento}
              onChange={(e) =>
                onUpdateSubasta({
                  incremento: parseInt(e.target.value) || 10,
                })
              }
              className="bg-input text-foreground"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-base py-5"
          >
            <Zap className="mr-2 size-5" />
            COMENZAR SUBASTA
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

interface AuctionLiveProps {
  subasta: SubastaState
  timeLeft: number
  cursoData: CursoData
  onBid: (alumnoIdx: number) => void
  onFinish: () => void
}

export function AuctionLive({
  subasta,
  timeLeft,
  cursoData,
  onBid,
  onFinish,
}: AuctionLiveProps) {
  const isUrgent = timeLeft <= 5
  const isSold = timeLeft === 0

  const ganadorName =
    subasta.ganadorIdx !== null
      ? cursoData.alumnos[subasta.ganadorIdx]?.nombre
      : null

  return (
    <div className="space-y-6">
      <div
        className={`relative overflow-hidden rounded-2xl border-2 p-6 text-center md:p-10 ${
          isUrgent
            ? "border-destructive bg-destructive/5"
            : "border-primary bg-primary/5"
        }`}
      >
        <div className="relative z-10">
          <div className="mb-2 flex items-center justify-center gap-2">
            <Timer
              className={`size-5 ${
                isUrgent
                  ? "text-destructive"
                  : "text-muted-foreground"
              }`}
            />

            <span className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
              {isSold
                ? "Subasta Finalizada"
                : "Tiempo Restante"}
            </span>
          </div>

          <p
            className={`font-mono text-6xl font-black md:text-8xl ${
              isUrgent
                ? "text-destructive"
                : "text-foreground"
            }`}
          >
            {isSold
              ? "VENDIDO"
              : `00:${timeLeft < 10 ? `0${timeLeft}` : timeLeft}`}
          </p>

          <p className="mt-4 text-lg text-muted-foreground">
            {subasta.premio}
          </p>

          <div className="mt-6 flex items-center justify-center gap-3">
            <CircleDollarSign className="size-8 text-primary" />

            <span className="font-mono text-5xl font-black text-primary md:text-7xl">
              {subasta.pujaActual}
            </span>

            <span className="text-2xl font-bold text-primary/70">
              XP
            </span>
          </div>

          <div className="mt-4 flex items-center justify-center gap-2">
            <Crown className="size-5 text-primary" />

            <span className="text-muted-foreground">
              Líder:
            </span>

            <span className="font-bold text-primary">
              {ganadorName || "Nadie"}
            </span>
          </div>
        </div>
      </div>

      {!isSold && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {cursoData.alumnos.map((al, i) => {
            const canAfford =
              al.xp >= subasta.pujaActual + subasta.incremento

            const isLeader = subasta.ganadorIdx === i

            return (
              <Button
                key={i}
                onClick={() => onBid(i)}
                disabled={!canAfford}
                variant="ghost"
                className={`flex h-auto flex-col gap-1 rounded-xl border p-4 ${
                  isLeader
                    ? "border-primary bg-primary/10 text-primary"
                    : canAfford
                    ? "border-border bg-card text-foreground hover:bg-primary/5"
                    : "border-border bg-card/50 text-muted-foreground opacity-50"
                }`}
              >
                <span className="text-sm font-bold truncate max-w-full">
                  {al.nombre}
                </span>

                <Badge
                  className={`text-xs ${
                    isLeader
                      ? "bg-primary/20 text-primary"
                      : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {al.xp} XP
                </Badge>

                {canAfford && (
                  <span className="text-xs text-accent">
                    +{subasta.incremento}
                  </span>
                )}
              </Button>
            )
          })}
        </div>
      )}

      {isSold && (
        <Button
          onClick={onFinish}
          className="w-full bg-accent text-accent-foreground hover:bg-accent/90 py-6 text-lg font-black rounded-xl"
        >
          <Gavel className="mr-2 size-5" />
          COBRAR Y CERRAR
        </Button>
      )}
    </div>
  )
}