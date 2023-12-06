import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { supabase } from '@/supabaseClient'
const RegisterFormSchema = z.object({
  email: z.string().email(),
  password: z.string()
})
type RegisterFormSchemaType = z.infer<typeof RegisterFormSchema>
export default function Register() {
  const { toast } = useToast()
  const registerForm = useForm<RegisterFormSchemaType>({
    resolver: zodResolver(RegisterFormSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  async function onAuthFormSubmit(formData: RegisterFormSchemaType) {
    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password
    })
    if (data.user) {
      toast({
        title: 'Please check your email!'
      })
    }
    if (error) {
      toast({
        variant: 'destructive',
        title: 'Register Failure! Please try again!'
      })
    }
  }
  return (
    <Form {...registerForm}>
      <form onSubmit={registerForm.handleSubmit(onAuthFormSubmit)} className="space-y-2">
        <FormField
          control={registerForm.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} />
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
          Sign Up
        </Button>
      </form>
    </Form>
  )
}
