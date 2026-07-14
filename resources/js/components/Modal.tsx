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
    success: 'bg-green-500/10 text-green-400',
    danger: 'bg-red-500/10 text-red-400',
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
        <Dialog
            open={open}
            as="div"
            onClose={onClose}
            className="relative z-10 focus:outline-none"
        >
            <DialogBackdrop
                transition
                className="fixed inset-0 bg-black/50 duration-300 ease-out data-closed:opacity-0"
            />

            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4">
                    <DialogPanel
                        transition
                        className="w-full max-w-md rounded-xl bg-white/5 p-6 backdrop-blur-2xl duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0"
                    >
                        <div className="flex items-start gap-4">
                            <div
                                className={cn(
                                    'flex size-10 shrink-0 items-center justify-center rounded-full',
                                    toneStyles[tone],
                                )}
                            >
                                {icon}
                            </div>
                            <div>
                                <DialogTitle
                                    as="h3"
                                    className="text-base/7 font-medium text-white"
                                >
                                    {title}
                                </DialogTitle>
                                <div className="mt-2">{children}</div>
                            </div>
                        </div>

                        {footer && (
                            <div className="mt-4 flex justify-end">{footer}</div>
                        )}
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    );
}