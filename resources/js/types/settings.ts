import type { FormDataConvertible, PageProps } from "@inertiajs/core";

export interface PayrollSettings {
    holiday_pay_enabled: boolean;
    holiday_regular_multiplier: string | number;
    holiday_special_multiplier: string | number;
    late_grace_minutes: number;
    night_shift_start: string;
    night_shift_end: string;
    night_shift_multiplier: string | number;
    overtime_threshold_minutes: number;
    overtime_multiplier: string | number;
}

export interface PayrollSettingsFormData
    extends Record<string, FormDataConvertible> {
    holiday_pay_enabled: boolean;
    holiday_regular_multiplier: string;
    holiday_special_multiplier: string;
    late_grace_minutes: string;
    night_shift_start: string;
    night_shift_end: string;
    night_shift_multiplier: string;
    overtime_threshold_minutes: string;
    overtime_multiplier: string;
}

export interface SettingsPageProps extends PageProps {
    settings: PayrollSettings;
}