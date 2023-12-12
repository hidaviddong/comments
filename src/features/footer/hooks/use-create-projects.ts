import { QueryData } from '@supabase/supabase-js'
import { useMutation } from '@tanstack/react-query'
import { useAtomValue } from 'jotai'
import type { OverrideProperties } from 'type-fest'

import { toast } from '@/components/ui/use-toast'
import { sessionAtom } from '@/store'
import { supabase } from '@/supabaseClient'

import { useProjectProfilesQuery } from '.'

export async function checkProjectExist(project_name: string) {
  const { data, error } = await supabase.from('projects').select('project_id').eq('project_name', project_name)
  if (error) {
    toast({
      variant: 'destructive',
      title: 'Error searching for project. Please try again!'
    })
    return true
  } else {
    if (data.length > 0) {
      toast({
        variant: 'destructive',
        title: 'Project with this name already exists!'
      })
      return true
    }
  }
  return false
}

function useCreateProfileProject() {
  const { refetch: refetchProjectData } = useProjectProfilesQuery()
  return useMutation({
    mutationFn: async ({ project_id, profile_id }: { project_id: string; profile_id: string }) => {
      const { data, error } = await supabase.from('project_profiles').insert({
        project_id,
        profile_id
      })
      if (error) {
        toast({
          variant: 'destructive',
          title: 'Create Project Fail! Please try again!'
        })
      }
      refetchProjectData()
      return data
    },
    onSuccess() {
      toast({
        title: 'Craete Project Success!'
      })
    }
  })
}
const projectQuery = supabase.from('projects').select()

type ProjectType = OverrideProperties<
  QueryData<typeof projectQuery>[number],
  {
    project_id: string
    project_name: string
  }
>[]

export function useCreateProject() {
  const session = useAtomValue(sessionAtom)
  const { mutate: createProfileProjectMutate } = useCreateProfileProject()
  return useMutation({
    mutationFn: async (project_name: string) => {
      const { data, error } = await supabase.from('projects').insert({ project_name }).select().returns<ProjectType>()
      if (error) {
        toast({
          variant: 'destructive',
          title: 'Create Project Fail! Please try again!'
        })
      }
      return data
    },
    onSuccess(data) {
      if (data && session) {
        const newProjectId = data[0].project_id
        createProfileProjectMutate({
          project_id: newProjectId,
          profile_id: session.user.id
        })
      }
    }
  })
}
