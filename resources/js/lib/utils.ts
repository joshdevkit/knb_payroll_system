import type { ClassValue } from 'clsx';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}


export function formatDate(date: string | null | undefined): string {
    if (!date) {
        return "—";
    }

    const dateOnly = date.slice(0, 10);

    const [year, month, day] = dateOnly.split("-").map(Number);

    if (!year || !month || !day) {
        return "—";
    }

    return new Intl.DateTimeFormat("en-PH", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(new Date(year, month - 1, day));
}


export function formatDateInput(
    value: string | null | undefined,
): string {
    if (!value) {
        return "";
    }
    return value.slice(0, 10);
}