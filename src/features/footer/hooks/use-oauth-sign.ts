import { useMutation } from '@tanstack/react-query'

import { useToast } from '@/components/ui/use-toast'
import { supabase } from '@/supabaseClient'

type Platform = 'github'

export function useOAuthSign() {
  const { toast } = useToast()
  return useMutation({
    mutationFn: async (platform: Platform) => {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: platform
      })
      if (error) {
        toast({
          variant: 'destructive',
          title: 'Oops, Sign Error, Please try again later!'
        })
      }
      toast({
        variant: 'default',
        title: 'Sign Success! Redirect to the home page...'
      })
      return data
    }
  })
}
