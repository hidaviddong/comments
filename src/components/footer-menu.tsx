import { useQuery } from '@tanstack/react-query'
import { useAtom, useAtomValue } from 'jotai'

import { getProjects } from '@/api'
import { useMouseHover } from '@/hooks'
import { buttonTextAtom, isOpenAtom, sessionAtom } from '@/store'

import { supabase } from '../supabaseClient'
import Auth from './auth'
import { Button } from './ui/button'
import { useToast } from './ui/use-toast'
const FooterMenu = () => {
  useMouseHover()

  const session = useAtomValue(sessionAtom)
  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: () => getProjects(session?.user.id || ''),
    enabled: !!session
  })
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useAtom(isOpenAtom)
  const buttonText = useAtomValue(buttonTextAtom)
  async function handleLogoutClick() {
    const { error } = await supabase.auth.signOut()
    if (error) {
      toast({
        variant: 'destructive',
        title: 'Signout fail, Please try again!'
      })
    }
  }
  if (session) {
    return (
      <div className="fixed bottom-1 left-1/2 -translate-x-1/2 transform">
        <p>{JSON.stringify(profile)}</p>
        <Button onClick={() => setIsOpen(!isOpen)}>{buttonText}</Button>
        <Button onClick={handleLogoutClick}>Logout</Button>
      </div>
    )
  }
  return <Auth />
}

export default FooterMenu
