import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '@/lib/utils';

type ButtonProps = ComponentPropsWithoutRef<'button'>;

export default function Button({
    className,
    type = 'button',
    ...props
}: ButtonProps) {
    return (
        <button
            type={type}
            className={cn(
                'flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:opacity-60',
                className,
            )}
            {...props}
        />
    );
}
