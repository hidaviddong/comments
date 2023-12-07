import { useQuery } from '@tanstack/react-query'

import { supabase } from '@/supabaseClient'

async function getCommentsById(tooltip_id: string) {
  const { data } = await supabase.from('comments').select('*').eq('tooltip_id', tooltip_id)
  return data
}

export function useCommentsQuery(tooltip_id: string) {
  const queryKey = ['comments', tooltip_id]
  const shouldEnable = tooltip_id.startsWith('CLIENT')
  const queryFn = async () => {
    return getCommentsById(tooltip_id)
  }

  return useQuery({ queryKey, queryFn, enabled: !shouldEnable })
}
