import { useForm } from '@inertiajs/react'
import { cn } from 'cn'
import { LoaderCircle } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<'form'>) {
  const { data, setData, post, processing, errors } = useForm({
    email: '',
    password: '',
  })

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    post('/login')
  }

  return (
    <form className={cn('flex flex-col gap-6', className)} onSubmit={submit} {...props}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Enter your email below to login to your account
          </p>
        </div>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            value={data.email}
            onChange={(event) => setData('email', event.target.value)}
            autoComplete="email"
            autoFocus
            aria-invalid={Boolean(errors.email)}
            required
          />
          {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
        </Field>
        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input
            id="password"
            type="password"
            value={data.password}
            onChange={(event) => setData('password', event.target.value)}
            autoComplete="current-password"
            aria-invalid={Boolean(errors.password)}
            required
          />
          {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
        </Field>
        <Field>
          <Button type="submit" disabled={processing}>
            {processing && <LoaderCircle className="animate-spin" />}
            {processing ? 'Logging in...' : 'Login'}
          </Button>
        </Field>
        {/* <Field>
          <a
            href="#"
            className="ml-auto text-center text-sm underline-offset-4 hover:underline"
          >
            Forgot your password?
          </a>
        </Field> */}
      </FieldGroup>
    </form>
  )
}
