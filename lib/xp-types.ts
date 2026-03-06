export interface Alumno {
  nombre: string
  xp: number
}

export interface CursoData {
  nombre: string
  alumnos: Alumno[]
}

export interface SubastaState {
  item: string
  incremento: number
  pujaActual: number
  ganadorIdx: number | null
}

export interface CursosState {
  [curso: string]: CursoData
}