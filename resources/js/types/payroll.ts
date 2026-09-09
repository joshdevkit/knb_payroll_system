export type PayrollStatus = "draft" | "processed" | "paid";

export type PayrollRun = {
    id: string;
    period_start: string;
    period_end: string;
    pay_date: string;
    status: PayrollStatus;
    remarks: string | null;
    items_count?: number;
};

export type PayrollRegisterPageProps = {
    payrollRuns: PayrollRun[];
};

export type PayrollRunFormData = {
    period_start: string;
    period_end: string;
    pay_date: string;
    remarks: string;
};
