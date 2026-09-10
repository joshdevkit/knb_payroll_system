import { Head, router, usePage } from "@inertiajs/react";
import {
    CheckLine,
    FolderCog,
    MoreHorizontal,
    Pencil,
    Plus,
    Search,
    Trash2,
    UserRoundX,
    WalletCards,
} from "lucide-react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AuthenticatedLayout from "@/components/layouts/authenticated-layout";
import { EmployeeFormSheet } from "@/components/employees/employee-form-sheet";
import { CategoryManagerDialog } from "@/components/employees/category-manager-dialog";
import type { Employee, EmployeePageProps } from "@/types/employee";
import { destroy } from "@/routes/employees";
export default function Employees() {
    const { employees, categories } = usePage<EmployeePageProps>().props;
    const [search, setSearch] = useState("");
    const [formOpen, setFormOpen] = useState(false);
    const [categoriesOpen, setCategoriesOpen] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState<Employee | null>(
        null,
    );
    const [deleteTarget, setDeleteTarget] = useState<Employee | null>(null);

    const filteredEmployees = useMemo(() => {
        const term = search.trim().toLowerCase();
        if (!term) return employees;

        return employees.filter((employee) =>
            [
                employee.employee_number,
                employee.biometric_id,
                employee.first_name,
                employee.middle_name,
                employee.last_name,
                employee.category?.name,
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase()
                .includes(term),
        );
    }, [employees, search]);

    useEffect(() => {
        setDeleteTarget(null);
    }, [employees]);

    const openCreate = () => {
        setEditingEmployee(null);
        setFormOpen(true);
    };

    const openEdit = (employee: Employee) => {
        setEditingEmployee(employee);
        setFormOpen(true);
    };

    const deleteEmployee = () => {
        if (!deleteTarget) return;

        router.delete(destroy(deleteTarget.id), {
            preserveScroll: true,
            onSuccess: () => setDeleteTarget(null),
        });
    };

    return (
        <AuthenticatedLayout
            title="Employees"
            description="Manage employee records"
        >
            <Head title="Employees" />

            <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                            Payroll
                        </p>
                        <h1 className="mt-1 font-display text-2xl font-bold sm:text-3xl">
                            Employees
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Manage employee records, employment details, and
                            rates.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline">
                            <CheckLine className="mr-2 h-4 w-4" />
                            Import Attendance
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => setCategoriesOpen(true)}
                        >
                            <FolderCog className="mr-2 h-4 w-4" />
                            Categories
                        </Button>
                        <Button onClick={openCreate}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add employee
                        </Button>
                    </div>
                </div>

                <div className="relative max-w-md">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Search employees..."
                        className="pl-9"
                    />
                </div>

                <section className="overflow-hidden rounded-lg border bg-card text-card-foreground">
                    {filteredEmployees.length === 0 ? (
                        <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                            <UserRoundX className="h-9 w-9 text-muted-foreground" />
                            <h2 className="mt-3 font-medium">
                                {search
                                    ? "No employees found"
                                    : "No employees yet"}
                            </h2>
                            <p className="mt-1 text-sm text-muted-foreground">
                                {search
                                    ? "Try a different search term."
                                    : "Add your first employee to get started."}
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="border-b bg-muted/40">
                                    <tr className="text-left text-xs text-muted-foreground">
                                        <th className="px-5 py-3 font-medium">
                                            Employee
                                        </th>
                                        <th className="px-5 py-3 font-medium">
                                            Department
                                        </th>
                                        <th className="px-5 py-3 font-medium">
                                            Employment
                                        </th>
                                        <th className="px-5 py-3 font-medium">
                                            Rate
                                        </th>
                                        <th className="w-20 px-3 py-3" />
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {filteredEmployees.map((employee) => (
                                        <tr
                                            key={employee.id}
                                            className="transition-colors hover:bg-muted/30"
                                        >
                                            <td className="px-5 py-4">
                                                <div className="font-medium">
                                                    {employee.first_name}{" "}
                                                    {employee.middle_name
                                                        ? `${employee.middle_name} `
                                                        : ""}
                                                    {employee.last_name}
                                                    {employee.suffix
                                                        ? `, ${employee.suffix}`
                                                        : ""}
                                                </div>
                                                <div className="mt-0.5 text-xs text-muted-foreground">
                                                    {employee.employee_number}
                                                </div>
                                            </td>
                                            <td className="px-5 py-4 text-muted-foreground">
                                                {employee.category?.name ?? "—"}
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="capitalize">
                                                    {employee.employment_type}
                                                </div>
                                                <div className="text-xs capitalize text-muted-foreground">
                                                    {employee.rate_type}
                                                </div>
                                            </td>
                                            <td className="px-5 py-4 font-medium">
                                                ₱
                                                {Number(
                                                    employee.rate,
                                                ).toLocaleString("en-PH", {
                                                    minimumFractionDigits: 2,
                                                })}
                                            </td>

                                            <td className="px-3 py-4">
                                                <div className="flex items-center justify-end">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger
                                                            render={
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon-sm"
                                                                    aria-label={`Actions for ${employee.first_name} ${employee.last_name}`}
                                                                />
                                                            }
                                                        >
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </DropdownMenuTrigger>

                                                        <DropdownMenuContent
                                                            align="end"
                                                            className="w-48"
                                                        >
                                                            <DropdownMenuItem
                                                                onClick={() =>
                                                                    router.get(
                                                                        `/employees/${employee.id}/attendance`,
                                                                    )
                                                                }
                                                            >
                                                                <CheckLine className="mr-2 h-4 w-4" />
                                                                Attendance
                                                            </DropdownMenuItem>

                                                            <DropdownMenuItem
                                                                onClick={() =>
                                                                    router.get(
                                                                        `/employees/${employee.id}/cash-advances`,
                                                                    )
                                                                }
                                                            >
                                                                <WalletCards className="mr-2 h-4 w-4" />
                                                                Cash Advances
                                                            </DropdownMenuItem>

                                                            <DropdownMenuSeparator />

                                                            <DropdownMenuItem
                                                                onClick={() =>
                                                                    openEdit(
                                                                        employee,
                                                                    )
                                                                }
                                                            >
                                                                <Pencil className="mr-2 h-4 w-4" />
                                                                Edit
                                                            </DropdownMenuItem>

                                                            <DropdownMenuItem
                                                                variant="destructive"
                                                                onClick={() =>
                                                                    setDeleteTarget(
                                                                        employee,
                                                                    )
                                                                }
                                                            >
                                                                <Trash2 className="mr-2 h-4 w-4" />
                                                                Delete
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>

                {deleteTarget && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm">
                        <div className="w-full max-w-md rounded-xl border bg-popover p-6 shadow-xl">
                            <h2 className="font-medium">Delete employee?</h2>
                            <p className="mt-2 text-sm text-muted-foreground">
                                If payroll history exists, the employee will be
                                protected from deletion.
                            </p>
                            <div className="mt-6 flex justify-end gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() => setDeleteTarget(null)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={deleteEmployee}
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <EmployeeFormSheet
                open={formOpen}
                onOpenChange={setFormOpen}
                employee={editingEmployee}
                categories={categories}
            />

            <CategoryManagerDialog
                open={categoriesOpen}
                onOpenChange={setCategoriesOpen}
                categories={categories}
            />
        </AuthenticatedLayout>
    );
}
