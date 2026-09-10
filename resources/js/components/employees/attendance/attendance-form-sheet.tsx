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

import { useAttendanceForm } from "@/hooks/attendance/useAttendanceForm";

import type { Attendance } from "@/types/attendance";

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    employeeId: string;
    attendance: Attendance | null;
};

const selectClass =
    "h-9 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring";

export function AttendanceFormSheet({
    open,
    onOpenChange,
    employeeId,
    attendance,
}: Props) {
    const {
        data,
        processing,
        setField,
        submit,
    } = useAttendanceForm({
        employeeId,
        attendance,
        open,
        onSuccess: () => onOpenChange(false),
    });

    const handleSubmit = (
        event: FormEvent<HTMLFormElement>,
    ) => {
        event.preventDefault();
        submit();
    };

    return (
        <Sheet
            open={open}
            onOpenChange={onOpenChange}
        >
            <SheetContent
                side="right"
                className="w-full overflow-y-auto lg:max-w-2xl"
            >
                <SheetHeader className="border-b">
                    <SheetTitle>
                        {attendance
                            ? "Edit attendance"
                            : "Add attendance"}
                    </SheetTitle>

                    <SheetDescription>
                        Record the employee's attendance for the selected date.
                    </SheetDescription>
                </SheetHeader>

                <form
                    onSubmit={handleSubmit}
                    className="flex min-h-0 flex-1 flex-col"
                >
                    <div className="flex-1 space-y-6 overflow-y-auto px-4 py-5">
                        <section className="space-y-4">
                            <div>
                                <h3 className="font-medium">
                                    Attendance
                                </h3>

                                <p className="text-xs text-muted-foreground">
                                    Record the employee's attendance details.
                                </p>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <Field
                                    label="Attendance date"
                                    required
                                >
                                    <Input
                                        type="date"
                                        value={
                                            data.attendance_date
                                        }
                                        onChange={(event) =>
                                            setField(
                                                "attendance_date",
                                                event.target.value,
                                            )
                                        }
                                        required
                                    />
                                </Field>

                                <Field label="Status" required>
                                    <select
                                        className={selectClass}
                                        value={data.status}
                                        onChange={(event) =>
                                            setField(
                                                "status",
                                                event.target.value as Attendance["status"],
                                            )
                                        }
                                        required
                                    >
                                        <option value="present">
                                            Present
                                        </option>
                                        <option value="late">
                                            Late
                                        </option>
                                        <option value="absent">
                                            Absent
                                        </option>
                                        <option value="leave">
                                            Leave
                                        </option>
                                        <option value="rest_day">
                                            Rest day
                                        </option>
                                    </select>
                                </Field>

                                <Field label="Time in">
                                    <Input
                                        type="time"
                                        value={data.time_in}
                                        onChange={(event) =>
                                            setField(
                                                "time_in",
                                                event.target.value,
                                            )
                                        }
                                    />
                                </Field>

                                <Field label="Time out">
                                    <Input
                                        type="time"
                                        value={data.time_out}
                                        onChange={(event) =>
                                            setField(
                                                "time_out",
                                                event.target.value,
                                            )
                                        }
                                    />
                                </Field>

                                <Field label="Tardy minutes">
                                    <Input
                                        type="number"
                                        min="0"
                                        step="1"
                                        value={
                                            data.tardy_minutes
                                        }
                                        onChange={(event) =>
                                            setField(
                                                "tardy_minutes",
                                                event.target.value,
                                            )
                                        }
                                    />
                                </Field>

                                <Field label="Source" required>
                                    <select
                                        className={selectClass}
                                        value={data.source}
                                        onChange={(event) =>
                                            setField(
                                                "source",
                                                event.target.value as Attendance["source"],
                                            )
                                        }
                                        required
                                    >
                                        <option value="manual">
                                            Manual
                                        </option>
                                        <option value="biometric">
                                            Biometric
                                        </option>
                                    </select>
                                </Field>
                            </div>
                        </section>

                        <section className="space-y-4 border-t pt-6">
                            <div>
                                <h3 className="font-medium">
                                    Additional information
                                </h3>

                                <p className="text-xs text-muted-foreground">
                                    Optional attendance references and notes.
                                </p>
                            </div>

                            <Field label="Biometric reference">
                                <Input
                                    value={
                                        data.biometric_reference
                                    }
                                    onChange={(event) =>
                                        setField(
                                            "biometric_reference",
                                            event.target.value,
                                        )
                                    }
                                    placeholder="Optional biometric reference"
                                />
                            </Field>

                            <Field label="Remarks">
                                <textarea
                                    value={data.remarks}
                                    onChange={(event) =>
                                        setField(
                                            "remarks",
                                            event.target.value,
                                        )
                                    }
                                    placeholder="Optional notes..."
                                    className="min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                />
                            </Field>
                        </section>
                    </div>

                    <SheetFooter className="border-t sm:flex-row sm:justify-end">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                                onOpenChange(false)
                            }
                            disabled={processing}
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            disabled={processing}
                        >
                            {processing && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}

                            {attendance
                                ? "Save changes"
                                : "Add attendance"}
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

                {required && (
                    <span className="ml-1 text-destructive">
                        *
                    </span>
                )}
            </Label>

            {children}
        </div>
    );
}