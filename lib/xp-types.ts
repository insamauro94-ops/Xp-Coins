export interface Alumno {
  id?: string
  nombre: string
  xp: number
}

export interface CursoData {
  nombre: string
  alumnos: Alumno[]
}

export interface CursosState {
  [cursoNombre: string]: CursoData
}

export interface SubastaState {
  activa: boolean
  premio: string
  pujaActual: number
  incremento: number
  ganadorIdx: number | null
}

export interface HistorialEntry {
  fecha: string
  alumno: string
  accion: string
  xp: number
  curso: string
}