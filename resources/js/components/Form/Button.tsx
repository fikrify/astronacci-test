import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '@/lib/utils';

type ButtonVariant = 'primary' | 'secondary';

interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
    variant?: ButtonVariant;
}

const variantStyles: Record<ButtonVariant, string> = {
    primary:
        'bg-indigo-600 text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600',
    secondary:
        'bg-white text-gray-900 shadow-xs inset-ring inset-ring-gray-300 hover:bg-gray-50',
};

export default function Button({
    variant = 'primary',
    className,
    type = 'button',
    ...props
}: ButtonProps) {
    return (
        <button
            type={type}
            className={cn(
                'flex w-full justify-center rounded-md px-3 py-1.5 text-sm/6 font-semibold disabled:cursor-not-allowed disabled:opacity-60',
                variantStyles[variant],
                className,
            )}
            {...props}
        />
    );
}
