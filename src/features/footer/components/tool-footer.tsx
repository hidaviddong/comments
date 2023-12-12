/* eslint-disable @typescript-eslint/ban-ts-comment */
import { zodResolver } from '@hookform/resolvers/zod'
import { Session } from '@supabase/supabase-js'
import { useQueryClient } from '@tanstack/react-query'
import { useAtom } from 'jotai'
import { FolderOpenDot } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { commentsService } from '@/api'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { IconamoonCommentAdd, MaterialSymbolsLogout } from '@/components/ui/icons'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/components/ui/use-toast'
import { currentProjectAtom, isOpenAtom } from '@/store'
import { supabase } from '@/supabaseClient'

import { useProfilesQuery, useProjectProfilesQuery } from '../hooks'

const ProjectFormSchema = z.object({
  project_name: z
    .string()
    .min(1, { message: 'Please provide a project name.' })
    .max(15, { message: 'Project name should be under 15 characters.' })
})

type ProjectFormSchemaType = z.infer<typeof ProjectFormSchema>

export default function ToolFooter({ session }: { session: Session | null }) {
  const [isUserOpen, setIsUserOpen] = useState(false)
  const [showCreateProject, setShowCreateProject] = useState(false)
  const [isOpen, setIsOpen] = useAtom(isOpenAtom)
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const [currentProject, setCurrentProject] = useAtom(currentProjectAtom)
  const { data: projectsData, refetch: refetchProjectsData } = useProjectProfilesQuery()
  const { data: profileData } = useProfilesQuery()

  const projectForm = useForm<ProjectFormSchemaType>({
    resolver: zodResolver(ProjectFormSchema),
    defaultValues: {
      project_name: ''
    }
  })
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
  async function onProjectFormSubmit({ project_name }: ProjectFormSchemaType) {
    // 先查找是否有重名的项目
    const { data, error: searchError } = await supabase
      .from('projects')
      .select('project_id')
      .eq('project_name', project_name)

    if (searchError) {
      console.error('Error searching project:', searchError.message)
      toast({
        variant: 'destructive',
        title: 'Error searching for project. Please try again!'
      })
      return
    }

    if (data.length > 0) {
      // 如果找到了重名的项目，不允许创建并显示提示
      toast({
        variant: 'destructive',
        title: 'Project with this name already exists!'
      })
      return
    }
    const { data: newProjectData, error } = await supabase.from('projects').insert({ project_name }).select()

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Create Project Fail! Please try again!'
      })
    } else {
      if (newProjectData) {
        const newProjectId = newProjectData[0].project_id
        const { error } = await supabase.from('project_profiles').insert({
          project_id: newProjectId,
          profile_id: session!.user.id
        })
        if (error) {
          toast({
            variant: 'destructive',
            title: 'Create Project Fail! Please try again!'
          })
        } else {
          toast({
            title: 'Craete Project Success!'
          })
          await refetchProjectsData()
          setShowCreateProject(false)
          projectForm.reset()
        }
      }
    }
  }

  return (
    <>
      <IconamoonCommentAdd
        className={`h-8 w-8 p-1 text-2xl text-white hover:rounded-lg hover:bg-blue-500 ${
          isOpen ? 'rounded-lg bg-blue-500 ' : ''
        }`}
        onClick={() => {
          if (isOpen) {
            queryClient.invalidateQueries({
              queryKey: ['tooltips']
            })
          }
          setIsOpen(!isOpen)
        }}
      />
      {profileData && (
        <Avatar className="h-8 w-8">
          {/*  */}
          {/* @ts-ignore */}
          <AvatarImage src={profileData[0].profile_info.avatar_url} alt={profileData[0].profile_info.full_name} />
        </Avatar>
      )}
      <FolderOpenDot
        onClick={() => setIsUserOpen(!isUserOpen)}
        className="flex h-8 w-8 items-center justify-center p-1 text-center text-white hover:rounded-lg hover:bg-gray-600"></FolderOpenDot>
      <MaterialSymbolsLogout
        className="h-8 w-8 p-1 text-2xl text-white hover:rounded-lg hover:bg-gray-600"
        onClick={handleLogoutClick}
      />
      {isUserOpen && projectsData && (
        <Card className="absolute bottom-14  w-[300px] shadow-lg">
          <CardHeader>
            <CardTitle>Projects</CardTitle>
            <CardDescription>Select or Create your new project.</CardDescription>
          </CardHeader>
          <CardContent>
            {showCreateProject ? (
              <Form {...projectForm}>
                <form>
                  <FormField
                    control={projectForm.control}
                    name="project_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            ) : (
              <select
                value={currentProject === '' ? 'Please select your projects' : currentProject}
                onChange={(e) => {
                  const value = e.target.value
                  setCurrentProject(value)
                }}
                className="text-md block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900">
                <option value="Please select your projects" disabled>
                  Please select your projects
                </option>
                {projectsData.map((project) => (
                  <option key={project.project_id} value={project.project_id}>
                    {project.project_name}
                  </option>
                ))}
              </select>
            )}
          </CardContent>

          <Separator />
          {!showCreateProject ? (
            <CardFooter className="mt-2 flex items-center justify-around">
              <Button
                className="rounded-full"
                variant="destructive"
                onClick={async () => {
                  const { data, error } = await supabase
                    .from('project_profiles')
                    .delete()
                    .eq('project_id', currentProject)
                    .eq('profile_id', session!.user.id)
                    .select()
                  if (error) {
                    console.error(error)
                  }
                  if (data) {
                    await supabase.from('projects').delete().eq('project_id', data[0].project_id)
                    await queryClient.invalidateQueries({ queryKey: ['project_profiles', session?.user.id] })
                  }
                }}>
                Delete
              </Button>
              <span>or</span>
              <Button className="rounded-full" onClick={() => setShowCreateProject(true)}>
                Create
              </Button>
            </CardFooter>
          ) : (
            <CardFooter className="mt-2 flex justify-between">
              <Button className="rounded-full" variant="secondary" onClick={() => setShowCreateProject(false)}>
                Back
              </Button>
              <Button className="rounded-full" onClick={projectForm.handleSubmit(onProjectFormSubmit)}>
                Create
              </Button>
            </CardFooter>
          )}
        </Card>
      )}
    </>
  )
}
