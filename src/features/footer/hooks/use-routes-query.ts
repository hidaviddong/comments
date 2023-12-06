import { useQuery } from '@tanstack/react-query'
import { useAtomValue } from 'jotai'

import { currentProjectAtom } from '@/store'
import { supabase } from '@/supabaseClient'

async function getRoutesById(project_id: string) {
  const { data } = await supabase.from('routes').select('*').eq('project_id', project_id)
  return data
}

export function useRoutesQuery() {
  const currentProject = useAtomValue(currentProjectAtom)
  const queryKey = ['routes', currentProject]
  const queryFn = async () => {
    return getRoutesById(currentProject)
  }
  return useQuery({ queryKey, queryFn, enabled: !!currentProject })
}
