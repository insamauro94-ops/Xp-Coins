import { StudentClassView } from "@/components/student-class-view"

interface PageProps {
  params: Promise<{
    curso: string
  }>
}

export default async function AlumnoClasePage({ params }: PageProps) {

  const { curso } = await params

  return <StudentClassView curso={curso} />

}