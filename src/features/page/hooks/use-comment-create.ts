import { useMutation } from '@tanstack/react-query'

import { toast } from '@/components/ui/use-toast'
import { supabase } from '@/supabaseClient'

import { useCommentsQuery, useTooltipsQuery } from '.'

export function useCommentCreate(tooltip_id: string) {
  const { refetch: refetchTooltips } = useTooltipsQuery()
  const { refetch: refetchComments } = useCommentsQuery(tooltip_id)
  return useMutation({
    mutationFn: async ({
      comment_content,
      tooltip_id,
      profile_id
    }: {
      comment_content: string
      tooltip_id: string
      profile_id: string
    }) => {
      const { data, error } = await supabase
        .from('comments')
        .insert({
          comment_content,
          tooltip_id,
          profile_id
        })
        .select()
      if (error) {
        toast({
          variant: 'destructive',
          title: `Leave comment fail! Please try again later`
        })
      }
      refetchTooltips()
      refetchComments()
      return data
    }
  })
}
