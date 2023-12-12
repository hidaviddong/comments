import { useMutation } from '@tanstack/react-query'

import { useToast } from '@/components/ui/use-toast'
import { supabase } from '@/supabaseClient'

type Platform = 'github'

export function useOAuthSign() {
  const { toast } = useToast()
  return useMutation({
    mutationFn: async (platform: Platform) => {
      const { data } = await supabase.auth.signInWithOAuth({
        provider: platform
      })
      return data
    },

    onSuccess(data, variables, context) {
      console.log(data, variables, context)
    },
    onError() {
      toast({
        variant: 'destructive',
        title: 'Oops, Sign Error, Please try again later!'
      })
    }
  })
}
