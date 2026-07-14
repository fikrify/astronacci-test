import {
    Label,
    Listbox,
    ListboxButton,
    ListboxOption,
    ListboxOptions,
} from '@headlessui/react';
import { ChevronUpDownIcon } from '@heroicons/react/16/solid';
import { CheckIcon } from '@heroicons/react/20/solid';
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
    const selected = options.find((option) => option.value === value);

    return (
        <Listbox value={value} onChange={onChange} name={name}>
            <Label className="block text-sm/6 font-medium text-gray-900">
                {label}
            </Label>
            <div className="relative mt-2">
                <ListboxButton
                    aria-invalid={error ? true : undefined}
                    className={cn(
                        'grid w-full cursor-default grid-cols-1 rounded-md bg-white py-1.5 pr-2 pl-3 text-left text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-indigo-600 sm:text-sm/6',
                        error &&
                            'outline-red-500 focus-visible:outline-red-600',
                    )}
                >
                    <span className="col-start-1 row-start-1 block truncate pr-6">
                        {selected?.label ?? placeholder}
                    </span>
                    <ChevronUpDownIcon
                        aria-hidden="true"
                        className="col-start-1 row-start-1 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                    />
                </ListboxButton>

                <ListboxOptions
                    transition
                    className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg outline-1 outline-black/5 data-leave:transition data-leave:duration-100 data-leave:ease-in data-closed:data-leave:opacity-0 sm:text-sm"
                >
                    {options.map((option) => (
                        <ListboxOption
                            key={option.value}
                            value={option.value}
                            className="group relative cursor-default py-2 pr-9 pl-3 text-gray-900 select-none data-focus:bg-indigo-600 data-focus:text-white data-focus:outline-hidden"
                        >
                            <span className="block truncate font-normal group-data-selected:font-semibold">
                                {option.label}
                            </span>

                            <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600 group-not-data-selected:hidden group-data-focus:text-white">
                                <CheckIcon
                                    aria-hidden="true"
                                    className="size-5"
                                />
                            </span>
                        </ListboxOption>
                    ))}
                </ListboxOptions>
            </div>
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </Listbox>
    );
}
