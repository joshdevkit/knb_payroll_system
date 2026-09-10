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
import { usePayrollRunForm } from "@/hooks/payroll/usePayrollRunForm";
import type { PayrollRun } from "@/types/payroll";

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    payrollRun: PayrollRun | null;
};

export function PayrollRunSheet({
    open,
    onOpenChange,
    payrollRun,
}: Props) {
    const {
        data,
        processing,
        setField,
        submit,
    } = usePayrollRunForm(
        payrollRun,
        open,
        () => onOpenChange(false),
    );

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
                className="w-full sm:max-w-lg"
            >
                <SheetHeader className="border-b">
                    <SheetTitle>
                        {payrollRun
                            ? "Edit payroll period"
                            : "Create payroll period"}
                    </SheetTitle>

                    <SheetDescription>
                        Set the payroll coverage and payment date.
                    </SheetDescription>
                </SheetHeader>

                <form
                    onSubmit={handleSubmit}
                    className="flex flex-1 flex-col"
                >
                    <div className="flex-1 space-y-6 px-4 py-6">
                        <div className="space-y-2">
                            <Label htmlFor="period_start">
                                From
                            </Label>

                            <Input
                                id="period_start"
                                type="date"
                                value={data.period_start}
                                onChange={(event) =>
                                    setField(
                                        "period_start",
                                        event.target.value,
                                    )
                                }
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="period_end">
                                To
                            </Label>

                            <Input
                                id="period_end"
                                type="date"
                                value={data.period_end}
                                onChange={(event) =>
                                    setField(
                                        "period_end",
                                        event.target.value,
                                    )
                                }
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="pay_date">
                                Pay date
                            </Label>

                            <Input
                                id="pay_date"
                                type="date"
                                value={data.pay_date}
                                onChange={(event) =>
                                    setField(
                                        "pay_date",
                                        event.target.value,
                                    )
                                }
                                required
                            />
                        </div>
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

                            {payrollRun
                                ? "Save changes"
                                : "Create payroll"}
                        </Button>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    );
}