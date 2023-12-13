import { useQueryClient } from '@tanstack/react-query'
import { useAtom } from 'jotai'
import { useState } from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { IconamoonCommentAdd, MaterialSymbolsLogout } from '@/components/ui/icons'
import { isOpenAtom } from '@/store'

import { useProfilesQuery, useProjectQuery, useSignOut } from '../hooks'
import ProjectCard from './project-card'

export default function ToolFooter() {
  const [isUserOpen, setIsUserOpen] = useState(false)
  const [isCommentOpen, setIsCommentOpen] = useAtom(isOpenAtom)
  const queryClient = useQueryClient()
  const { data: projectsData } = useProjectQuery()
  const { data: profileData } = useProfilesQuery()
  const { mutate: signOutMutate } = useSignOut()
  return (
    <>
      {profileData && (
        <>
          <Avatar className="h-8 w-8" onClick={() => setIsUserOpen(!isUserOpen)}>
            <AvatarImage src={profileData[0].profile_info.avatar_url} alt={profileData[0].profile_info.full_name} />
            <AvatarFallback>{profileData[0].profile_info.full_name[0]}</AvatarFallback>
          </Avatar>

          <IconamoonCommentAdd
            className={`h-8 w-8 p-1 text-2xl text-white hover:rounded-lg hover:bg-gray-600 ${
              isCommentOpen ? 'rounded-lg bg-blue-500 ' : ''
            } `}
            onClick={() => {
              setIsCommentOpen(!isCommentOpen)
              queryClient.invalidateQueries({
                queryKey: ['tooltips']
              })
            }}
          />
          <MaterialSymbolsLogout
            className="h-8 w-8 p-1 text-2xl text-white hover:rounded-lg hover:bg-gray-600"
            onClick={() => {
              signOutMutate()
              setIsCommentOpen(false)
              setIsUserOpen(false)
            }}
          />
          {isUserOpen && projectsData && <ProjectCard full_name={profileData[0].profile_info.full_name} />}
        </>
      )}
    </>
  )
}
