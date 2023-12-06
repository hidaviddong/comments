import { useQuery } from '@tanstack/react-query'

import { supabase } from '@/supabaseClient'

async function getCommentsById(profile_id: string, tooltip_id: string) {
  const { data } = await supabase.from('comments').select('*').eq('profile_id', profile_id).eq('tooltip_id', tooltip_id)
  return data
}

export function useCommentsQuery(profile_id: string, tooltip_id: string) {
  const queryKey = ['comments', profile_id, tooltip_id]

  const queryFn = async () => {
    return getCommentsById(profile_id, tooltip_id)
  }

  return useQuery({ queryKey, queryFn })
}
