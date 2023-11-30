import { useAtom } from 'jotai'
import { useEffect } from 'react'

import Page from './page'
import { sessionAtom } from './store'
import { supabase } from './supabaseClient'
export default function App() {
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
  }, [session, setSession])

  return <Page />
}
