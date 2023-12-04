import { useAtomValue } from 'jotai'

import { Button } from '@/components/ui/button'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { authAtom } from '@/store'

import Login from './login'
import Register from './register'
export default function Auth() {
  const auth = useAtomValue(authAtom)

  return (
    <HoverCard>
      <HoverCardTrigger className="fixed bottom-1 left-1/2 -translate-x-1/2 transform">
        <Button>Login</Button>
      </HoverCardTrigger>
      <HoverCardContent>{auth === 'login' ? <Login /> : <Register />}</HoverCardContent>
    </HoverCard>
  )
}
