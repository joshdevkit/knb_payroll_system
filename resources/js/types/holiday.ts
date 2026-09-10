import type { PageProps } from "@inertiajs/core";

export type HolidayType = "regular" | "special" | "local";

export type Holiday = {
    id: string;
    holiday_date: string;
    name: string;
    type: HolidayType;
    pay_multiplier: string;
    is_active: boolean;
    remarks: string | null;
    created_at?: string;
    updated_at?: string;
};

export type HolidayFormData = {
    holiday_date: string;
    name: string;
    type: HolidayType;
    pay_multiplier: string;
    is_active: boolean;
    remarks: string;
};

export interface HolidaysPageProps extends PageProps {
    holidays: Holiday[];
}