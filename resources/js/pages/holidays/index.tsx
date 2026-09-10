import { Head, router, usePage } from "@inertiajs/react";
import {
    CalendarDays,
    CalendarX,
    Pencil,
    Plus,
    RefreshCw,
    Search,
    Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";

import AuthenticatedLayout from "@/components/layouts/authenticated-layout";
import { DeleteDialog } from "@/components/ui/delete/delete-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HolidayFormSheet } from "@/components/holidays/holiday-form-sheet";

import { formatDate } from "@/lib/utils";
import type { Holiday, HolidaysPageProps } from "@/types/holiday";

export default function Holidays() {
    const { holidays } = usePage<HolidaysPageProps>().props;

    const [search, setSearch] = useState("");
    const [sheetOpen, setSheetOpen] = useState(false);
    const [editingHoliday, setEditingHoliday] =
        useState<Holiday | null>(null);

    const [deleteTarget, setDeleteTarget] =
        useState<Holiday | null>(null);

    const [deleting, setDeleting] = useState(false);
    const [syncing, setSyncing] = useState(false);

    const filteredHolidays = useMemo(() => {
        const term = search.trim().toLowerCase();

        if (!term) {
            return holidays;
        }

        return holidays.filter((holiday) =>
            [
                holiday.name,
                holiday.type,
                holiday.holiday_date,
                holiday.is_active ? "active" : "inactive",
                holiday.remarks,
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase()
                .includes(term),
        );
    }, [holidays, search]);

    const openCreate = () => {
        setEditingHoliday(null);
        setSheetOpen(true);
    };

    const openEdit = (holiday: Holiday) => {
        setEditingHoliday(holiday);
        setSheetOpen(true);
    };

    const syncHolidays = () => {
        setSyncing(true);

        router.post(
            "/holidays/sync",
            {},
            {
                preserveScroll: true,
                onFinish: () => {
                    setSyncing(false);
                },
            },
        );
    };

    const deleteHoliday = () => {
        if (!deleteTarget) {
            return;
        }

        setDeleting(true);

        router.delete(`/holidays/${deleteTarget.id}`, {
            preserveScroll: true,

            onSuccess: () => {
                setDeleteTarget(null);
            },

            onFinish: () => {
                setDeleting(false);
            },
        });
    };

    return (
        <AuthenticatedLayout
            title="Holidays"
            description="Manage regular, special, and local holidays"
        >
            <Head title="Holidays" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                            Payroll
                        </p>

                        <h1 className="mt-1 font-display text-2xl font-bold sm:text-3xl">
                            Holidays
                        </h1>

                        <p className="mt-1 text-sm text-muted-foreground">
                            Manage holidays used for payroll calculations.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <Button
                            variant="outline"
                            onClick={syncHolidays}
                            disabled={syncing}
                        >
                            <RefreshCw
                                className={`mr-2 h-4 w-4 ${
                                    syncing ? "animate-spin" : ""
                                }`}
                            />

                            {syncing
                                ? "Syncing..."
                                : "Sync Philippines Holidays"}
                        </Button>

                        <Button onClick={openCreate}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add holiday
                        </Button>
                    </div>
                </div>

                {/* Search */}
                <div className="relative max-w-md">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                    <Input
                        value={search}
                        onChange={(event) =>
                            setSearch(event.target.value)
                        }
                        placeholder="Search holidays..."
                        className="pl-9"
                    />
                </div>

                {/* Table */}
                <section className="overflow-hidden rounded-lg border bg-card text-card-foreground">
                    {filteredHolidays.length === 0 ? (
                        <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                            <CalendarX className="h-9 w-9 text-muted-foreground" />

                            <h2 className="mt-3 font-medium">
                                {search
                                    ? "No holidays found"
                                    : "No holidays yet"}
                            </h2>

                            <p className="mt-1 text-sm text-muted-foreground">
                                {search
                                    ? "Try a different search term."
                                    : "Sync Philippine holidays or add your first holiday manually."}
                            </p>

                            {!search && (
                                <div className="mt-5 flex flex-wrap justify-center gap-2">
                                    <Button
                                        variant="outline"
                                        onClick={syncHolidays}
                                        disabled={syncing}
                                    >
                                        <RefreshCw
                                            className={`mr-2 h-4 w-4 ${
                                                syncing
                                                    ? "animate-spin"
                                                    : ""
                                            }`}
                                        />

                                        {syncing
                                            ? "Syncing..."
                                            : "Sync Holidays"}
                                    </Button>

                                    <Button onClick={openCreate}>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add holiday
                                    </Button>
                                </div>
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
                                            Holiday
                                        </th>

                                        <th className="px-5 py-3 font-medium">
                                            Type
                                        </th>
                                        <th className="px-5 py-3 font-medium">
                                            Remarks
                                        </th>

                                        <th className="w-24 px-3 py-3" />
                                    </tr>
                                </thead>

                                <tbody className="divide-y">
                                    {filteredHolidays.map((holiday) => (
                                        <tr
                                            key={holiday.id}
                                            className="transition-colors hover:bg-muted/30"
                                        >
                                            {/* Date */}
                                            <td className="whitespace-nowrap px-5 py-4">
                                                <div className="flex items-center gap-2">
                                                    <CalendarDays className="h-4 w-4 text-muted-foreground" />

                                                    <span className="font-medium">
                                                        {formatDate(
                                                            holiday.holiday_date,
                                                        )}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Holiday */}
                                            <td className="px-5 py-4">
                                                <div className="font-medium">
                                                    {holiday.name}
                                                </div>
                                            </td>

                                            {/* Type */}
                                            <td className="px-5 py-4">
                                                <Badge
                                                    variant={
                                                        holiday.type ===
                                                        "regular"
                                                            ? "default"
                                                            : "secondary"
                                                    }
                                                    className="capitalize"
                                                >
                                                    {holiday.type}
                                                </Badge>
                                            </td>

                                            {/* Remarks */}
                                            <td className="max-w-xs px-5 py-4 text-muted-foreground">
                                                <span className="block truncate">
                                                    {holiday.remarks || "—"}
                                                </span>
                                            </td>

                                            {/* Actions */}
                                            <td className="px-3 py-4">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon-sm"
                                                        onClick={() =>
                                                            openEdit(holiday)
                                                        }
                                                        aria-label="Edit holiday"
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>

                                                    <Button
                                                        variant="ghost"
                                                        size="icon-sm"
                                                        className="text-destructive hover:text-destructive"
                                                        onClick={() =>
                                                            setDeleteTarget(
                                                                holiday,
                                                            )
                                                        }
                                                        aria-label="Delete holiday"
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

                {/* Result count */}
                {search && filteredHolidays.length > 0 && (
                    <p className="text-xs text-muted-foreground">
                        Showing {filteredHolidays.length} of{" "}
                        {holidays.length} holidays
                    </p>
                )}
            </div>

            <HolidayFormSheet
                open={sheetOpen}
                onOpenChange={setSheetOpen}
                holiday={editingHoliday}
            />

            <DeleteDialog
                open={!!deleteTarget}
                title="Delete holiday?"
                description={
                    deleteTarget
                        ? `Are you sure you want to delete "${deleteTarget.name}" on ${formatDate(
                              deleteTarget.holiday_date,
                          )}? This action cannot be undone.`
                        : undefined
                }
                loading={deleting}
                onOpenChange={(open) => {
                    if (!open) {
                        setDeleteTarget(null);
                    }
                }}
                onConfirm={deleteHoliday}
            />
        </AuthenticatedLayout>
    );
}