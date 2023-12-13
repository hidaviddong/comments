import { useQuery } from '@tanstack/react-query'
import { useAtomValue } from 'jotai'

import { sessionAtom } from '@/store'
import { supabase } from '@/supabaseClient'

async function getProject() {
  const { data: projectsData } = await supabase.from('projects').select('project_id, project_name')
  return projectsData
}

export function useProjectQuery() {
  const session = useAtomValue(sessionAtom)
  const queryKey = ['projects']
  return useQuery({ queryKey, queryFn: getProject, enabled: !!session })
}
