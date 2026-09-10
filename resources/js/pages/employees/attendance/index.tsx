import { Head, router, usePage } from "@inertiajs/react";
import {
    ArrowLeft,
    CalendarDays,
    MoreHorizontal,
    Pencil,
    Plus,
    Trash2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import AuthenticatedLayout from "@/components/layouts/authenticated-layout";

import { AttendanceFormSheet } from "@/components/employees/attendance/attendance-form-sheet";

import { DeleteDialog } from "@/components/ui/delete/delete-dialog";

import type { Attendance, AttendancePageProps } from "@/types/attendance";

import { formatDate } from "@/lib/utils";

export default function AttendancePage() {
    const { employee, attendances } = usePage<AttendancePageProps>().props;

    const [sheetOpen, setSheetOpen] = useState(false);

    const [editingAttendance, setEditingAttendance] =
        useState<Attendance | null>(null);

    const [deleteTarget, setDeleteTarget] = useState<Attendance | null>(null);

    const [deleting, setDeleting] = useState(false);

    /*
     * Attendance statistics
     */
    const stats = useMemo(() => {
        return {
            total: attendances.length,

            present: attendances.filter(
                (attendance) => attendance.status === "present",
            ).length,

            late: attendances.filter(
                (attendance) => attendance.status === "late",
            ).length,

            absent: attendances.filter(
                (attendance) => attendance.status === "absent",
            ).length,

            restDay: attendances.filter(
                (attendance) => attendance.status === "rest_day",
            ).length,

            tardyMinutes: attendances.reduce(
                (total, attendance) =>
                    total + Number(attendance.tardy_minutes ?? 0),
                0,
            ),
        };
    }, [attendances]);

    /*
     * Clear delete dialog target after
     * attendance collection is refreshed.
     */
    useEffect(() => {
        setDeleteTarget(null);
    }, [attendances]);

    const openCreate = () => {
        setEditingAttendance(null);
        setSheetOpen(true);
    };

    const openEdit = (attendance: Attendance) => {
        setEditingAttendance(attendance);
        setSheetOpen(true);
    };

    const deleteAttendance = () => {
        if (!deleteTarget) {
            return;
        }

        setDeleting(true);

        router.delete(
            `/employees/${employee.id}/attendance/${deleteTarget.id}`,
            {
                preserveScroll: true,

                onFinish: () => {
                    setDeleting(false);
                    setDeleteTarget(null);
                },
            },
        );
    };

    const employeeName = [
        employee.first_name,
        employee.middle_name,
        employee.last_name,
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <AuthenticatedLayout
            title="Attendance"
            description={`Attendance records for ${employeeName}`}
        >
            <Head title={`${employeeName} — Attendance`} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="-ml-2 mb-2"
                            onClick={() => router.get("/employees")}
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Employees
                        </Button>

                        <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                            Employee attendance
                        </p>

                        <h1 className="mt-1 font-display text-2xl font-bold sm:text-3xl">
                            {employeeName}
                        </h1>

                        <p className="mt-1 text-sm text-muted-foreground">
                            {employee.employee_number}

                            {employee.biometric_id
                                ? ` · Bio ${employee.biometric_id}`
                                : ""}

                            {employee.category?.name
                                ? ` · ${employee.category.name}`
                                : ""}
                        </p>
                    </div>

                    <Button onClick={openCreate}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add attendance
                    </Button>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                    <AttendanceStatCard
                        label="Total records"
                        value={stats.total}
                    />

                    <AttendanceStatCard
                        label="Present"
                        value={stats.present}
                        className="text-emerald-600 dark:text-emerald-400"
                    />

                    <AttendanceStatCard
                        label="Late"
                        value={stats.late}
                        className="text-amber-600 dark:text-amber-400"
                    />

                    <AttendanceStatCard
                        label="Absent"
                        value={stats.absent}
                        className="text-destructive"
                    />

                    <AttendanceStatCard
                        label="Rest days"
                        value={stats.restDay}
                    />

                    <AttendanceStatCard
                        label="Tardy minutes"
                        value={stats.tardyMinutes}
                        suffix=" min"
                        className="text-amber-600 dark:text-amber-400"
                    />
                </div>

                {/* Attendance Table */}
                <section className="overflow-hidden rounded-lg border bg-card text-card-foreground">
                    {attendances.length === 0 ? (
                        <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                            <CalendarDays className="h-9 w-9 text-muted-foreground" />

                            <h2 className="mt-3 font-medium">
                                No attendance records
                            </h2>

                            <p className="mt-1 text-sm text-muted-foreground">
                                Add the employee's first attendance record.
                            </p>

                            <Button className="mt-5" onClick={openCreate}>
                                <Plus className="mr-2 h-4 w-4" />
                                Add attendance
                            </Button>
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
                                            Time in
                                        </th>

                                        <th className="px-5 py-3 font-medium">
                                            Time out
                                        </th>

                                        <th className="px-5 py-3 font-medium">
                                            Tardy
                                        </th>

                                        <th className="px-5 py-3 font-medium">
                                            Status
                                        </th>

                                        <th className="px-5 py-3 font-medium">
                                            Source
                                        </th>

                                        <th className="w-16 px-3 py-3" />
                                    </tr>
                                </thead>

                                <tbody className="divide-y">
                                    {attendances.map((attendance) => (
                                        <tr
                                            key={attendance.id}
                                            className="transition-colors hover:bg-muted/30"
                                        >
                                            {/* Date */}
                                            <td className="px-5 py-4 font-medium">
                                                {formatDate(
                                                    attendance.attendance_date,
                                                )}
                                            </td>

                                            {/* Time in */}
                                            <td className="px-5 py-4 text-muted-foreground">
                                                {formatTime(attendance.time_in)}
                                            </td>

                                            {/* Time out */}
                                            <td className="px-5 py-4 text-muted-foreground">
                                                {formatTime(
                                                    attendance.time_out,
                                                )}
                                            </td>

                                            {/* Tardy */}
                                            <td className="px-5 py-4 text-muted-foreground">
                                                {attendance.tardy_minutes > 0
                                                    ? `${attendance.tardy_minutes} min`
                                                    : "—"}
                                            </td>

                                            {/* Status */}
                                            <td className="px-5 py-4">
                                                <StatusBadge
                                                    status={attendance.status}
                                                />
                                            </td>

                                            {/* Source */}
                                            <td className="px-5 py-4">
                                                <Badge
                                                    variant="outline"
                                                    className="capitalize"
                                                >
                                                    {attendance.source}
                                                </Badge>
                                            </td>

                                            {/* Actions */}
                                            <td className="px-3 py-4">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger
                                                        render={
                                                            <Button
                                                                variant="ghost"
                                                                size="icon-sm"
                                                                aria-label="Attendance actions"
                                                            >
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        }
                                                    />

                                                    <DropdownMenuContent
                                                        align="end"
                                                        className="w-44"
                                                    >
                                                        <DropdownMenuItem
                                                            onClick={() =>
                                                                openEdit(
                                                                    attendance,
                                                                )
                                                            }
                                                        >
                                                            <Pencil className="mr-2 h-4 w-4" />
                                                            Edit
                                                        </DropdownMenuItem>

                                                        <DropdownMenuSeparator />

                                                        <DropdownMenuItem
                                                            variant="destructive"
                                                            onClick={() =>
                                                                setDeleteTarget(
                                                                    attendance,
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
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>
            </div>

            {/* Attendance Form */}
            <AttendanceFormSheet
                open={sheetOpen}
                onOpenChange={setSheetOpen}
                employeeId={employee.id}
                attendance={editingAttendance}
            />

            {/* Delete Confirmation */}
            <DeleteDialog
                open={!!deleteTarget}
                title="Delete attendance?"
                description={
                    deleteTarget
                        ? `Are you sure you want to delete the attendance record for ${formatDate(
                              deleteTarget.attendance_date,
                          )}? This action cannot be undone.`
                        : undefined
                }
                loading={deleting}
                onOpenChange={(open) => {
                    if (!open) {
                        setDeleteTarget(null);
                    }
                }}
                onConfirm={deleteAttendance}
            />
        </AuthenticatedLayout>
    );
}

/*
|--------------------------------------------------------------------------
| Attendance Stat Card
|--------------------------------------------------------------------------
*/

function AttendanceStatCard({
    label,
    value,
    suffix = "",
    className = "",
}: {
    label: string;
    value: number;
    suffix?: string;
    className?: string;
}) {
    return (
        <div className="rounded-lg border bg-card px-4 py-4">
            <p className="text-xs font-medium text-muted-foreground">{label}</p>

            <p
                className={`mt-1 text-2xl font-bold tracking-tight ${className}`}
            >
                {value}
                {suffix}
            </p>
        </div>
    );
}

/*
|--------------------------------------------------------------------------
| Time Formatter
|--------------------------------------------------------------------------
*/

function formatTime(value: string | null): string {
    if (!value) {
        return "—";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "—";
    }

    return date.toLocaleTimeString("en-PH", {
        hour: "numeric",
        minute: "2-digit",
    });
}

/*
|--------------------------------------------------------------------------
| Status Badge
|--------------------------------------------------------------------------
*/
function StatusBadge({
    status,
}: {
    status: Attendance["status"];
}) {
    const variants: Record<
        Attendance["status"],
        {
            label: string;
            className: string;
        }
    > = {
        present: {
            label: "Present",
            className:
                "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
        },

        late: {
            label: "Late",
            className:
                "bg-amber-500/10 text-amber-600 dark:text-amber-400",
        },

        absent: {
            label: "Absent",
            className:
                "bg-destructive/10 text-destructive",
        },

        rest_day: {
            label: "Rest day",
            className:
                "bg-muted text-muted-foreground",
        },
    };

    const item = variants[status];

    return (
        <span
            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${item.className}`}
        >
            {item.label}
        </span>
    );
}