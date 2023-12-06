import { useQuery } from '@tanstack/react-query'
import { useAtomValue } from 'jotai'

import { sessionAtom } from '@/store'
import { supabase } from '@/supabaseClient'

async function getProfileById(profile_id: string) {
  const { data } = await supabase.from('profiles').select('*').eq('profile_id', profile_id)
  return data
}

export function useProfileQuery() {
  const session = useAtomValue(sessionAtom)
  const queryKey = ['profile']

  const queryFn = async () => {
    if (session?.user) {
      return getProfileById(session.user.id)
    }
  }

  return useQuery({ queryKey, queryFn, enabled: !!session })
}
