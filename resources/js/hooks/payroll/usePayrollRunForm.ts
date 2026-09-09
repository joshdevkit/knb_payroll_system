import { useEffect, useState } from "react";
import { router } from "@inertiajs/react";
import type { PayrollRun, PayrollRunFormData } from "@/types/payroll";

const emptyForm: PayrollRunFormData = {
    period_start: "",
    period_end: "",
    pay_date: "",
    remarks: "",
};

function toForm(payrollRun: PayrollRun): PayrollRunFormData {
    return {
        period_start: payrollRun.period_start,
        period_end: payrollRun.period_end,
        pay_date: payrollRun.pay_date,
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
        setData((current) => ({ ...current, [field]: value }));
    };

    const submit = () => {
        setProcessing(true);

        const options = {
            preserveScroll: true,
            onSuccess: () => onSuccess?.(),
            onFinish: () => setProcessing(false),
        };

        if (payrollRun) {
            router.put(`/payroll-register/${payrollRun.id}`, data, options);
        } else {
            router.post("/payroll-register", data, options);
        }
    };

    return { data, processing, setField, submit };
}
