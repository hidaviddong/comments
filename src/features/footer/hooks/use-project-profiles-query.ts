import { useQuery } from '@tanstack/react-query'
import { useAtomValue } from 'jotai'

import { sessionAtom } from '@/store'
import { supabase } from '@/supabaseClient'

async function getProjectProfilesById(profile_id: string) {
  const { data } = await supabase
    .from('profiles')
    .select(
      `
    *,
    project_profiles (
      project_id
    )
  `
    )
    .eq('profile_id', profile_id)
  return data
}

export function useProjectProfilesQuery() {
  const session = useAtomValue(sessionAtom)
  const queryKey = ['project_profiles']

  const queryFn = async () => {
    if (session?.user) {
      return getProjectProfilesById(session.user.id)
    }
  }
  return useQuery({ queryKey, queryFn, enabled: !!session })
}
