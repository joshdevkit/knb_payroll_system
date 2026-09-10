import { router } from "@inertiajs/react";
import { useEffect, useState } from "react";

import type {
    CashAdvance,
    CashAdvanceFormData,
} from "@/types/cash-advance";

type Props = {
    employeeId: string;
    cashAdvance?: CashAdvance | null;
    open: boolean;
    onSuccess?: () => void;
};

const emptyForm: CashAdvanceFormData = {
    amount: "",
    advance_date: new Date().toISOString().slice(0, 10),
    reason: "",
};

export function useCashAdvanceForm({
    employeeId,
    open,
    onSuccess,
}: Props) {
    const [data, setData] =
        useState<CashAdvanceFormData>({
            ...emptyForm,
        });

    const [processing, setProcessing] =
        useState(false);

    useEffect(() => {
        if (!open) {
            return;
        }

        setData({
            ...emptyForm,
            advance_date: new Date()
                .toISOString()
                .slice(0, 10),
        });
    }, [open]);

    const setField = <
        K extends keyof CashAdvanceFormData,
    >(
        field: K,
        value: CashAdvanceFormData[K],
    ) => {
        setData((current) => ({
            ...current,
            [field]: value,
        }));
    };

    const submit = () => {
        setProcessing(true);

        router.post(
            `/employees/${employeeId}/cash-advances`,
            data,
            {
                preserveScroll: true,

                onSuccess: () => {
                    setData({
                        ...emptyForm,
                        advance_date:
                            new Date()
                                .toISOString()
                                .slice(0, 10),
                    });

                    onSuccess?.();
                },

                onFinish: () => {
                    setProcessing(false);
                },
            },
        );
    };

    return {
        data,
        processing,
        setField,
        submit,
    };
}