export type Curso = string

export interface Alumno {
  id: string
  nombre: string
  xp: number
}

export interface HistorialEntry {
  mensaje: string
  fecha: string
}

export interface SubastaState {
  premio: string
  pujaActual: number
  incremento: number
  ganadorIdx: number | null
  activa?: boolean
}