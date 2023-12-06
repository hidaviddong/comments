import { useQuery } from '@tanstack/react-query'
import { useAtomValue } from 'jotai'

import { currentRouteAtom } from '@/store'
import { supabase } from '@/supabaseClient'

async function getTooltipsById(route_id: string) {
  const { data } = await supabase.from('tooltips').select('*').eq('route_id', route_id)
  return data
}

export function useTooltipsQuery() {
  const currentRoute = useAtomValue(currentRouteAtom)
  const queryKey = ['tooltips', currentRoute]

  const queryFn = async () => {
    return getTooltipsById(currentRoute)
  }

  return useQuery({ queryKey, queryFn, enabled: !!currentRoute })
}

export default useTooltipsQuery
