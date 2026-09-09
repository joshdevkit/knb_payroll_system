import {
    CalendarDays,
    CalendarRange,
    Clock3,
    LayoutGrid,
    ReceiptText,
    Settings,
    Users,
    WalletCards,
} from "lucide-react";

export type NavItem = {
    label: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
};

export type NavSection = {
    label: string;
    items: NavItem[];
};

export const navSections: NavSection[] = [
    {
        label: "Overview",
        items: [
            {
                label: "Dashboard",
                href: "/dashboard",
                icon: LayoutGrid,
            },
        ],
    },

    {
        label: "Payroll",
        items: [
            {
                label: "Employees",
                href: "/employees",
                icon: Users,
            },
            {
                label: "Scheduling",
                href: "/scheduling",
                icon: CalendarDays,
            },
            {
                label: "Payroll Register",
                href: "/payroll",
                icon: WalletCards,
            },
        ],
    },

    {
        label: "Deductions & Holidays",
        items: [
            {
                label: "SSS Deductions",
                href: "/sss-deductions",
                icon: ReceiptText,
            },
            {
                label: "Holidays",
                href: "/holidays",
                icon: CalendarRange,
            },
        ],
    },

    {
        label: "System",
        items: [
            {
                label: "Settings",
                href: "/settings",
                icon: Settings,
            },
        ],
    },
];