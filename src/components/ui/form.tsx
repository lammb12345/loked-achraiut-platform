import * as React from 'react'
import { Controller, FormProvider, useFormContext } from 'react-hook-form'
import type { ControllerProps, FieldPath, FieldValues } from 'react-hook-form'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

const Form = FormProvider

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = { name: TName }

const FormFieldContext = React.createContext<FormFieldContextValue>({} as FormFieldContextValue)

function FormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({ ...props }: ControllerProps<TFieldValues, TName>) {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  )
}

const FormItemContext = React.createContext<{ id: string }>({} as { id: string })

function FormItem({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const id = React.useId()
  return (
    <FormItemContext.Provider value={{ id }}>
      <div className={cn('space-y-2', className)} {...props} />
    </FormItemContext.Provider>
  )
}

function FormLabel({ className, ...props }: React.ComponentProps<typeof Label>) {
  const { id } = React.useContext(FormItemContext)
  const { name } = React.useContext(FormFieldContext)
  const { formState: { errors } } = useFormContext()
  const error = errors[name]
  return (
    <Label
      htmlFor={id}
      className={cn(error && 'text-destructive', className)}
      {...props}
    />
  )
}

function FormControl({ ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { id } = React.useContext(FormItemContext)
  const { name } = React.useContext(FormFieldContext)
  const { formState: { errors } } = useFormContext()
  const error = errors[name]
  return (
    <div
      id={id}
      aria-invalid={!!error}
      {...props}
    />
  )
}

function FormMessage({ className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  const { name } = React.useContext(FormFieldContext)
  const { formState: { errors } } = useFormContext()
  const error = errors[name]
  const body = error ? String(error?.message ?? '') : children
  if (!body) return null
  return (
    <p className={cn('text-sm font-medium text-destructive', className)} {...props}>
      {body}
    </p>
  )
}

export { Form, FormField, FormItem, FormLabel, FormControl, FormMessage }
