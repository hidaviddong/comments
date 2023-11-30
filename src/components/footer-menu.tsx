import { useAtom, useAtomValue } from 'jotai'

import { useMouseHover } from '@/hooks'
import { buttonTextAtom, isOpenAtom, sessionAtom } from '@/store'

import { supabase } from '../supabaseClient'
import Auth from './auth'
import { Button } from './ui/button'
import { useToast } from './ui/use-toast'
const FooterMenu = () => {
  useMouseHover()
  const session = useAtomValue(sessionAtom)
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useAtom(isOpenAtom)
  const buttonText = useAtomValue(buttonTextAtom)
  async function handleLogoutClick() {
    const { error } = await supabase.auth.signOut()
    if (error) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem with your request.'
      })
    }
  }
  if (session) {
    return (
      <div className="fixed bottom-1 left-1/2 -translate-x-1/2 transform">
        <Button onClick={() => setIsOpen(!isOpen)}>{buttonText}</Button>
        <Button onClick={handleLogoutClick}>Logout</Button>
      </div>
    )
  }
  return <Auth />
}

export default FooterMenu
