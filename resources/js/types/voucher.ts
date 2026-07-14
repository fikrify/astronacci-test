import type { SelectOption } from '@/components/form/select-field';

export type AircraftType = 'ATR' | 'Airbus 320' | 'Boeing 737 Max';

export const AIRCRAFT_TYPES: readonly SelectOption<AircraftType>[] = [
    { value: 'ATR', label: 'ATR' },
    { value: 'Airbus 320', label: 'Airbus 320' },
    { value: 'Boeing 737 Max', label: 'Boeing 737 Max' },
];

export interface VoucherFormData {
    name: string;
    id: string;
    flightNumber: string;
    date: string;
    aircraft: AircraftType;
}
