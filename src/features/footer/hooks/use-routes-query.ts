import { useQuery } from '@tanstack/react-query'

import { supabase } from '@/supabaseClient'

async function getRoutesById(project_id: string) {
  const { data } = await supabase.from('routes').select('*').eq('project_id', project_id)
  return data
}

export function useRoutesQuery(project_id: string) {
  const queryKey = ['routes', project_id]

  const queryFn = async () => {
    return getRoutesById(project_id)
  }
  return useQuery({ queryKey, queryFn })
}
