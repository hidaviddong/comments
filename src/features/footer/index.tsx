import { useQueryClient } from '@tanstack/react-query'
import { useAtom, useAtomValue } from 'jotai'
import { Mail } from 'lucide-react'
import { type SVGProps, useState } from 'react'

import { commentsService } from '@/api'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/components/ui/use-toast'
import { currentProjectAtom, currentRouteAtom, isOpenAtom, sessionAtom } from '@/store'

import { useTooltipsQuery } from '../page/hooks'
import Login from './components/login'
import Register from './components/register'
import { useProjectProfilesQuery, useRoutesQuery } from './hooks'

export function IconamoonCommentAdd(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
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

function SignFooter() {
  const [showSignForm, setShowSignForm] = useState(false)
  return (
    <>
      <Mail className="mr-2 h-6 w-6 p-1 text-2xl text-white" onClick={() => setShowSignForm(!showSignForm)} />
      {showSignForm && (
        <Tabs
          defaultValue="Sign In"
          style={{ bottom: '60px' }}
          className="absolute right-0 w-full rounded-lg border p-4 shadow-lg">
          <TabsList className="w-full rounded-full">
            <TabsTrigger value="Sign In" className="w-48 rounded-full">
              Sign In
            </TabsTrigger>
            <TabsTrigger value="Sign Up" className="w-48 rounded-full">
              Sign Up
            </TabsTrigger>
          </TabsList>
          <TabsContent value="Sign In">
            <Login />
          </TabsContent>
          <TabsContent value="Sign Up">
            <Register />
          </TabsContent>
        </Tabs>
      )}
    </>
  )
}
export default function Footer() {
  const [showSignForm, setShowSignForm] = useState(false)
  const session = useAtomValue(sessionAtom)
  const [, setCurrentProject] = useAtom(currentProjectAtom)
  const [, setCurrentRoute] = useAtom(currentRouteAtom)
  const { data } = useProjectProfilesQuery()
  const { data: routesData } = useRoutesQuery()
  const { data: tooltipsData } = useTooltipsQuery()
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useAtom(isOpenAtom)
  async function handleLogoutClick() {
    setIsOpen(!isOpen)
    const { error } = await commentsService.logout()
    if (error) {
      toast({
        variant: 'destructive',
        title: 'Signout fail, Please try again!'
      })
    }
  }
  return (
    <div className="fixed bottom-1 left-1/2 flex h-12 w-80 -translate-x-1/2 transform items-center justify-around rounded-full border bg-black shadow-sm">
      <div className="flex h-full cursor-pointer items-center justify-center space-x-2 text-sm">
        {session ? (
          <>
            <IconamoonCommentAdd
              className="h-8 w-8 p-1 text-2xl text-white hover:rounded-lg hover:bg-gray-600"
              onClick={() => {
                if (isOpen) {
                  queryClient.invalidateQueries({
                    queryKey: ['tooltips']
                  })
                }
                setIsOpen(!isOpen)
              }}
            />
            <MaterialSymbolsLogout
              className="h-8 w-8 p-1 text-2xl text-white hover:rounded-lg hover:bg-gray-600"
              onClick={handleLogoutClick}
            />
            <HoverCard>
              <HoverCardTrigger className="">
                <div className="flex h-8 w-8 items-center justify-center rounded-full border bg-gray-100 text-center">
                  D
                </div>
              </HoverCardTrigger>
              {data && (
                <HoverCardContent className="mb-2 mr-24">
                  <div>Projects</div>
                  <div>
                    {data[0].project_profiles.map((project) => (
                      <li
                        onClick={() => {
                          setCurrentProject(project.project_id)
                        }}
                        key={project.project_id}>
                        {project.project_id}
                      </li>
                    ))}
                  </div>
                  <Separator />
                  <div>Routes</div>
                  <div>
                    {routesData?.map((route) => (
                      <li
                        onClick={() => {
                          setCurrentRoute(route.route_id)
                        }}
                        key={route.route_id}>
                        {route.route_name}
                      </li>
                    ))}
                  </div>
                  <Separator />
                  <div>Tooltips</div>
                  <div>{tooltipsData?.map((tooltips) => <li key={tooltips.tooltip_id}>{tooltips.tooltip_id}</li>)}</div>
                  <Separator />
                  <div>Comments</div>
                </HoverCardContent>
              )}
            </HoverCard>
          </>
        ) : (
          <SignFooter />
        )}
      </div>
    </div>
  )
}
