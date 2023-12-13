import { zodResolver } from '@hookform/resolvers/zod'
import { useAtom } from 'jotai'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { currentProjectAtom } from '@/store'

import { checkProjectExist, useCreateProject, useDeleteProject, useProjectQuery } from '../hooks'
const ProjectFormSchema = z.object({
  project_name: z
    .string()
    .min(1, { message: 'Please provide a project name.' })
    .max(15, { message: 'Project name should be under 15 characters.' })
})

type ProjectFormSchemaType = z.infer<typeof ProjectFormSchema>
interface ProjectCardProps {
  full_name: string
}
export default function ProjectCard({ full_name }: ProjectCardProps) {
  const [currentProject, setCurrentProject] = useAtom(currentProjectAtom)
  const { data: projectsData } = useProjectQuery()
  const { mutate: createProjectMutate } = useCreateProject()
  const { mutate: deleteProjectMutate } = useDeleteProject()
  const projectForm = useForm<ProjectFormSchemaType>({
    resolver: zodResolver(ProjectFormSchema),
    defaultValues: {
      project_name: ''
    }
  })
  async function onProjectFormSubmit({ project_name }: ProjectFormSchemaType) {
    const isProjectExist = await checkProjectExist(project_name)
    if (!isProjectExist) {
      createProjectMutate(project_name)
      projectForm.reset()
    }
  }
  return (
    <Card className="absolute bottom-14  w-[300px] shadow-lg">
      <CardHeader>
        <CardTitle>Hi, {full_name}!</CardTitle>
        <CardDescription>Please select a project</CardDescription>
      </CardHeader>
      <CardContent>
        <select
          value={currentProject === '' ? 'Please select your projects' : currentProject}
          onChange={(e) => {
            setCurrentProject(e.target.value)
          }}
          className="text-md block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900">
          <option value="Please select your projects" disabled>
            Please select your projects
          </option>
          {projectsData &&
            projectsData.map((project) => (
              <option key={project.project_id} value={project.project_id}>
                {project.project_name}
              </option>
            ))}
        </select>
        {!!currentProject && (
          <Button className="mt-2 w-full" variant="destructive" onClick={() => deleteProjectMutate(currentProject)}>
            Delete
          </Button>
        )}
        <div className="mt-2 h-8 w-full text-center">or</div>
        <Form {...projectForm}>
          <form>
            <FormField
              control={projectForm.control}
              name="project_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Create a new Project</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
      {projectForm.getFieldState('project_name').isDirty && (
        <CardFooter className="flex w-full items-center justify-center">
          <Button className="w-full" onClick={projectForm.handleSubmit(onProjectFormSubmit)}>
            Create
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
