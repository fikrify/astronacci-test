import type { SubmitEvent } from 'react';
import Button from '@/components/Form/Button';
import SelectField from '@/components/Form/SelectField';
import TextField from '@/components/Form/TextField';
import VoucherResultModal from '@/components/VoucherResultModal';
import { useVoucherGenerator } from '@/hooks/useVoucherGenerator';
import type { AircraftType } from '@/lib/aircraft';
import { AIRCRAFT_OPTIONS } from '@/lib/aircraft';

export default function VoucherForm() {
    const {
        data,
        setData,
        errors,
        processing,
        submit,
        seats,
        errorMessage,
        modalOpen,
        closeModal,
    } = useVoucherGenerator();

    function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        submit();
    }

    return (
        <>
            <form onSubmit={handleSubmit} className="space-y-6">
                <TextField
                    id="name"
                    label="Crew Name"
                    value={data.name}
                    error={errors.name}
                    onChange={(event) => setData('name', event.target.value)}
                    required
                />
                <TextField
                    id="id"
                    label="Crew ID"
                    value={data.id}
                    error={errors.id}
                    onChange={(event) => setData('id', event.target.value)}
                    required
                />
                <TextField
                    id="flightNumber"
                    label="Flight Number"
                    value={data.flightNumber}
                    error={errors.flightNumber}
                    onChange={(event) =>
                        setData('flightNumber', event.target.value)
                    }
                    required
                />
                <TextField
                    id="date"
                    label="Flight Date"
                    type="date"
                    value={data.date}
                    error={errors.date}
                    onChange={(event) => setData('date', event.target.value)}
                    required
                />

                <SelectField
                    name="aircraft"
                    label="Aircraft Type"
                    options={AIRCRAFT_OPTIONS}
                    value={data.aircraft}
                    error={errors.aircraft}
                    onChange={(aircraft: AircraftType) =>
                        setData('aircraft', aircraft)
                    }
                />

                <Button type="submit" disabled={processing}>
                    {processing ? 'Generating…' : 'Generate'}
                </Button>
            </form>

            <VoucherResultModal
                open={modalOpen}
                onClose={closeModal}
                seats={seats}
                errorMessage={errorMessage}
            />
        </>
    );
}
