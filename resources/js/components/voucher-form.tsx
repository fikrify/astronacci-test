import { useState } from 'react';
import Button from '@/components/form/button';
import SelectField from '@/components/form/select-field';
import TextField from '@/components/form/text-field';
import type { AircraftType } from '@/types/voucher';
import { AIRCRAFT_TYPES } from '@/types/voucher';

export default function VoucherForm() {
    const [aircraft, setAircraft] = useState<AircraftType>('ATR');

    return (
        <form action="#" method="POST" className="space-y-6">
            <TextField id="name" label="Crew Name" required />
            <TextField id="id" label="Crew ID" required />
            <TextField id="flightNumber" label="Flight Number" required />
            <TextField id="date" label="Flight Date" type="date" required />

            <SelectField
                name="aircraft"
                label="Aircraft Type"
                options={AIRCRAFT_TYPES}
                value={aircraft}
                onChange={setAircraft}
            />

            <Button type="submit">Generate</Button>
        </form>
    );
}
