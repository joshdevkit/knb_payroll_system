import { Head, Link, usePage } from "@inertiajs/react";
import {
    CalendarClock,
    ChevronRight,
    ClipboardList,
    Users,
    WalletCards,
} from "lucide-react";

import { PayrollLedgerCard } from "@/components/dashboard/payroll-ledger-card";
import { StatCard } from "@/components/dashboard/stat-card";
import AuthenticatedLayout from "@/components/layouts/authenticated-layout";

type PayrollSummary = {
    id: string;
    periodStart: string | null;
    periodEnd: string | null;
    payDate: string | null;
    status: string;
    employeeCount: number;
    grossPay: number;
    bonuses: number;
    deductions: number;
    netPay: number;
};

type RecentPayroll = {
    id: string;
    periodStart: string | null;
    periodEnd: string | null;
    payDate: string | null;
    status: string;
    employeeCount: number;
    grossPay: number;
    deductions: number;
    netPay: number;
};

type Holiday = {
    id: string;
    date: string | null;
    name: string;
    type: string;
    payMultiplier: number;
};

type PageProps = {
    auth?: {
        user?: {
            name?: string;
            email?: string;
        };
    };

    stats: {
        employeeCount: number;
    };

    payroll: PayrollSummary | null;

    recentPayrolls: RecentPayroll[];

    nextHoliday: Holiday | null;

    upcomingHolidays: Holiday[];
};

const money = (value: number) =>
    `₱${value.toLocaleString("en-PH", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;

const formatDate = (value: string | null) => {
    if (!value) {
        return "—";
    }

    const date = new Date(`${value}T00:00:00`);

    if (Number.isNaN(date.getTime())) {
        return "—";
    }

    return date.toLocaleDateString("en-PH", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
};

const formatPeriod = (
    start: string | null,
    end: string | null,
) => {
    if (!start || !end) {
        return "—";
    }

    return `${formatDate(start)} – ${formatDate(end)}`;
};

const formatStatus = (status: string) => {
    return status
        .replaceAll("_", " ")
        .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

export default function Dashboard() {
    const {
        auth,
        stats,
        payroll,
        recentPayrolls,
        nextHoliday,
        upcomingHolidays,
    } = usePage<PageProps>().props;

    const userName =
        auth?.user?.name?.split(" ")[0] ||
        auth?.user?.email?.split("@")[0] ||
        "Admin";

    return (
        <AuthenticatedLayout
            title="Dashboard"
            description="Today's Overview"
        >
            <Head title="Dashboard" />

            <div className="space-y-6">
                {/* Header */}
                <div>
                    <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                        Dashboard
                    </p>

                    <h1 className="mt-1 font-display text-2xl font-bold text-foreground sm:text-3xl">
                        Good day, {userName}!
                    </h1>
                </div>

                {/* Latest payroll */}
                <PayrollLedgerCard
                    summary={{
                        cutoffLabel: payroll
                            ? formatPeriod(
                                  payroll.periodStart,
                                  payroll.periodEnd,
                              )
                            : "No payroll run yet",

                        payDate: payroll
                            ? formatDate(payroll.payDate)
                            : "—",

                        employeeCount:
                            payroll?.employeeCount ?? 0,

                        grossPay:
                            payroll?.grossPay ?? 0,

                        bonuses:
                            payroll?.bonuses ?? 0,

                        deductions:
                            payroll?.deductions ?? 0,

                        netPay:
                            payroll?.netPay ?? 0,
                    }}
                />

                {/* Stats */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <StatCard
                        icon={Users}
                        label="Employees"
                        value={stats.employeeCount.toLocaleString(
                            "en-PH",
                        )}
                        hint="Active employee records"
                    />

                    <StatCard
                        icon={WalletCards}
                        label="Latest net payroll"
                        value={money(
                            payroll?.netPay ?? 0,
                        )}
                        hint={
                            payroll
                                ? `Pay date ${formatDate(
                                      payroll.payDate,
                                  )}`
                                : "No payroll generated"
                        }
                    />

                    <StatCard
                        icon={CalendarClock}
                        label="Next holiday"
                        value={
                            nextHoliday
                                ? formatDate(
                                      nextHoliday.date,
                                  )
                                : "—"
                        }
                        hint={
                            nextHoliday
                                ? nextHoliday.name
                                : "No upcoming holidays"
                        }
                    />
                </div>

                {/* Recent payroll + holidays */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Recent payroll */}
                    <section className="overflow-hidden rounded-lg border bg-card text-card-foreground lg:col-span-2">
                        <div className="flex items-center justify-between p-6">
                            <div>
                                <h2 className="font-display text-base font-semibold">
                                    Recent payroll
                                </h2>

                                <p className="mt-1 text-xs text-muted-foreground">
                                    Latest generated payroll
                                    registers.
                                </p>
                            </div>

                            <Link
                                href="/payroll"
                                className="inline-flex items-center text-sm font-medium text-primary hover:underline"
                            >
                                View all
                                <ChevronRight className="ml-1 h-4 w-4" />
                            </Link>
                        </div>

                        {recentPayrolls.length === 0 ? (
                            <div className="border-t px-6 py-12 text-center">
                                <ClipboardList className="mx-auto h-8 w-8 text-muted-foreground" />

                                <p className="mt-3 text-sm font-medium">
                                    No payroll registered yet
                                </p>

                                <p className="mt-1 text-xs text-muted-foreground">
                                    Generated payrolls will
                                    appear here.
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto border-t">
                                <table className="w-full text-sm">
                                    <thead className="bg-muted/40">
                                        <tr className="text-left text-xs text-muted-foreground">
                                            <th className="px-6 py-3 font-medium">
                                                Period
                                            </th>

                                            <th className="px-4 py-3 font-medium">
                                                Employees
                                            </th>

                                            <th className="px-4 py-3 text-right font-medium">
                                                Gross
                                            </th>

                                            <th className="px-4 py-3 text-right font-medium">
                                                Net
                                            </th>

                                            <th className="px-6 py-3 text-right font-medium">
                                                Status
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y">
                                        {recentPayrolls.map(
                                            (item) => (
                                                <tr
                                                    key={
                                                        item.id
                                                    }
                                                    className="transition-colors hover:bg-muted/30"
                                                >
                                                    <td className="px-6 py-4">
                                                        <div className="font-medium">
                                                            {formatPeriod(
                                                                item.periodStart,
                                                                item.periodEnd,
                                                            )}
                                                        </div>

                                                        <div className="mt-0.5 text-xs text-muted-foreground">
                                                            Pay date{" "}
                                                            {formatDate(
                                                                item.payDate,
                                                            )}
                                                        </div>
                                                    </td>

                                                    <td className="px-4 py-4 text-muted-foreground">
                                                        {
                                                            item.employeeCount
                                                        }
                                                    </td>

                                                    <td className="px-4 py-4 text-right font-mono tabular-nums">
                                                        {money(
                                                            item.grossPay,
                                                        )}
                                                    </td>

                                                    <td className="px-4 py-4 text-right font-mono font-semibold tabular-nums">
                                                        {money(
                                                            item.netPay,
                                                        )}
                                                    </td>

                                                    <td className="px-6 py-4 text-right">
                                                        <span className="inline-flex rounded-full bg-muted px-2.5 py-1 text-xs font-medium">
                                                            {formatStatus(
                                                                item.status,
                                                            )}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ),
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </section>

                    {/* Holidays */}
                    <section className="overflow-hidden rounded-lg border bg-card text-card-foreground">
                        <div className="p-6">
                            <h2 className="font-display text-base font-semibold">
                                Upcoming holidays
                            </h2>

                            <p className="mt-1 text-xs text-muted-foreground">
                                Philippine holidays configured
                                for payroll.
                            </p>
                        </div>

                        {upcomingHolidays.length === 0 ? (
                            <div className="border-t px-6 py-12 text-center text-sm text-muted-foreground">
                                No upcoming holidays.
                            </div>
                        ) : (
                            <div className="border-t divide-y">
                                {upcomingHolidays.map(
                                    (holiday) => (
                                        <div
                                            key={
                                                holiday.id
                                            }
                                            className="px-6 py-4"
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div>
                                                    <p className="font-medium">
                                                        {
                                                            holiday.name
                                                        }
                                                    </p>

                                                    <p className="mt-1 text-xs text-muted-foreground">
                                                        {formatDate(
                                                            holiday.date,
                                                        )}
                                                    </p>
                                                </div>

                                                <span className="shrink-0 rounded-full bg-muted px-2.5 py-1 text-xs font-medium capitalize">
                                                    {
                                                        holiday.type
                                                    }
                                                </span>
                                            </div>
                                        </div>
                                    ),
                                )}
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}