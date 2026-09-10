import type { PageProps } from "@inertiajs/core";

export type CashAdvanceStatus =
    | "active"
    | "partial"
    | "paid";

export type CashAdvance = {
    id: string;
    employee_id: string;
    amount: string | number;
    balance: string | number;
    advance_date: string;
    status: CashAdvanceStatus;
    reason: string | null;
    created_at?: string;
    updated_at?: string;
};

export type CashAdvanceFormData = {
    amount: string;
    advance_date: string;
    reason: string;
};

export type CashAdvanceEmployee = {
    id: string;
    employee_number: string;
    first_name: string;
    middle_name?: string | null;
    last_name: string;
    suffix?: string | null;
    category?: {
        id: string;
        name: string;
    } | null;
};

export type CashAdvanceStats = {
    limit: number;
    outstanding_balance: number;
    available_amount: number;
    total_advanced: number;
    total_paid: number;
};

export interface CashAdvancesPageProps extends PageProps {
    employee: CashAdvanceEmployee;
    cashAdvances: CashAdvance[];
    stats: CashAdvanceStats;
}
