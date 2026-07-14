import { useHttp } from '@inertiajs/react';
import { useState } from 'react';
import VoucherController from '@/actions/App/Http/Controllers/VoucherController';
import { AIRCRAFT_TYPES } from '@/lib/aircraft';
import type {
    VoucherCheckData,
    VoucherCheckResponse,
    VoucherErrorResponse,
    VoucherFormData,
    VoucherResponse,
} from '@/types';

const GENERIC_ERROR_MESSAGE = 'Something went wrong. Please try again.';
const NETWORK_ERROR_MESSAGE =
    'Could not reach the server. Check your connection and try again.';

const initialFormData: VoucherFormData = {
    name: '',
    id: '',
    flightNumber: '',
    date: '',
    aircraft: AIRCRAFT_TYPES[0],
};

/** The raw response body Inertia hands to `onHttpException`. */
interface FailedResponse {
    status: number;
    data: string;
}

/**
 * Get a message from API response and falls back to a generic message.
 */
function messageFromResponse(body: string): string {
    try {
        const parsed = JSON.parse(body) as Partial<VoucherErrorResponse>;

        return parsed.message ?? GENERIC_ERROR_MESSAGE;
    } catch {
        return GENERIC_ERROR_MESSAGE;
    }
}

/**
 * Check and generate voucher API
 */
export function useVoucherGenerator() {
    const [seats, setSeats] = useState<string[] | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [modalOpen, setModalOpen] = useState(false);

    const form = useHttp<VoucherFormData, VoucherResponse>(initialFormData);
    const duplicateCheck = useHttp<VoucherCheckData, VoucherCheckResponse>({
        flightNumber: '',
        date: '',
    });

    function failWith(message: string): void {
        setSeats(null);
        setErrorMessage(message);
        setModalOpen(true);
    }

    // Validation errors (422) belong on the fields, everything else in the modal.
    function handleHttpException(response: FailedResponse): boolean {
        if (response.status !== 422) {
            failWith(messageFromResponse(response.data));
        }

        return false;
    }

    function handleNetworkError(): boolean {
        failWith(NETWORK_ERROR_MESSAGE);

        return false;
    }

    function generate(): void {
        form.post(VoucherController.generate.url(), {
            onSuccess: (response) => {
                setErrorMessage(null);
                setSeats(response.seats);
                setModalOpen(true);
            },
            onHttpException: handleHttpException,
            onNetworkError: handleNetworkError,
        });
    }

    function submit(): void {
        const { flightNumber, date } = form.data;

        form.clearErrors();
        duplicateCheck.clearErrors();

        duplicateCheck.setData({ flightNumber, date });

        duplicateCheck.post(VoucherController.check.url(), {
            onSuccess: (response) => {
                if (response.exists) {
                    failWith(
                        `Vouchers have already been generated for flight ${flightNumber} on ${date}.`,
                    );

                    return;
                }

                generate();
            },
            onHttpException: handleHttpException,
            onNetworkError: handleNetworkError,
        });
    }

    return {
        data: form.data,
        setData: form.setData,
        errors: { ...duplicateCheck.errors, ...form.errors },
        processing: duplicateCheck.processing || form.processing,
        submit,
        seats,
        errorMessage,
        modalOpen,
        closeModal: () => setModalOpen(false),
    };
}
