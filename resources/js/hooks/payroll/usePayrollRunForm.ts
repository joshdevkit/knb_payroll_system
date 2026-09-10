import { useEffect, useState } from "react";
import { router } from "@inertiajs/react";
import type { PayrollRun, PayrollRunFormData } from "@/types/payroll";
import payroll from "@/routes/payroll";
import { formatDate } from "@/lib/utils";

const emptyForm: PayrollRunFormData = {
    period_start: "",
    period_end: "",
    pay_date: "",
    remarks: "",
};

function toDateInput(value: string): string {
    const formatted = formatDate(value);

    if (formatted === "—") {
        return "";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "";
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function toForm(payrollRun: PayrollRun): PayrollRunFormData {
    return {
        period_start: toDateInput(payrollRun.period_start),
        period_end: toDateInput(payrollRun.period_end),
        pay_date: toDateInput(payrollRun.pay_date),
        remarks: payrollRun.remarks ?? "",
    };
}

export function usePayrollRunForm(
    payrollRun: PayrollRun | null,
    open: boolean,
    onSuccess?: () => void,
) {
    const [data, setData] = useState<PayrollRunFormData>(emptyForm);

    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        if (!open) return;

        setData(payrollRun ? toForm(payrollRun) : { ...emptyForm });
    }, [payrollRun, open]);

    const setField = <K extends keyof PayrollRunFormData>(
        field: K,
        value: PayrollRunFormData[K],
    ) => {
        setData((current) => ({
            ...current,
            [field]: value,
        }));
    };

    const submit = () => {
        setProcessing(true);

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

        if (payrollRun) {
            router.put(payroll.update(payrollRun.id), data, options);
        } else {
            router.post(payroll.store(), data, options);
        }
    };

    return {
        data,
        processing,
        setField,
        submit,
    };
}
