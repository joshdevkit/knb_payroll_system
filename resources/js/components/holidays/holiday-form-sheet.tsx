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
import { useHolidayForm } from "@/hooks/holidays/useHolidayForm";
import type { Holiday } from "@/types/holiday";
type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    holiday: Holiday | null;
};
const selectClass =
    "h-9 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring";
export function HolidayFormSheet({ open, onOpenChange, holiday }: Props) {
    const { data, processing, setField, submit } = useHolidayForm({
        holiday,
        open,
        onSuccess: () => onOpenChange(false),
    });
    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        submit();
    };
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            {" "}
            <SheetContent side="right" className="w-full sm:max-w-lg">
                {" "}
                <SheetHeader className="border-b">
                    {" "}
                    <SheetTitle>
                        {" "}
                        {holiday ? "Edit holiday" : "Add holiday"}{" "}
                    </SheetTitle>{" "}
                    <SheetDescription>
                        {" "}
                        {holiday
                            ? "Update the holiday information."
                            : "Add a holiday to the payroll calendar."}{" "}
                    </SheetDescription>{" "}
                </SheetHeader>{" "}
                <form
                    onSubmit={handleSubmit}
                    className="flex min-h-0 flex-1 flex-col"
                >
                    {" "}
                    <div className="flex-1 space-y-6 px-4 py-6">
                        {" "}
                        <div className="space-y-4">
                            {" "}
                            {/* Date */}{" "}
                            <Field label="Holiday date" required>
                                {" "}
                                <Input
                                    type="date"
                                    value={data.holiday_date}
                                    onChange={(event) =>
                                        setField("holiday_date", event.target.value)
                                    }
                                    required
                                />{" "}
                            </Field>{" "}
                            {/* Name */}{" "}
                            <Field label="Holiday name" required>
                                {" "}
                                <Input
                                    value={data.name}
                                    onChange={(event) =>
                                        setField("name", event.target.value)
                                    }
                                    placeholder="e.g. New Year's Day"
                                    required
                                />{" "}
                            </Field>{" "}
                            {/* Type */}{" "}
                            <Field label="Type" required>
                                {" "}
                                <select
                                    className={selectClass}
                                    value={data.type}
                                    onChange={(event) =>
                                        setField(
                                            "type",
                                            event.target
                                                .value as Holiday["type"],
                                        )
                                    }
                                    required
                                >
                                    {" "}
                                    <option value="regular">
                                        {" "}
                                        Regular Holiday{" "}
                                    </option>{" "}
                                    <option value="special">
                                        {" "}
                                        Special Non-Working Holiday{" "}
                                    </option>{" "}
                                    <option value="local">
                                        {" "}
                                        Local Holiday{" "}
                                    </option>{" "}
                                </select>{" "}
                            </Field>{" "}
                        </div>{" "}
                    </div>{" "}
                    <SheetFooter className="border-t sm:flex-row sm:justify-end">
                        {" "}
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={processing}
                        >
                            {" "}
                            Cancel{" "}
                        </Button>{" "}
                        <Button type="submit" disabled={processing}>
                            {" "}
                            {processing && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}{" "}
                            {holiday ? "Save changes" : "Add holiday"}{" "}
                        </Button>{" "}
                    </SheetFooter>{" "}
                </form>{" "}
            </SheetContent>{" "}
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
            {" "}
            <Label>
                {" "}
                {label}{" "}
                {required && (
                    <span className="ml-1 text-destructive"> * </span>
                )}{" "}
            </Label>{" "}
            {children}{" "}
        </div>
    );
}
