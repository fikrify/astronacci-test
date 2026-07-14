import { Head } from '@inertiajs/react';
import VoucherForm from '@/components/VoucherForm';

export default function Index() {
    return (
        <div className="size-full bg-white/5">
            <Head title="Generate Voucher" />
            <div className="flex min-h-dvh flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-lg">
                    <h2 className="text-center text-2xl/9 font-bold tracking-tight text-white">
                        Generate Voucher Seat Assignment
                    </h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-lg">
                    <VoucherForm />
                </div>
            </div>
        </div>
    );
}
