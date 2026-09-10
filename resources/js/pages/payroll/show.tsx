import { Head, router, usePage } from "@inertiajs/react";
import { ArrowLeft, Download, Check } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AuthenticatedLayout from "@/components/layouts/authenticated-layout";
import type { PayrollRun } from "@/types/payroll";
import payroll from "@/routes/payroll";
import { formatDate } from "@/lib/utils";
import { exportPayrollToExcel } from "@/lib/payroll-export";

type PayrollItem = {
    id: string;
    basic_earnings: number | string;
    tardy: number | string;
    holiday_pay: number | string;
    total_earnings: number | string;
    cash_advance: number | string;
    total_deductions: number | string;
    net_earnings: number | string;
    days_present: number;
    days_absent: number;
    tardy_minutes: number;
    employee: {
        id: string;
        employee_number: string;
        first_name: string;
        middle_name: string | null;
        last_name: string;
        suffix: string | null;
    };
};

type Props = {
    payrollRun: PayrollRun & { items: PayrollItem[] };
    cashAdvanceBalances: Record<string, number>;
};

const money = (value: number | string) =>
    `₱${Number(value).toLocaleString("en-PH", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;

const employeeName = (employee: PayrollItem["employee"]) =>
    [employee.first_name, employee.middle_name, employee.last_name]
        .filter(Boolean)
        .join(" ") + (employee.suffix ? `, ${employee.suffix}` : "");

export default function PayrollShow() {
    const { payrollRun, cashAdvanceBalances } = usePage<Props>().props;
    const [deductions, setDeductions] = useState<Record<string, string>>({});
    const [confirming, setConfirming] = useState(false);

    useEffect(() => {
        setDeductions(
            Object.fromEntries(
                payrollRun.items.map((item) => [
                    item.id,
                    String(Number(item.cash_advance) || 0),
                ]),
            ),
        );
    }, [payrollRun.items]);

    const totals = useMemo(() => {
        return payrollRun.items.reduce(
            (summary, item) => {
                const cashAdvance =
                    Number(deductions[item.id] ?? item.cash_advance) || 0;

                const totalEarnings = Number(item.total_earnings) || 0;
                const tardy = Number(item.tardy) || 0;
                const totalDeductions = tardy + cashAdvance;
                const netEarnings = totalEarnings - totalDeductions;

                summary.cashAdvance += cashAdvance;
                summary.totalDeductions += totalDeductions;
                summary.netEarnings += netEarnings;

                return summary;
            },
            {
                cashAdvance: 0,
                totalDeductions: 0,
                netEarnings: 0,
            },
        );
    }, [deductions, payrollRun.items]);

    const updateDeduction = (item: PayrollItem, value: string) => {
        const outstanding = Number(cashAdvanceBalances[item.employee.id] ?? 0);
        const numericValue = Number(value);

        if (value === "") {
            setDeductions((current) => ({
                ...current,
                [item.id]: "",
            }));
            return;
        }

        const safeValue = Math.min(
            Math.max(Number.isFinite(numericValue) ? numericValue : 0, 0),
            outstanding,
        );

        setDeductions((current) => ({
            ...current,
            [item.id]: String(safeValue),
        }));
    };

    const confirmPayroll = () => {
        setConfirming(true);

        router.post(
            `/payroll/${payrollRun.id}/confirm`,
            {
                deductions: Object.fromEntries(
                    payrollRun.items.map((item) => [
                        item.id,
                        Number(deductions[item.id] ?? 0) || 0,
                    ]),
                ),
            },
            {
                preserveScroll: true,
                onFinish: () => setConfirming(false),
            },
        );
    };

    return (
        <AuthenticatedLayout
            title="Payroll Register"
            description="Payroll register details"
        >
            <Head title="Payroll Register" />

            <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => router.get(payroll.index())}
                            aria-label="Back to payroll register"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Button>

                        <div>
                            <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                                Payroll
                            </p>

                            <h1 className="mt-1 font-display text-2xl font-bold sm:text-3xl">
                                Payroll Register
                            </h1>

                            <p className="mt-1 text-sm text-muted-foreground">
                                {formatDate(payrollRun.period_start)} – {formatDate(payrollRun.period_end)}
                                {" · "}
                                Pay date {formatDate(payrollRun.pay_date)}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <Button
                            variant="outline"
                            onClick={() => exportPayrollToExcel(payrollRun)}
                        >
                            <Download className="mr-2 h-4 w-4" />
                            Export Excel
                        </Button>

                        {payrollRun.status === "draft" && (
                            <Button
                                onClick={confirmPayroll}
                                disabled={confirming}
                            >
                                <Check className="mr-2 h-4 w-4" />
                                {confirming ? "Confirming..." : "Confirm Payroll"}
                            </Button>
                        )}
                    </div>
                </div>

                {payrollRun.status === "draft" && (
                    <div className="rounded-lg border bg-muted/30 p-4 text-sm text-muted-foreground">
                        Cash advance deductions are optional. Select how much each employee wants to pay from their outstanding balance. The balance is updated only after you confirm the payroll.
                    </div>
                )}

                <section className="overflow-hidden rounded-lg border bg-card">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[1180px] text-sm">
                            <thead className="border-b bg-muted/40">
                                <tr className="text-left text-xs text-muted-foreground">
                                    <th className="px-4 py-3 font-medium">Employee</th>
                                    <th className="px-4 py-3 text-right font-medium">Days Present</th>
                                    <th className="px-4 py-3 text-right font-medium">Basic Earnings</th>
                                    <th className="px-4 py-3 text-right font-medium">Tardy</th>
                                    <th className="px-4 py-3 text-right font-medium">Holiday Pay</th>
                                    <th className="px-4 py-3 text-right font-medium">Total Earnings</th>
                                    <th className="px-4 py-3 text-right font-medium">Cash Advance</th>
                                    <th className="px-4 py-3 text-right font-medium">Deductions</th>
                                    <th className="px-4 py-3 text-right font-medium">Net Earnings</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y">
                                {payrollRun.items.map((item) => {
                                    const outstanding = Number(
                                        cashAdvanceBalances[item.employee.id] ?? 0,
                                    );
                                    const cashAdvance =
                                        Number(deductions[item.id] ?? item.cash_advance) || 0;
                                    const totalDeductions =
                                        Number(item.tardy) + cashAdvance;
                                    const netEarnings =
                                        Number(item.total_earnings) - totalDeductions;

                                    return (
                                        <tr key={item.id} className="hover:bg-muted/30">
                                            <td className="px-4 py-4">
                                                <div className="font-medium">
                                                    {employeeName(item.employee)}
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    {item.employee.employee_number}
                                                </div>
                                            </td>

                                            <td className="px-4 py-4 text-right">
                                                {item.days_present}
                                            </td>

                                            <td className="px-4 py-4 text-right">
                                                {money(item.basic_earnings)}
                                            </td>

                                            <td className="px-4 py-4 text-right">
                                                {money(item.tardy)}
                                            </td>

                                            <td className="px-4 py-4 text-right">
                                                {money(item.holiday_pay)}
                                            </td>

                                            <td className="px-4 py-4 text-right font-medium">
                                                {money(item.total_earnings)}
                                            </td>

                                            <td className="px-4 py-4 text-right">
                                                {payrollRun.status === "draft" ? (
                                                    <div className="ml-auto w-36">
                                                        <Input
                                                            type="number"
                                                            min="0"
                                                            max={outstanding}
                                                            step="0.01"
                                                            value={deductions[item.id] ?? "0"}
                                                            onChange={(event) =>
                                                                updateDeduction(
                                                                    item,
                                                                    event.target.value,
                                                                )
                                                            }
                                                            className="text-right"
                                                        />
                                                        <p className="mt-1 text-[11px] text-muted-foreground">
                                                            Balance: {money(outstanding)}
                                                        </p>
                                                    </div>
                                                ) : (
                                                    money(item.cash_advance)
                                                )}
                                            </td>

                                            <td className="px-4 py-4 text-right">
                                                {payrollRun.status === "draft"
                                                    ? money(totalDeductions)
                                                    : money(item.total_deductions)}
                                            </td>

                                            <td className="px-4 py-4 text-right font-semibold">
                                                {payrollRun.status === "draft"
                                                    ? money(netEarnings)
                                                    : money(item.net_earnings)}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>

                            {payrollRun.items.length > 0 && (
                                <tfoot className="border-t bg-muted/30">
                                    <tr className="font-semibold">
                                        <td colSpan={6} className="px-4 py-4 text-right">
                                            Totals
                                        </td>
                                        <td className="px-4 py-4 text-right">
                                            {money(
                                                payrollRun.status === "draft"
                                                    ? totals.cashAdvance
                                                    : payrollRun.items.reduce(
                                                          (sum, item) =>
                                                              sum + Number(item.cash_advance),
                                                          0,
                                                      ),
                                            )}
                                        </td>
                                        <td className="px-4 py-4 text-right">
                                            {money(
                                                payrollRun.status === "draft"
                                                    ? totals.totalDeductions
                                                    : payrollRun.items.reduce(
                                                          (sum, item) =>
                                                              sum + Number(item.total_deductions),
                                                          0,
                                                      ),
                                            )}
                                        </td>
                                        <td className="px-4 py-4 text-right">
                                            {money(
                                                payrollRun.status === "draft"
                                                    ? totals.netEarnings
                                                    : payrollRun.items.reduce(
                                                          (sum, item) =>
                                                              sum + Number(item.net_earnings),
                                                          0,
                                                      ),
                                            )}
                                        </td>
                                    </tr>
                                </tfoot>
                            )}
                        </table>
                    </div>
                </section>
            </div>
        </AuthenticatedLayout>
    );
}
