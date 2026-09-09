import { Head, router, usePage } from "@inertiajs/react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import AuthenticatedLayout from "@/components/layouts/authenticated-layout";
import type { PayrollRun } from "@/types/payroll";

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

function formatDate(value: string) {
    return new Date(`${value}T00:00:00`).toLocaleDateString("en-PH", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

export default function PayrollShow() {
    const { payrollRun } = usePage<Props>().props;

    return (
        <AuthenticatedLayout title="Payroll Register" description="Payroll register details">
            <Head title="Payroll Register" />

            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => router.get("/payroll-register")}
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

                <section className="overflow-hidden rounded-lg border bg-card">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[1000px] text-sm">
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
                                {payrollRun.items.map((item) => (
                                    <tr key={item.id} className="hover:bg-muted/30">
                                        <td className="px-4 py-4">
                                            <div className="font-medium">{employeeName(item.employee)}</div>
                                            <div className="text-xs text-muted-foreground">
                                                {item.employee.employee_number}
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-right">{item.days_present}</td>
                                        <td className="px-4 py-4 text-right">{money(item.basic_earnings)}</td>
                                        <td className="px-4 py-4 text-right">{money(item.tardy)}</td>
                                        <td className="px-4 py-4 text-right">{money(item.holiday_pay)}</td>
                                        <td className="px-4 py-4 text-right font-medium">{money(item.total_earnings)}</td>
                                        <td className="px-4 py-4 text-right">{money(item.cash_advance)}</td>
                                        <td className="px-4 py-4 text-right">{money(item.total_deductions)}</td>
                                        <td className="px-4 py-4 text-right font-semibold">{money(item.net_earnings)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </AuthenticatedLayout>
    );
}
