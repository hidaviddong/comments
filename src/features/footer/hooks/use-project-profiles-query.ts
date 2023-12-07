import { useQuery } from '@tanstack/react-query'
import { useAtomValue } from 'jotai'

import { sessionAtom } from '@/store'
import { supabase } from '@/supabaseClient'

async function getProjectProfilesById(profile_id: string) {
  // 1：从 project_profiles 表中获取所有匹配的 project_id
  const { data: projectProfilesData } = await supabase
    .from('project_profiles')
    .select('project_id')
    .eq('profile_id', profile_id)

  if (!projectProfilesData || projectProfilesData.length === 0) {
    return []
  }

  // 2：使用获取的 project_id 从 projects 表中查询 project_name
  const projectIds = projectProfilesData.map((pp) => pp.project_id)
  const { data: projectsData } = await supabase
    .from('projects')
    .select('project_id, project_name')
    .in('project_id', projectIds)

  return projectsData
}

export function useProjectProfilesQuery() {
  const session = useAtomValue(sessionAtom)
  const queryKey = ['project_profiles', session?.user.id]

  const queryFn = async () => {
    if (session?.user) {
      return getProjectProfilesById(session.user.id)
    }
  }
  return useQuery({ queryKey, queryFn, enabled: !!session })
}
