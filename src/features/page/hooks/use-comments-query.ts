import { QueryData } from '@supabase/supabase-js'
import { useQuery } from '@tanstack/react-query'
import type { OverrideProperties } from 'type-fest'

import { supabase } from '@/supabaseClient'
const commentsQuery = supabase.from('comments').select('*,profiles(*)')

type CommentType = OverrideProperties<
  QueryData<typeof commentsQuery>[number],
  {
    profiles: {
      profile_id: string
      profile_info: {
        avatar_url: string
        full_name: string
      }
    }
  }
>[]
async function getCommentsById(tooltip_id: string) {
  const { data } = await supabase
    .from('comments')
    .select('*,profiles(*)')
    .eq('tooltip_id', tooltip_id)
    .returns<CommentType>()
  return data
}

export function useCommentsQuery(tooltip_id: string) {
  const queryKey = ['comments', tooltip_id]
  const queryFn = async () => {
    return getCommentsById(tooltip_id)
  }
  return useQuery({ queryKey, queryFn })
}
