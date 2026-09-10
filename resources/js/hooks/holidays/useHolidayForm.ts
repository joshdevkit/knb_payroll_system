import { useEffect, useState } from "react";
import { router } from "@inertiajs/react";
import type {
    Holiday,
    HolidayFormData,
} from "@/types/holiday";

const emptyForm: HolidayFormData = {
    holiday_date: "",
    name: "",
    type: "regular",
    pay_multiplier: "2.00",
    is_active: true,
    remarks: "",
};

function toForm(holiday: Holiday): HolidayFormData {
    return {
        holiday_date: holiday.holiday_date?.slice(0, 10) ?? "",
        name: holiday.name,
        type: holiday.type,
        pay_multiplier: String(holiday.pay_multiplier),
        is_active: holiday.is_active,
        remarks: holiday.remarks ?? "",
    };
}

type Props = {
    holiday: Holiday | null;
    open: boolean;
    onSuccess?: () => void;
};

export function useHolidayForm({
    holiday,
    open,
    onSuccess,
}: Props) {
    const [data, setData] =
        useState<HolidayFormData>(emptyForm);

    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        if (!open) {
            return;
        }

        setData(
            holiday
                ? toForm(holiday)
                : { ...emptyForm },
        );
    }, [holiday, open]);

    const setField = <K extends keyof HolidayFormData>(
        field: K,
        value: HolidayFormData[K],
    ) => {
        setData((current) => ({
            ...current,
            [field]: value,
        }));
    };

    const submit = () => {
        setProcessing(true);

        const payload = data as Record<string, string | boolean>;

        const options = {
            preserveScroll: true,

            onSuccess: () => {
                setData({ ...emptyForm });
                onSuccess?.();
            },

            onFinish: () => {
                setProcessing(false);
            },
        };

        if (holiday) {
            router.put(
                `/holidays/${holiday.id}`,
                payload,
                options,
            );
        } else {
            router.post(
                "/holidays",
                payload,
                options,
            );
        }
    };

    return {
        data,
        processing,
        setField,
        submit,
    };
}