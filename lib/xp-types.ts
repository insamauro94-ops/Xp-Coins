export interface Alumno {
  id: string
  nombre: string
  xp: number
}

export interface Curso {
  nombre: string
  alumnos: Alumno[]
}

export interface HistorialEntry {
  mensaje: string
  fecha: string
}

export interface SubastaState {
  item: string
  activa: boolean
  mejorOferta: number
  ganador: string | null
}

export type CursosState = {
  [curso: string]: Curso
}