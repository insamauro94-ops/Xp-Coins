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
}

export interface CursoData {
  alumnos: Alumno[]
  historial: HistorialEntry[]
}