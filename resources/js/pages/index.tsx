import { Head } from '@inertiajs/react';
import VoucherForm from '@/components/voucher-form';

export default function Index() {
    return (
        <>
            <Head title="Generate Voucher" />
            <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
                        Generate Voucher Seat Assignment
                    </h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <VoucherForm />
                </div>
            </div>
        </>
    );
}
