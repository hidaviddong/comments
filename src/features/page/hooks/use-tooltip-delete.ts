import { useMutation } from '@tanstack/react-query'

import { toast } from '@/components/ui/use-toast'
import { supabase } from '@/supabaseClient'

import { useTooltipsQuery } from '.'

export function useTooltipDelete() {
  const { refetch } = useTooltipsQuery()
  return useMutation({
    mutationFn: async (tooltip_id: string) => {
      const { data, error } = await supabase.from('tooltips').delete().eq('tooltip_id', tooltip_id).select()
      if (error) {
        toast({
          variant: 'destructive',
          title: 'Delete Tooltip Fail! Please try again later'
        })
      } else {
        toast({
          title: 'Delete Tooltip Success!'
        })
        refetch()
        return data
      }
    }
  })
}
