import { QueryData } from '@supabase/supabase-js'
import { useMutation } from '@tanstack/react-query'
import type { OverrideProperties } from 'type-fest'

import { toast } from '@/components/ui/use-toast'
import { supabase } from '@/supabaseClient'

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

const projectQuery = supabase.from('projects').select()

type ProjectType = OverrideProperties<
  QueryData<typeof projectQuery>[number],
  {
    project_id: string
    project_name: string
  }
>[]

export function useCreateProject() {
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
    onSuccess() {
      toast({
        title: 'Craete Project Success!'
      })
    }
  })
}
