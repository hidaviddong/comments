import { useQuery } from '@tanstack/react-query'
import { useAtomValue } from 'jotai'

import { sessionAtom } from '@/store'
import { supabase } from '@/supabaseClient'

async function getProfilesById(profile_id: string) {
  const { data: profileData } = await supabase.from('profiles').select('profile_info').eq('profile_id', profile_id)

  if (!profileData || profileData.length === 0) {
    return []
  }
  return profileData
}

export function useProfilesQuery() {
  const session = useAtomValue(sessionAtom)
  const queryKey = ['profiles', session?.user.id]

  const queryFn = async () => {
    if (session?.user) {
      return getProfilesById(session.user.id)
    }
  }
  return useQuery({ queryKey, queryFn, enabled: !!session })
}
