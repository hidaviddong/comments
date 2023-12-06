import { zodResolver } from '@hookform/resolvers/zod'
import { useAtom } from 'jotai'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { commentsService } from '@/api'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { authAtom } from '@/store'

const LoginFormSchema = z.object({
  email: z.string().email(),
  password: z.string()
})
type LoginFormSchemaType = z.infer<typeof LoginFormSchema>
export default function Login() {
  const { toast } = useToast()
  const [, setAuthAtom] = useAtom(authAtom)
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
      // 查询信息
    }
    if (error) {
      toast({
        variant: 'destructive',
        title: 'Login Failure! Please try again!'
      })
    }
  }
  function handleRegisterClick() {
    setAuthAtom('register')
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
        <Button type="submit">Login</Button>
        <Button variant="ghost" onClick={handleRegisterClick}>
          Register
        </Button>
      </form>
    </Form>
  )
}
