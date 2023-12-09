import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { useAtom, useAtomValue } from 'jotai'
import { FolderOpenDot, Mail } from 'lucide-react'
import { type SVGProps, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { commentsService } from '@/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/components/ui/use-toast'
import { currentProjectAtom, isOpenAtom, sessionAtom } from '@/store'
import { supabase } from '@/supabaseClient'

import { useAuth } from '../page/hooks'
import Login from './components/login'
import Register from './components/register'
import { useProjectProfilesQuery } from './hooks'

const ProjectFormSchema = z.object({
  project_name: z
    .string()
    .min(1, { message: 'Please provide a project name.' })
    .max(15, { message: 'Project name should be under 15 characters.' })
})

type ProjectFormSchemaType = z.infer<typeof ProjectFormSchema>

export function IconamoonCommentAdd(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.5 2V0H7V2H5.5ZM0.96967 2.03033L2.46967 3.53033L3.53033 2.46967L2.03033 0.96967L0.96967 2.03033ZM4.24592 4.24592L4.79515 5.75631L7.79516 14.0063L8.46663 15.8529L9.19636 14.0285L10.2739 11.3346L13.4697 14.5303L14.5303 13.4697L11.3346 10.2739L14.0285 9.19636L15.8529 8.46663L14.0063 7.79516L5.75631 4.79516L4.24592 4.24592ZM11.6471 8.53337L10.1194 9.14447C9.6747 9.32235 9.32235 9.6747 9.14447 10.1194L8.53337 11.6471L6.75408 6.75408L11.6471 8.53337ZM0 7H2V5.5H0V7Z"
        fill="currentColor"></path>
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
      <div className="flex w-full items-center justify-center">
        <Mail
          className="h-8 w-8 p-1 text-2xl text-white hover:rounded-lg hover:bg-gray-600"
          onClick={() => setShowSignForm(!showSignForm)}
        />
      </div>
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
function ToolFooter() {
  const [isUserOpen, setIsUserOpen] = useState(false)
  const [showCreateProject, setShowCreateProject] = useState(false)
  const [isOpen, setIsOpen] = useAtom(isOpenAtom)
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const [currentProject, setCurrentProject] = useAtom(currentProjectAtom)
  const { data: projectsData, refetch: refetchProjectsData } = useProjectProfilesQuery()
  const session = useAuth()
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

export default function Footer() {
  const session = useAtomValue(sessionAtom)
  return (
    <div className="fixed bottom-4 left-1/2 flex h-12 w-72 -translate-x-1/2 transform items-center justify-around rounded-3xl border bg-zinc-900 shadow-lg shadow-black/40">
      <div className="flex h-full cursor-pointer items-center justify-center space-x-2 text-sm">
        {session ? <ToolFooter /> : <SignFooter />}
      </div>
    </div>
  )
}
