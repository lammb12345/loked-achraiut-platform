import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { supabase } from '@/integrations/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { toast } from 'sonner'

const schema = z.object({
  full_name: z.string().min(2, 'שם חובה'),
  email: z.string().email('אימייל לא תקין'),
  password: z.string().min(6, 'סיסמה חייבת להיות לפחות 6 תווים'),
})

type FormData = z.infer<typeof schema>

interface SignupFormProps {
  onSuccess: () => void
}

export function SignupForm({ onSuccess }: SignupFormProps) {
  const form = useForm<FormData>({ resolver: zodResolver(schema) })

  async function onSubmit(data: FormData) {
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: { data: { full_name: data.full_name } },
    })
    if (error) {
      toast.error('שגיאה בהרשמה: ' + error.message)
    } else {
      toast.success('נשלח אימייל אישור — בדוק את תיבת הדואר')
      onSuccess()
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" dir="rtl">
        <FormField control={form.control} name="full_name" render={({ field }) => (
          <FormItem>
            <FormLabel>שם מלא</FormLabel>
            <FormControl><Input placeholder="ישראל ישראלי" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="email" render={({ field }) => (
          <FormItem>
            <FormLabel>אימייל</FormLabel>
            <FormControl><Input type="email" placeholder="you@example.com" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="password" render={({ field }) => (
          <FormItem>
            <FormLabel>סיסמה</FormLabel>
            <FormControl><Input type="password" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? 'נרשם...' : 'הרשמה'}
        </Button>
      </form>
    </Form>
  )
}
