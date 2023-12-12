import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSetAtom } from 'jotai'

import { toast } from '@/components/ui/use-toast'
import { tooltipAtom } from '@/store'
import { supabase } from '@/supabaseClient'

export async function checkTooltipExist({ x, y, project_id }: { x: number; y: number; project_id: string }) {
  if (project_id === '') {
    toast({
      variant: 'destructive',
      title: `You haven't selected your Project yet! Please click on the avatar to choose.`
    })
    return true
  }

  const { data, error } = await supabase.from('tooltips').select('*').eq('x', x).eq('y', y).eq('project_id', project_id)
  if (error) {
    toast({
      variant: 'destructive',
      title: 'Error searching for tooltip. Please try again!'
    })
    return true
  } else {
    if (data?.length === 0) {
      return false
    }
    return true
  }
}
export function useTooltipCreate() {
  const setTooltip = useSetAtom(tooltipAtom)
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ x, y, project_id }: { x: number; y: number; project_id: string }) => {
      const { data, error } = await supabase
        .from('tooltips')
        .insert({
          x,
          y,
          project_id
        })
        .select()
      if (error) {
        toast({
          variant: 'destructive',
          title: 'Create tooltip fail! Please try again'
        })
      }
      queryClient.invalidateQueries({ queryKey: ['tooltips', project_id] })
      setTooltip({
        project_id: '',
        tooltip_id: '',
        x: 0,
        y: 0
      })
      return data
    }
  })
}
