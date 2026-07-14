import { Button as HeadlessButton } from '@headlessui/react'
import type { ComponentPropsWithoutRef } from 'react'
import { cn } from '@/lib/utils'

type ButtonProps = ComponentPropsWithoutRef<'button'>

export default function Button({
  className,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <HeadlessButton
      type={type}
      className={cn(
        'inline-flex items-center gap-2 rounded-md bg-neutral-700 px-3 py-1.5 text-sm/6 font-semibold text-white inset-shadow-sm inset-shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-neutral-600 data-open:bg-neutral-700',
        className,
      )}
      {...props}
    />
  )
}
