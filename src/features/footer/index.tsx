import { useAuth } from '../page/hooks'
import SignFooter from './components/sign-footer'
import ToolFooter from './components/tool-footer'

export default function Footer() {
  const session = useAuth()
  return (
    <div className="fixed bottom-4 left-1/2 flex h-12 w-72 -translate-x-1/2 transform items-center justify-around rounded-3xl border bg-zinc-900 shadow-lg shadow-black/40">
      <div className="flex h-full cursor-pointer items-center justify-center space-x-2 text-sm">
        {session ? <ToolFooter /> : <SignFooter />}
      </div>
    </div>
  )
}
