import type { LucideIcon } from "lucide-react";

type Props = {
    label: string;
    value: string;
    icon?: LucideIcon;
    className?: string;
};

export function CashAdvanceStatCard({
    label,
    value,
    icon: Icon,
    className = "",
}: Props) {
    return (
        <div className="rounded-lg border bg-card p-5">
            <div className="flex items-center justify-between gap-3">
                <p className="text-sm text-muted-foreground">
                    {label}
                </p>

                {Icon && (
                    <Icon className="h-4 w-4 text-muted-foreground" />
                )}
            </div>

            <p
                className={`mt-2 text-2xl font-bold tracking-tight ${className}`}
            >
                {value}
            </p>
        </div>
    );
}