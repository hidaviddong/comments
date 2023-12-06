import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { commentsService } from '@/api'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'

const LoginFormSchema = z.object({
  email: z.string().email(),
  password: z.string()
})
type LoginFormSchemaType = z.infer<typeof LoginFormSchema>
export default function Login() {
  const { toast } = useToast()
  const registerForm = useForm<LoginFormSchemaType>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  async function onLoginFormSubmit(formData: LoginFormSchemaType) {
    const { data, error } = await commentsService.login(formData.email, formData.password)
    if (data.user) {
      toast({
        title: 'Login Success!'
      })
    }
    if (error) {
      toast({
        variant: 'destructive',
        title: 'Login Failure! Please try again!'
      })
    }
  }
  return (
    <Form {...registerForm}>
      <form onSubmit={registerForm.handleSubmit(onLoginFormSubmit)} className="space-y-2">
        <FormField
          control={registerForm.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="hi@daviddong.me" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={registerForm.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input {...field} type="password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full rounded-full">
          Sign In
        </Button>
      </form>
    </Form>
  )
}
