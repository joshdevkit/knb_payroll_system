import { FormEvent } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { useEmployeeForm } from "@/hooks/employees/useEmployeeForm";
import type {  Employee } from "@/types/employee";
import { Category } from "@/types/category";

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    employee: Employee | null;
    categories: Category[];
};

const selectClass =
    "h-9 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring";

export function EmployeeFormSheet({
    open,
    onOpenChange,
    employee,
    categories,
}: Props) {
    const { data, processing, setField, submit } = useEmployeeForm({
        employee,
        open,
        onSuccess: () => onOpenChange(false),
    });

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        submit();
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-xl">
                <SheetHeader className="border-b">
                    <SheetTitle>
                        {employee ? "Edit employee" : "Add employee"}
                    </SheetTitle>
                    <SheetDescription>
                        {employee
                            ? "Update the employee's information."
                            : "Create a new employee record."}
                    </SheetDescription>
                </SheetHeader>

                <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
                    <div className="flex-1 space-y-7 overflow-y-auto px-4 py-5">
                        <section className="space-y-4">
                            <div>
                                <h3 className="font-medium">Employment</h3>
                                <p className="text-xs text-muted-foreground">
                                    Employee identification and payroll configuration.
                                </p>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <Field label="Employee number" required>
                                    <Input
                                        value={data.employee_number}
                                        onChange={(e) => setField("employee_number", e.target.value)}
                                        required
                                    />
                                </Field>
                                <Field label="Department">
                                    <select
                                        className={selectClass}
                                        value={data.category_id}
                                        onChange={(e) => setField("category_id", e.target.value)}
                                    >
                                        <option value="">No department</option>
                                        {categories.map((category) => (
                                            <option key={category.id} value={category.id}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                </Field>

                                <Field label="Status" required>
                                    <select
                                        className={selectClass}
                                        value={data.status}
                                        onChange={(e) => setField("status", e.target.value)}
                                    >
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                </Field>

                                <Field label="Employment type" required>
                                    <select
                                        className={selectClass}
                                        value={data.employment_type}
                                        onChange={(e) => setField("employment_type", e.target.value)}
                                    >
                                        <option value="regular">Regular</option>
                                        <option value="probationary">Probationary</option>
                                        <option value="contractual">Contractual</option>
                                    </select>
                                </Field>

                                <Field label="Rate type" required>
                                    <select
                                        className={selectClass}
                                        value={data.rate_type}
                                        onChange={(e) => setField("rate_type", e.target.value)}
                                    >
                                        <option value="daily">Daily</option>
                                        <option value="monthly">Monthly</option>
                                    </select>
                                </Field>

                                <Field label="Rate" required>
                                    <Input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={data.rate}
                                        onChange={(e) => setField("rate", e.target.value)}
                                        required
                                    />
                                </Field>

                                <Field label="Hire date">
                                    <Input
                                        type="date"
                                        value={data.hire_date}
                                        onChange={(e) => setField("hire_date", e.target.value)}
                                    />
                                </Field>
                            </div>
                        </section>

                        <section className="space-y-4 border-t pt-6">
                            <div>
                                <h3 className="font-medium">Personal information</h3>
                                <p className="text-xs text-muted-foreground">
                                    Basic employee information and contact details.
                                </p>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <Field label="First name" required>
                                    <Input value={data.first_name} onChange={(e) => setField("first_name", e.target.value)} required />
                                </Field>
                                <Field label="Middle name">
                                    <Input value={data.middle_name} onChange={(e) => setField("middle_name", e.target.value)} />
                                </Field>
                                <Field label="Last name" required>
                                    <Input value={data.last_name} onChange={(e) => setField("last_name", e.target.value)} required />
                                </Field>
                                <Field label="Suffix">
                                    <Input value={data.suffix} onChange={(e) => setField("suffix", e.target.value)} placeholder="Jr., Sr., III" />
                                </Field>
                                <Field label="Birthday">
                                    <Input type="date" value={data.birthday} onChange={(e) => setField("birthday", e.target.value)} />
                                </Field>
                                <Field label="Place of birth">
                                    <Input value={data.place_of_birth} onChange={(e) => setField("place_of_birth", e.target.value)} />
                                </Field>
                                <Field label="Sex">
                                    <select className={selectClass} value={data.sex} onChange={(e) => setField("sex", e.target.value)}>
                                        <option value="">Select sex</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                    </select>
                                </Field>
                                <Field label="Civil status">
                                    <select className={selectClass} value={data.civil_status} onChange={(e) => setField("civil_status", e.target.value)}>
                                        <option value="">Select status</option>
                                        <option value="single">Single</option>
                                        <option value="married">Married</option>
                                        <option value="widowed">Widowed</option>
                                        <option value="separated">Separated</option>
                                    </select>
                                </Field>
                                <Field label="Nationality">
                                    <Input value={data.nationality} onChange={(e) => setField("nationality", e.target.value)} />
                                </Field>
                                <Field label="Contact number">
                                    <Input value={data.contact_number} onChange={(e) => setField("contact_number", e.target.value)} />
                                </Field>
                                <Field label="Email address">
                                    <Input type="email" value={data.email_address} onChange={(e) => setField("email_address", e.target.value)} />
                                </Field>
                            </div>

                            <Field label="Home address">
                                <textarea
                                    className="min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    value={data.home_address}
                                    onChange={(e) => setField("home_address", e.target.value)}
                                />
                            </Field>
                        </section>
                    </div>

                    <SheetFooter className="border-t sm:flex-row sm:justify-end">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={processing}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {employee ? "Save changes" : "Add employee"}
                        </Button>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    );
}

function Field({
    label,
    required,
    children,
}: {
    label: string;
    required?: boolean;
    children: React.ReactNode;
}) {
    return (
        <div className="space-y-1.5">
            <Label>
                {label}
                {required && <span className="ml-1 text-destructive">*</span>}
            </Label>
            {children}
        </div>
    );
}
