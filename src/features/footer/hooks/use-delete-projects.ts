import { useMutation } from '@tanstack/react-query'

import { toast } from '@/components/ui/use-toast'
import { supabase } from '@/supabaseClient'

import { useProjectProfilesQuery } from '.'

export function useDeleteProject() {
  const { refetch: refetchProjectData } = useProjectProfilesQuery()
  return useMutation({
    mutationFn: async (project_id: string) => {
      const { data, error } = await supabase.from('projects').delete().eq('project_id', project_id)
      if (error) {
        toast({
          variant: 'destructive',
          title: 'Delete Project Fail! Please try again later'
        })
      }
      refetchProjectData()
      return data
    },
    onSuccess() {
      toast({
        title: 'Delete Project Success!'
      })
    }
  })
}
