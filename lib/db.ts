import { supabase } from "./supabaseClient"

export async function getCursos() {

  const { data, error } = await supabase
    .from("cursos")
    .select(`
      id,
      nombre,
      alumnos(id,nombre,xp),
      historial(id,fecha,evento)
    `)

  if (error) {
    console.error("Error cargando cursos:", error)
    return {}
  }

  const cursos: any = {}

  data?.forEach((c: any) => {
    cursos[c.nombre] = {
      alumnos: c.alumnos || [],
      historial: c.historial || [],
      id: c.id
    }
  })

  return cursos
}

export async function crearCurso(nombre: string) {
  return supabase.from("cursos").insert({ nombre }).select()
}

export async function eliminarCurso(nombre: string) {
  return supabase.from("cursos").delete().eq("nombre", nombre)
}

export async function agregarAlumno(curso_id: string, nombre: string) {
  return supabase.from("alumnos").insert({
    curso_id,
    nombre,
    xp: 0
  }).select()
}

export async function eliminarAlumno(id: string) {
  return supabase.from("alumnos").delete().eq("id", id)
}

export async function modificarXP(id: string, xp: number) {
  return supabase.from("alumnos").update({ xp }).eq("id", id)
}

export async function agregarHistorial(curso_id: string, evento: string) {
  return supabase.from("historial").insert({
    curso_id,
    fecha: new Date().toLocaleTimeString(),
    evento
  })
}