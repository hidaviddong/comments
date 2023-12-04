import { useQuery } from '@tanstack/react-query'
import { useAtom, useAtomValue } from 'jotai'

import { commentsService } from '@/api'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { buttonTextAtom, isOpenAtom, sessionAtom } from '@/store'

import Auth from './components/auth'

export default function Footer() {
  const session = useAtomValue(sessionAtom)
  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: () => commentsService.getProjects(),
    enabled: !!session
  })
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useAtom(isOpenAtom)
  const buttonText = useAtomValue(buttonTextAtom)
  async function handleLogoutClick() {
    const { error } = await commentsService.logout()
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
