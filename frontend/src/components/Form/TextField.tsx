import { Field, Input, Label } from '@headlessui/react'
import type { ComponentPropsWithoutRef } from 'react'
import { cn } from '@/lib/utils'

interface TextFieldProps extends ComponentPropsWithoutRef<'input'> {
  id: string
  label: string
  error?: string
}

export default function TextField({
  id,
  label,
  error,
  className,
  type = 'text',
  ...props
}: TextFieldProps) {
  return (
    <Field>
      <Label className="text-sm/6 font-medium text-white">{label}</Label>
      <Input
        id={id}
        name={props.name ?? id}
        type={type}
        invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn(
          'mt-3 block w-full rounded-lg border-none bg-white/5 px-3 py-1.5 text-sm/6 text-white scheme-dark placeholder:text-white/50',
          'focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-white/25',
          error &&
            'outline-2 -outline-offset-2 outline-red-500 data-focus:outline-red-500',
          className,
        )}
        {...props}
      />
      {error && (
        <p id={`${id}-error`} className="mt-2 text-sm text-red-400">
          {error}
        </p>
      )}
    </Field>
  )
}
