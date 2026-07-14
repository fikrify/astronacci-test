import type { AircraftType } from '@/lib/aircraft';

export interface VoucherFormData {
    name: string;
    id: string;
    flightNumber: string;
    date: string;
    aircraft: AircraftType;
}

export interface VoucherCheckData {
    flightNumber: string;
    date: string;
}

export interface VoucherCheckResponse {
    exists: boolean;
}

export interface VoucherResponse {
    success: boolean;
    seats: string[];
}

export interface VoucherErrorResponse {
    success: false;
    message: string;
}
