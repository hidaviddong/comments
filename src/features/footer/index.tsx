// import { useQuery } from '@tanstack/react-query'
import { useAtom, useAtomValue } from 'jotai'
import type { SVGProps } from 'react'

import { commentsService } from '@/api'
import { useToast } from '@/components/ui/use-toast'
import { isOpenAtom, sessionAtom } from '@/store'

// import Auth from './components/auth'

export function IconamoonCommentAdd(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <path
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M12 21a9 9 0 1 0-9-9c0 1.488.36 2.891 1 4.127L3 21l4.873-1c1.236.64 2.64 1 4.127 1Zm0-11.999v6m-3-3h6"></path>
    </svg>
  )
}

export function MaterialSymbolsLogin(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="M12 21v-2h7V5h-7V3h7q.825 0 1.413.588T21 5v14q0 .825-.587 1.413T19 21h-7Zm-2-4l-1.375-1.45l2.55-2.55H3v-2h8.175l-2.55-2.55L10 7l5 5l-5 5Z"></path>
    </svg>
  )
}

export function MaterialSymbolsLogout(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="M5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h7v2H5v14h7v2H5Zm11-4l-1.375-1.45l2.55-2.55H9v-2h8.175l-2.55-2.55L16 7l5 5l-5 5Z"></path>
    </svg>
  )
}

export default function Footer() {
  const session = useAtomValue(sessionAtom)
  // const { data: profile } = useQuery({
  //   queryKey: ['profile'],
  //   queryFn: () => commentsService.getProjects(),
  //   enabled: !!session
  // })
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useAtom(isOpenAtom)
  async function handleLogoutClick() {
    const { error } = await commentsService.logout()
    if (error) {
      toast({
        variant: 'destructive',
        title: 'Signout fail, Please try again!'
      })
    }
  }
  return (
    <>
      <div className="fixed bottom-1 left-1/2 flex h-12 w-80 -translate-x-1/2 transform items-center justify-around rounded-full border bg-stone-800 shadow-sm">
        <div className="flex h-full cursor-pointer items-center justify-center space-x-2 text-sm">
          {session ? (
            <>
              <IconamoonCommentAdd
                className="h-8 w-8 p-1 text-2xl text-white hover:rounded-lg hover:bg-gray-600"
                onClick={() => setIsOpen(!isOpen)}
              />
              <MaterialSymbolsLogout
                className="h-8 w-8 p-1 text-2xl text-white hover:rounded-lg hover:bg-gray-600"
                onClick={handleLogoutClick}
              />
            </>
          ) : (
            <>
              <MaterialSymbolsLogin className="h-8 w-8 p-1 text-2xl text-white hover:rounded-lg hover:bg-gray-600" />
              <span className="text-white">Login in to comment</span>
            </>
          )}
        </div>
      </div>
    </>
  )
}
