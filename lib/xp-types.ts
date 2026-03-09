export interface HistorialEntry {
  fecha: string
  mensaje: string
}

export interface Alumno {
  id: string
  nombre: string
  xp: number
}

export interface CursoData {
  id: string
  alumnos: Alumno[]
  historial: HistorialEntry[]
  maxSupply: number
}

export interface CursosState {
  [curso: string]: CursoData
}

export interface SubastaState {
  activa: boolean
  item: string
  pujaActual: number
  ganadorIdx: number | null
  incremento: number
}