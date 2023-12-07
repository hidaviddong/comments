import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { Mail, User } from 'lucide-react'
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
function ToolFooter() {
  const [isUserOpen, setIsUserOpen] = useState(false)
  const [showCreateProject, setShowCreateProject] = useState(false)
  const [isOpen, setIsOpen] = useAtom(isOpenAtom)
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const setCurrentProject = useSetAtom(currentProjectAtom)
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
      <div
        onClick={() => setIsUserOpen(!isUserOpen)}
        className="flex h-8 w-8 items-center justify-center rounded-full border bg-gray-100 text-center">
        <User />
      </div>
      <MaterialSymbolsLogout
        className="h-8 w-8 p-1 text-2xl text-white hover:rounded-lg hover:bg-gray-600"
        onClick={handleLogoutClick}
      />

      {isUserOpen && projectsData && (
        <Card className="absolute bottom-14 right-2 w-[320px] shadow-lg">
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
                defaultValue="Please select your projects"
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
          {!showCreateProject ? (
            <CardFooter className="flex flex-col justify-center space-y-2">
              <Separator />
              <Button onClick={() => setShowCreateProject(true)}>Create Project</Button>
            </CardFooter>
          ) : (
            <CardFooter className="flex justify-between">
              <Button variant="secondary" onClick={() => setShowCreateProject(false)}>
                Back
              </Button>
              <Button onClick={projectForm.handleSubmit(onProjectFormSubmit)}>Create</Button>
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
    <div className="fixed bottom-1 left-1/2 flex h-12 w-80 -translate-x-1/2 transform items-center justify-around rounded-full border bg-black shadow-lg">
      <div className="flex h-full cursor-pointer items-center justify-center space-x-2 text-sm">
        {session ? <ToolFooter /> : <SignFooter />}
      </div>
    </div>
  )
}
