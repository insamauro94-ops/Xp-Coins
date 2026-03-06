import { StudentView } from "@/components/student-view"

interface PageProps {
  params: Promise<{ curso: string; alumno: string }>
}

export default async function AlumnoPage({ params }: PageProps) {
  const { curso, alumno } = await params
  return <StudentView curso={curso} alumno={alumno} />
}
