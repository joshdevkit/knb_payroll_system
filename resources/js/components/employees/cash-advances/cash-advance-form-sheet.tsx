import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import type { CashAdvanceEmployee } from "@/types/cash-advance";

import { useCashAdvanceForm } from "@/hooks/employees/cash-advances/use-cash-advance-form";

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    employee: CashAdvanceEmployee;
    availableAmount: number;
};

export function CashAdvanceFormSheet({
    open,
    onOpenChange,
    employee,
    availableAmount,
}: Props) {
    const {
        data,
        processing,
        setField,
        submit,
    } = useCashAdvanceForm({
        employeeId: employee.id,
        open,
        onSuccess: () => {
            onOpenChange(false);
        },
    });

    const amount = Number(data.amount || 0);

    const exceedsLimit =
        amount > availableAmount;

    const formatCurrency = (value: number) =>
        `₱${value.toLocaleString("en-PH", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`;

    const employeeName = [
        employee.first_name,
        employee.middle_name,
        employee.last_name,
        employee.suffix,
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <Sheet
            open={open}
            onOpenChange={onOpenChange}
        >
            <SheetContent
                side="right"
                className="w-full overflow-y-auto sm:max-w-xl"
            >
                <SheetHeader className="border-b">
                    <SheetTitle>
                        New cash advance
                    </SheetTitle>

                    <SheetDescription>
                        Create a cash advance for this
                        employee.
                    </SheetDescription>
                </SheetHeader>

                <div className="space-y-6 p-6">
                    {/* Employee */}
                    <div className="rounded-lg border bg-muted/30 p-4">
                        <p className="text-xs text-muted-foreground">
                            Employee
                        </p>

                        <p className="mt-1 font-semibold">
                            {employeeName}
                        </p>

                        <p className="mt-0.5 text-xs text-muted-foreground">
                            {employee.employee_number}
                        </p>
                    </div>

                    {/* Available amount */}
                    <div className="rounded-lg border p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-muted-foreground">
                                    Available cash advance
                                </p>

                                <p className="mt-1 text-xl font-bold">
                                    {formatCurrency(
                                        availableAmount,
                                    )}
                                </p>
                            </div>

                            <p className="text-xs text-muted-foreground">
                                Current cutoff
                            </p>
                        </div>
                    </div>

                    {/* Amount */}
                    <div className="space-y-2">
                        <Label htmlFor="amount">
                            Amount
                        </Label>

                        <Input
                            id="amount"
                            type="number"
                            min="1"
                            max={availableAmount}
                            step="0.01"
                            value={data.amount}
                            onChange={(event) =>
                                setField(
                                    "amount",
                                    event.target.value,
                                )
                            }
                            placeholder="0.00"
                            required
                        />

                        <p
                            className={
                                exceedsLimit
                                    ? "text-xs text-destructive"
                                    : "text-xs text-muted-foreground"
                            }
                        >
                            Maximum available:{" "}
                            {formatCurrency(
                                availableAmount,
                            )}
                        </p>

                        {exceedsLimit && (
                            <p className="text-xs font-medium text-destructive">
                                This amount exceeds the
                                employee's available
                                cash advance limit.
                            </p>
                        )}
                    </div>

                    {/* Date */}
                    <div className="space-y-2">
                        <Label htmlFor="advance_date">
                            Advance date
                        </Label>

                        <Input
                            id="advance_date"
                            type="date"
                            value={data.advance_date}
                            onChange={(event) =>
                                setField(
                                    "advance_date",
                                    event.target.value,
                                )
                            }
                            required
                        />
                    </div>

                    {/* Reason */}
                    <div className="space-y-2">
                        <Label htmlFor="reason">
                            Reason
                        </Label>

                        <Textarea
                            id="reason"
                            value={data.reason}
                            onChange={(event) =>
                                setField(
                                    "reason",
                                    event.target.value,
                                )
                            }
                            placeholder="Why does the employee need this cash advance?"
                            rows={5}
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-2 border-t pt-4">
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
                            type="button"
                            onClick={submit}
                            disabled={
                                processing ||
                                amount < 1 ||
                                exceedsLimit ||
                                availableAmount <= 0
                            }
                        >
                            {processing
                                ? "Creating..."
                                : "Create cash advance"}
                        </Button>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}