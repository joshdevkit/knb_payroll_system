import { useEffect, useState } from "react";
import { router } from "@inertiajs/react";
import type {
    PayrollSettings,
    PayrollSettingsFormData,
} from "@/types/settings";

export const emptyForm: PayrollSettingsFormData = {
    holiday_pay_enabled: true,
    holiday_regular_multiplier: "2.00",
    holiday_special_multiplier: "1.30",
    late_grace_minutes: "0",
    night_shift_start: "22:00",
    night_shift_end: "06:00",
    night_shift_multiplier: "0.10",
    overtime_threshold_minutes: "60",
    overtime_multiplier: "1.25",
};

export function toForm(settings: PayrollSettings): PayrollSettingsFormData {
    return {
        holiday_pay_enabled: settings.holiday_pay_enabled,
        holiday_regular_multiplier: String(
            settings.holiday_regular_multiplier,
        ),
        holiday_special_multiplier: String(
            settings.holiday_special_multiplier,
        ),
        late_grace_minutes: String(settings.late_grace_minutes),
        night_shift_start: settings.night_shift_start?.slice(0, 5) ?? "22:00",
        night_shift_end: settings.night_shift_end?.slice(0, 5) ?? "06:00",
        night_shift_multiplier: String(settings.night_shift_multiplier),
        overtime_threshold_minutes: String(
            settings.overtime_threshold_minutes,
        ),
        overtime_multiplier: String(settings.overtime_multiplier),
    };
}

export function useSettingsForm(settings: PayrollSettings) {
    const [data, setData] = useState<PayrollSettingsFormData>(
        toForm(settings),
    );
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        setData(toForm(settings));
    }, [settings]);

    const setField = <K extends keyof PayrollSettingsFormData>(
        field: K,
        value: PayrollSettingsFormData[K],
    ) => {
        setData((current) => ({
            ...current,
            [field]: value,
        }));
    };

    const submit = () => {
        setProcessing(true);

        router.put("/settings/payroll", data, {
            preserveScroll: true,
            onFinish: () => setProcessing(false),
        });
    };

    return {
        data,
        processing,
        setField,
        submit,
    };
}