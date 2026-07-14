import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '@/lib/utils';

interface TextFieldProps extends ComponentPropsWithoutRef<'input'> {
    id: string;
    label: string;
}

export default function TextField({
    id,
    label,
    className,
    type = 'text',
    ...props
}: TextFieldProps) {
    return (
        <div>
            <label
                htmlFor={id}
                className="block text-sm/6 font-medium text-gray-900"
            >
                {label}
            </label>
            <div className="mt-2">
                <input
                    id={id}
                    name={props.name ?? id}
                    type={type}
                    className={cn(
                        'block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6',
                        className,
                    )}
                    {...props}
                />
            </div>
        </div>
    );
}
