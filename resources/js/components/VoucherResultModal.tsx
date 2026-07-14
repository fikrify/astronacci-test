import {
    CheckCircleIcon,
    ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import Button from '@/components/Form/Button';
import Modal from '@/components/Modal';

interface VoucherResultModalProps {
    open: boolean;
    onClose: () => void;
    seats: string[] | null;
    errorMessage: string | null;
}

export default function VoucherResultModal({
    open,
    onClose,
    seats,
    errorMessage,
}: VoucherResultModalProps) {
    const failed = errorMessage !== null;

    return (
        <Modal
            open={open}
            onClose={onClose}
            tone={failed ? 'danger' : 'success'}
            title={failed ? 'Generation failed' : 'Seat vouchers generated'}
            icon={
                failed ? (
                    <ExclamationTriangleIcon
                        aria-hidden="true"
                        className="size-6"
                    />
                ) : (
                    <CheckCircleIcon aria-hidden="true" className="size-6" />
                )
            }
            footer={
                <Button
                    variant="secondary"
                    data-autofocus
                    onClick={onClose}
                    className="sm:w-auto"
                >
                    Close
                </Button>
            }
        >
            {failed ? (
                <p className="text-sm text-gray-500">{errorMessage}</p>
            ) : (
                <>
                    <p className="text-sm text-gray-500">
                        These seats are reserved for the crew on this flight.
                    </p>
                    <ul className="mt-4 flex flex-wrap gap-2">
                        {seats?.map((seat) => (
                            <li
                                key={seat}
                                className="rounded-md bg-indigo-50 px-3 py-1.5 text-sm font-semibold text-indigo-700 inset-ring inset-ring-indigo-200"
                            >
                                {seat}
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </Modal>
    );
}
