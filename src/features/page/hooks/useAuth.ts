import { useAtom } from 'jotai'
import { useEffect } from 'react'

import { sessionAtom } from '@/store'
import { supabase } from '@/supabaseClient'

export function useAuth() {
  const [session, setSession] = useAtom(sessionAtom)
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])
  return session
}
