import { Head, router, usePage } from "@inertiajs/react";
import { CalendarDays, Eye, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AuthenticatedLayout from "@/components/layouts/authenticated-layout";
import { PayrollRunSheet } from "@/components/payroll/payroll-run-sheet";
import type { PayrollRegisterPageProps, PayrollRun } from "@/types/payroll";
import payroll from "@/routes/payroll";
import { formatDate } from "@/lib/utils";
import { DeleteDialog } from "@/components/ui/delete/delete-dialog";

export default function PayrollRegister() {
    const { payrollRuns } = usePage<PayrollRegisterPageProps>().props;
    const [sheetOpen, setSheetOpen] = useState(false);
    const [editingRun, setEditingRun] = useState<PayrollRun | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<PayrollRun | null>(null);
    const [deleting, setDeleting] = useState(false);
    const openCreate = () => {
        setEditingRun(null);
        setSheetOpen(true);
    };

    const openEdit = (payrollRun: PayrollRun) => {
        setEditingRun(payrollRun);
        setSheetOpen(true);
    };

    const deleteRun = () => {
        if (!deleteTarget) {
            return;
        }

        setDeleting(true);

        router.delete(payroll.destroy(deleteTarget.id), {
            preserveScroll: true,
            onFinish: () => {
                setDeleting(false);
                setDeleteTarget(null);
            },
        });
    };

    return (
        <AuthenticatedLayout
            title="Payroll Register"
            description="Manage payroll periods and payroll records"
        >
            <Head title="Payroll Register" />

            <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                            Payroll
                        </p>
                        <h1 className="mt-1 font-display text-2xl font-bold sm:text-3xl">
                            Payroll Register
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Create and manage payroll periods.
                        </p>
                    </div>
                    <Button onClick={openCreate}>
                        <Plus className="mr-2 h-4 w-4" />
                        Create payroll
                    </Button>
                </div>

                <section className="overflow-hidden rounded-lg border bg-card text-card-foreground">
                    {payrollRuns.length === 0 ? (
                        <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                            <CalendarDays className="h-9 w-9 text-muted-foreground" />
                            <h2 className="mt-3 font-medium">
                                No payroll periods yet
                            </h2>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Create your first payroll period to get started.
                            </p>
                            <Button className="mt-5" onClick={openCreate}>
                                <Plus className="mr-2 h-4 w-4" />
                                Create payroll
                            </Button>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="border-b bg-muted/40">
                                    <tr className="text-left text-xs text-muted-foreground">
                                        <th className="px-5 py-3 font-medium">
                                            Period
                                        </th>
                                        <th className="px-5 py-3 font-medium">
                                            Pay date
                                        </th>
                                        <th className="px-5 py-3 font-medium">
                                            Employees
                                        </th>
                                        <th className="px-5 py-3 font-medium">
                                            Status
                                        </th>
                                        <th className="w-32 px-3 py-3" />
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {payrollRuns.map((payrollRun) => (
                                        <tr
                                            key={payrollRun.id}
                                            className="transition-colors hover:bg-muted/30"
                                        >
                                            <td className="px-5 py-4">
                                                <div className="font-medium">
                                                    {formatDate(
                                                        payrollRun.period_start,
                                                    )}{" "}
                                                    –{" "}
                                                    {formatDate(
                                                        payrollRun.period_end,
                                                    )}
                                                </div>
                                                {payrollRun.remarks && (
                                                    <div className="mt-0.5 max-w-md truncate text-xs text-muted-foreground">
                                                        {payrollRun.remarks}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-5 py-4 text-muted-foreground">
                                                {formatDate(
                                                    payrollRun.pay_date,
                                                )}
                                            </td>
                                            <td className="px-5 py-4 text-muted-foreground">
                                                {payrollRun.items_count ?? 0}
                                            </td>
                                            <td className="px-5 py-4">
                                                <Badge
                                                    variant={
                                                        payrollRun.status ===
                                                        "draft"
                                                            ? "secondary"
                                                            : "default"
                                                    }
                                                    className="capitalize"
                                                >
                                                    {payrollRun.status}
                                                </Badge>
                                            </td>
                                            <td className="px-3 py-4">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon-sm"
                                                        onClick={() =>
                                                            router.get(
                                                                payroll.show(
                                                                    payrollRun.id,
                                                                ),
                                                            )
                                                        }
                                                        aria-label="View payroll"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon-sm"
                                                        onClick={() =>
                                                            openEdit(payrollRun)
                                                        }
                                                        aria-label="Edit payroll"
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon-sm"
                                                        className="text-destructive hover:text-destructive"
                                                        onClick={() =>
                                                            setDeleteTarget(
                                                                payrollRun,
                                                            )
                                                        }
                                                        aria-label="Delete payroll"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>
            </div>

            <PayrollRunSheet
                open={sheetOpen}
                onOpenChange={setSheetOpen}
                payrollRun={editingRun}
            />

            <DeleteDialog
                open={!!deleteTarget}
                title="Delete payroll period?"
                description={
                    deleteTarget
                        ? `Are you sure you want to delete the payroll period ${formatDate(
                              deleteTarget.period_start,
                          )} – ${formatDate(deleteTarget.period_end)}? This action cannot be undone.`
                        : undefined
                }
                loading={deleting}
                onOpenChange={(open) => {
                    if (!open) {
                        setDeleteTarget(null);
                    }
                }}
                onConfirm={deleteRun}
            />
        </AuthenticatedLayout>
    );
}
