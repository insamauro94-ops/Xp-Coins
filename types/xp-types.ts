export interface Alumno {
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
  premio: string
  pujaActual: number
  incremento: number
  ganadorIdx: number | null
  activa: boolean
}