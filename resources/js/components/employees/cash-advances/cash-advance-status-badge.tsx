import type { CashAdvanceStatus } from "@/types/cash-advance";

type Props = {
    status: CashAdvanceStatus | string | null | undefined;
};

const variants: Record<
    string,
    {
        label: string;
        className: string;
    }
> = {
    pending: {
        label: "Pending",
        className:
            "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    },

    approved: {
        label: "Approved",
        className:
            "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    },

    rejected: {
        label: "Rejected",
        className:
            "bg-destructive/10 text-destructive",
    },

    paid: {
        label: "Paid",
        className:
            "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    },

    cancelled: {
        label: "Cancelled",
        className:
            "bg-muted text-muted-foreground",
    },

    active: {
        label: "Active",
        className:
            "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    },

    unpaid: {
        label: "Unpaid",
        className:
            "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    },

    outstanding: {
        label: "Outstanding",
        className:
            "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    },

    completed: {
        label: "Completed",
        className:
            "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    },
};

export function CashAdvanceStatusBadge({
    status,
}: Props) {
    const key = String(status ?? "pending").toLowerCase();

    const variant = variants[key] ?? {
        label: key
            ? key.charAt(0).toUpperCase() + key.slice(1)
            : "Unknown",
        className:
            "bg-muted text-muted-foreground",
    };

    return (
        <span
            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${variant.className}`}
        >
            {variant.label}
        </span>
    );
}