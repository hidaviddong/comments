import { QueryData } from '@supabase/supabase-js'
import { useQuery } from '@tanstack/react-query'
import { useAtomValue } from 'jotai'
import type { OverrideProperties } from 'type-fest'

import { sessionAtom } from '@/store'
import { supabase } from '@/supabaseClient'

const profilesQuery = supabase.from('profiles').select('profile_info')
type ProfilesType = OverrideProperties<
  QueryData<typeof profilesQuery>[number],
  {
    profile_info: {
      avatar_url: string
      full_name: string
    }
  }
>[]
async function getProfilesById(profile_id: string) {
  const { data: profileData } = await profilesQuery.eq('profile_id', profile_id).returns<ProfilesType>()
  return profileData
}

export function useProfilesQuery() {
  const session = useAtomValue(sessionAtom)
  const queryKey = ['profiles', session!.user.id]

  return useQuery({ queryKey, queryFn: () => getProfilesById(session!.user.id), enabled: !!session })
}
