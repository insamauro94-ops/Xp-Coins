import { supabase } from '@/lib/supabase'

export default async function Home() {
  const { data: students, error } = await supabase
    .from('students')
    .select('*')

  if (error) {
    return <div>Error: {error.message}</div>
  }

  return (
    <div>
      <h1>Lista de Students</h1>
      <pre>{JSON.stringify(students, null, 2)}</pre>
    </div>
  )
}