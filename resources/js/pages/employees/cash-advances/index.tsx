import { Head, router, usePage } from "@inertiajs/react";
import {
    ArrowLeft,
    CalendarDays,
    CircleDollarSign,
    MoreHorizontal,
    Plus,
    Search,
    Trash2,
    WalletCards,
    WalletMinimal,
} from "lucide-react";
import { useMemo, useState } from "react";

import AuthenticatedLayout from "@/components/layouts/authenticated-layout";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { DeleteDialog } from "@/components/ui/delete/delete-dialog";

import { CashAdvanceStatCard } from "@/components/employees/cash-advances/cash-advance-stat-card";

import { CashAdvanceSummaryCard } from "@/components/employees/cash-advances/cash-advance-summary-card";

import { CashAdvanceFormSheet } from "@/components/employees/cash-advances/cash-advance-form-sheet";

import { CashAdvanceStatusBadge } from "@/components/employees/cash-advances/cash-advance-status-badge";

import type {
    CashAdvance,
    CashAdvancesPageProps,
} from "@/types/cash-advance";

import { formatDate } from "@/lib/utils";

export default function CashAdvances() {
    const {
        employee,
        cashAdvances,
        stats,
    } = usePage<CashAdvancesPageProps>().props;

    const [search, setSearch] =
        useState("");

    const [sheetOpen, setSheetOpen] =
        useState(false);

    const [deleteTarget, setDeleteTarget] =
        useState<CashAdvance | null>(null);

    const [deleting, setDeleting] =
        useState(false);

    const filteredCashAdvances =
        useMemo(() => {
            const term =
                search.trim().toLowerCase();

            if (!term) {
                return cashAdvances;
            }

            return cashAdvances.filter(
                (cashAdvance) =>
                    [
                        cashAdvance.reason,
                        cashAdvance.status,
                        cashAdvance.advance_date,
                        cashAdvance.amount,
                        cashAdvance.balance,
                    ]
                        .filter(
                            (value) =>
                                value !== null &&
                                value !== undefined,
                        )
                        .join(" ")
                        .toLowerCase()
                        .includes(term),
            );
        }, [
            cashAdvances,
            search,
        ]);

    const formatCurrency = (
        value: number,
    ) =>
        `₱${value.toLocaleString("en-PH", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`;

    const openCreate = () => {
        setSheetOpen(true);
    };

    const deleteCashAdvance = () => {
        if (!deleteTarget) {
            return;
        }

        setDeleting(true);

        router.delete(
            `/employees/${employee.id}/cash-advances/${deleteTarget.id}`,
            {
                preserveScroll: true,

                onSuccess: () => {
                    setDeleteTarget(null);
                },

                onFinish: () => {
                    setDeleting(false);
                },
            },
        );
    };

    const employeeName = [
        employee.first_name,
        employee.middle_name,
        employee.last_name,
        employee.suffix,
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <AuthenticatedLayout
            title="Cash Advances"
            description={`Cash advances for ${employeeName}`}
        >
            <Head
                title={`${employeeName} — Cash Advances`}
            />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="-ml-2 mb-2"
                            onClick={() =>
                                router.get(
                                    "/employees",
                                )
                            }
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Employees
                        </Button>

                        <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                            Employee cash advances
                        </p>

                        <h1 className="mt-1 font-display text-2xl font-bold sm:text-3xl">
                            {employeeName}
                        </h1>

                        <p className="mt-1 text-sm text-muted-foreground">
                            {employee.employee_number}

                            {employee.category?.name
                                ? ` · ${employee.category.name}`
                                : ""}
                        </p>
                    </div>

                    <Button
                        onClick={openCreate}
                        disabled={
                            stats.available_amount <= 0
                        }
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        New cash advance
                    </Button>
                </div>

                {/* Limit summary */}
                <CashAdvanceSummaryCard
                    limit={stats.limit}
                    outstanding={
                        stats.outstanding_balance
                    }
                    available={
                        stats.available_amount
                    }
                />

                {/* Statistics */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <CashAdvanceStatCard
                        label="Total advanced"
                        value={formatCurrency(
                            stats.total_advanced,
                        )}
                        icon={WalletCards}
                    />

                    <CashAdvanceStatCard
                        label="Outstanding balance"
                        value={formatCurrency(
                            stats.outstanding_balance,
                        )}
                        icon={CircleDollarSign}
                        className="text-amber-600 dark:text-amber-400"
                    />

                    <CashAdvanceStatCard
                        label="Total paid"
                        value={formatCurrency(
                            stats.total_paid,
                        )}
                        icon={WalletMinimal}
                        className="text-emerald-600 dark:text-emerald-400"
                    />

                    <CashAdvanceStatCard
                        label="Available"
                        value={formatCurrency(
                            stats.available_amount,
                        )}
                        icon={CircleDollarSign}
                        className={
                            stats.available_amount > 0
                                ? "text-blue-600 dark:text-blue-400"
                                : "text-destructive"
                        }
                    />
                </div>

                {/* Search */}
                <div className="relative max-w-md">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                    <Input
                        value={search}
                        onChange={(event) =>
                            setSearch(
                                event.target.value,
                            )
                        }
                        placeholder="Search cash advances..."
                        className="pl-9"
                    />
                </div>

                {/* History */}
                <section className="overflow-hidden rounded-lg border bg-card text-card-foreground">
                    {filteredCashAdvances.length ===
                    0 ? (
                        <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                            <CalendarDays className="h-9 w-9 text-muted-foreground" />

                            <h2 className="mt-3 font-medium">
                                {search
                                    ? "No cash advances found"
                                    : "No cash advances yet"}
                            </h2>

                            <p className="mt-1 text-sm text-muted-foreground">
                                {search
                                    ? "Try a different search term."
                                    : "This employee has no cash advance records yet."}
                            </p>

                            {!search && (
                                <Button
                                    className="mt-5"
                                    onClick={
                                        openCreate
                                    }
                                    disabled={
                                        stats.available_amount <=
                                        0
                                    }
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    New cash advance
                                </Button>
                            )}
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="border-b bg-muted/40">
                                    <tr className="text-left text-xs text-muted-foreground">
                                        <th className="px-5 py-3 font-medium">
                                            Date
                                        </th>

                                        <th className="px-5 py-3 font-medium">
                                            Amount
                                        </th>

                                        <th className="px-5 py-3 font-medium">
                                            Balance
                                        </th>

                                        <th className="px-5 py-3 font-medium">
                                            Reason
                                        </th>

                                        <th className="px-5 py-3 font-medium">
                                            Status
                                        </th>

                                        <th className="w-16 px-3 py-3" />
                                    </tr>
                                </thead>

                                <tbody className="divide-y">
                                    {filteredCashAdvances.map(
                                        (
                                            cashAdvance,
                                        ) => (
                                            <tr
                                                key={
                                                    cashAdvance.id
                                                }
                                                className="transition-colors hover:bg-muted/30"
                                            >
                                                {/* Date */}
                                                <td className="whitespace-nowrap px-5 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <CalendarDays className="h-4 w-4 text-muted-foreground" />

                                                        <span className="font-medium">
                                                            {formatDate(
                                                                cashAdvance.advance_date,
                                                            )}
                                                        </span>
                                                    </div>
                                                </td>

                                                {/* Amount */}
                                                <td className="px-5 py-4">
                                                    <div className="flex items-center gap-2 font-semibold">
                                                        <WalletCards className="h-4 w-4 text-muted-foreground" />

                                                        {formatCurrency(
                                                            Number(
                                                                cashAdvance.amount,
                                                            ),
                                                        )}
                                                    </div>
                                                </td>

                                                {/* Balance */}
                                                <td className="px-5 py-4">
                                                    <span
                                                        className={
                                                            Number(
                                                                cashAdvance.balance,
                                                            ) >
                                                            0
                                                                ? "font-medium text-amber-600 dark:text-amber-400"
                                                                : "font-medium text-emerald-600 dark:text-emerald-400"
                                                        }
                                                    >
                                                        {formatCurrency(
                                                            Number(
                                                                cashAdvance.balance,
                                                            ),
                                                        )}
                                                    </span>
                                                </td>

                                                {/* Reason */}
                                                <td className="max-w-sm px-5 py-4 text-muted-foreground">
                                                    <span className="block truncate">
                                                        {cashAdvance.reason ||
                                                            "—"}
                                                    </span>
                                                </td>

                                                {/* Status */}
                                                <td className="px-5 py-4">
                                                    <CashAdvanceStatusBadge
                                                        status={
                                                            cashAdvance.status
                                                        }
                                                    />
                                                </td>

                                                {/* Actions */}
                                                <td className="px-3 py-4">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger
                                                            render={
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon-sm"
                                                                    aria-label="Cash advance actions"
                                                                >
                                                                    <MoreHorizontal className="h-4 w-4" />
                                                                </Button>
                                                            }
                                                        />

                                                        <DropdownMenuContent
                                                            align="end"
                                                            className="w-40"
                                                        >
                                                            <DropdownMenuItem
                                                                variant="destructive"
                                                                onClick={() =>
                                                                    setDeleteTarget(
                                                                        cashAdvance,
                                                                    )
                                                                }
                                                            >
                                                                <Trash2 className="mr-2 h-4 w-4" />
                                                                Delete
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </td>
                                            </tr>
                                        ),
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>

                {search &&
                    filteredCashAdvances.length >
                        0 && (
                        <p className="text-xs text-muted-foreground">
                            Showing{" "}
                            {
                                filteredCashAdvances.length
                            }{" "}
                            of{" "}
                            {cashAdvances.length}{" "}
                            cash advances
                        </p>
                    )}
            </div>

            {/* Create */}
            <CashAdvanceFormSheet
                open={sheetOpen}
                onOpenChange={setSheetOpen}
                employee={employee}
                availableAmount={
                    stats.available_amount
                }
            />

            {/* Delete */}
            <DeleteDialog
                open={!!deleteTarget}
                title="Delete cash advance?"
                description={
                    deleteTarget
                        ? `Are you sure you want to delete this ${formatCurrency(
                              Number(
                                  deleteTarget.amount,
                              ),
                          )} cash advance dated ${formatDate(
                              deleteTarget.advance_date,
                          )}? This action cannot be undone.`
                        : undefined
                }
                loading={deleting}
                onOpenChange={(open) => {
                    if (!open) {
                        setDeleteTarget(null);
                    }
                }}
                onConfirm={
                    deleteCashAdvance
                }
            />
        </AuthenticatedLayout>
    );
}