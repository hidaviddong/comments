import { useQuery } from '@tanstack/react-query'
import { useAtomValue } from 'jotai'

import { currentProjectAtom } from '@/store'
import { supabase } from '@/supabaseClient'

async function getTooltipsById(project_id: string) {
  const { data } = await supabase.from('tooltips').select('*').eq('project_id', project_id)
  return data
}

export function useTooltipsQuery() {
  const currentProject = useAtomValue(currentProjectAtom)
  const queryKey = ['tooltips', currentProject]

  const queryFn = async () => {
    return getTooltipsById(currentProject)
  }

  return useQuery({ queryKey, queryFn, enabled: !!currentProject })
}

export default useTooltipsQuery
