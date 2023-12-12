import { useMutation } from '@tanstack/react-query'

import { useToast } from '@/components/ui/use-toast'
import { supabase } from '@/supabaseClient'

export function useSignOut() {
  const { toast } = useToast()
  return useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.signOut()
      if (error) {
        toast({
          variant: 'destructive',
          title: 'Oops, Sign out Error, Please try again later!'
        })
      }
    }
  })
}
