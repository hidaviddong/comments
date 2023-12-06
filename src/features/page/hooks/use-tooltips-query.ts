import { useQuery } from '@tanstack/react-query'

import { supabase } from '@/supabaseClient'

async function getTooltipsById(route_id: string) {
  const { data } = await supabase.from('tooltips').select('*').eq('route_id', route_id)
  return data
}

export function useTooltipsQuery(route_id: string) {
  const queryKey = ['tooltips', route_id]

  const queryFn = async () => {
    return getTooltipsById(route_id)
  }

  return useQuery({ queryKey, queryFn })
}

export default useTooltipsQuery
