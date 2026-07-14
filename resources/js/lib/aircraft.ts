import type { SelectOption } from '@/components/Form/SelectField';

export const AIRCRAFT_TYPES = ['ATR', 'Airbus 320', 'Boeing 737 Max'] as const;

export type AircraftType = (typeof AIRCRAFT_TYPES)[number];

export const AIRCRAFT_OPTIONS: readonly SelectOption<AircraftType>[] =
    AIRCRAFT_TYPES.map((type) => ({ value: type, label: type }));
