import {
    Combobox,
    ComboboxButton,
    ComboboxInput,
    ComboboxOption,
    ComboboxOptions,
    Field,
    Label,
} from '@headlessui/react';
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/20/solid';
import { cn } from '@/lib/utils';

export interface SelectOption<T extends string = string> {
    value: T;
    label: string;
}

interface SelectFieldProps<T extends string> {
    label: string;
    name: string;
    options: readonly SelectOption<T>[];
    value: T;
    onChange: (value: T) => void;
    placeholder?: string;
    error?: string;
}

export default function SelectField<T extends string>({
    label,
    name,
    options,
    value,
    onChange,
    placeholder = 'Select an option',
    error,
}: SelectFieldProps<T>) {
    return (
        <Field>
            <Label className="text-sm/6 font-medium text-white">{label}</Label>
            <Combobox
                value={value}
                onChange={(selected: T | null) =>
                    selected && onChange(selected)
                }
                name={name}
            >
                <ComboboxButton as="div" className="group relative mt-3">
                    <ComboboxInput
                        readOnly
                        aria-invalid={error ? true : undefined}
                        placeholder={placeholder}
                        className={cn(
                            'w-full cursor-default rounded-lg border-none bg-white/5 py-1.5 pr-8 pl-3 text-sm/6 text-white placeholder:text-white/50',
                            'focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-white/25',
                            error &&
                                'outline-2 -outline-offset-2 outline-red-500 data-focus:outline-red-500',
                        )}
                        displayValue={(selected: T) =>
                            options.find((option) => option.value === selected)
                                ?.label ?? ''
                        }
                    />
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5">
                        <ChevronDownIcon
                            aria-hidden="true"
                            className="size-4 fill-white/60 group-data-hover:fill-white"
                        />
                    </span>
                </ComboboxButton>

                <ComboboxOptions
                    anchor="bottom"
                    transition
                    className={cn(
                        'z-10 max-h-56 w-(--input-width) rounded-xl border border-white/5 bg-neutral-800 p-1 [--anchor-gap:--spacing(1)] empty:invisible',
                        'transition duration-100 ease-in data-leave:data-closed:opacity-0',
                    )}
                >
                    {options.map((option) => (
                        <ComboboxOption
                            key={option.value}
                            value={option.value}
                            className="group flex cursor-default items-center gap-2 rounded-lg px-3 py-1.5 select-none data-focus:bg-white/10"
                        >
                            <CheckIcon
                                aria-hidden="true"
                                className="invisible size-4 fill-white group-data-selected:visible"
                            />
                            <div className="text-sm/6 text-white">
                                {option.label}
                            </div>
                        </ComboboxOption>
                    ))}
                </ComboboxOptions>
            </Combobox>
            {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
        </Field>
    );
}