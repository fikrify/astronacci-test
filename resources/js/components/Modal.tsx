import {
    Dialog,
    DialogBackdrop,
    DialogPanel,
    DialogTitle,
} from '@headlessui/react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type ModalTone = 'success' | 'danger';

interface ModalProps {
    open: boolean;
    onClose: () => void;
    title: string;
    tone?: ModalTone;
    icon: ReactNode;
    children: ReactNode;
    footer?: ReactNode;
}

const toneStyles: Record<ModalTone, string> = {
    success: 'bg-green-100 text-green-600',
    danger: 'bg-red-100 text-red-600',
};

export default function Modal({
    open,
    onClose,
    title,
    tone = 'success',
    icon,
    children,
    footer,
}: ModalProps) {
    return (
        <Dialog open={open} onClose={onClose} className="relative z-10">
            <DialogBackdrop
                transition
                className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
            />

            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                    <DialogPanel
                        transition
                        className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95"
                    >
                        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <div className="sm:flex sm:items-start">
                                <div
                                    className={cn(
                                        'mx-auto flex size-12 shrink-0 items-center justify-center rounded-full sm:mx-0 sm:size-10',
                                        toneStyles[tone],
                                    )}
                                >
                                    {icon}
                                </div>
                                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                    <DialogTitle
                                        as="h3"
                                        className="text-base font-semibold text-gray-900"
                                    >
                                        {title}
                                    </DialogTitle>
                                    <div className="mt-2">{children}</div>
                                </div>
                            </div>
                        </div>

                        {footer && (
                            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                {footer}
                            </div>
                        )}
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    );
}
