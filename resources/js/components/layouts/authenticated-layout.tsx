import { usePage } from '@inertiajs/react';
import { CheckCircle2, Menu, MoreVertical, X, XCircle } from 'lucide-react';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import Sidebar from '@/components/layouts/sidebar';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import type { Auth } from '@/types';

export default function AuthenticatedLayout({
    title,
    description,
    children,
}: {
    title: string;
    description?: string;
    actions?: ReactNode;
    children: ReactNode;
}) {
    const page = usePage<{ auth: Auth; flash?: { success?: string | null; error?: string | null } }>();
    const { auth, flash } = page.props;
    const currentPath =
        typeof window !== 'undefined' ? window.location.pathname : page.url;

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [dismissedFlash, setDismissedFlash] = useState<string | null>(null);
    const [actionsOpen, setActionsOpen] = useState(false);

    useEffect(() => {
        setSidebarOpen(window.matchMedia('(min-width: 1024px)').matches);
    }, []);

    useEffect(() => {
        if (!window.matchMedia('(min-width: 1024px)').matches) {
            setSidebarOpen(false);
        }
    }, [currentPath]);

    // Close the mobile actions sheet when the route actually changes (e.g.
    // after tapping a navigating action). Doesn't fire for query-string-only
    // changes like a branch filter, which is fine — the user can dismiss
    // manually if they're just filtering.
    useEffect(() => {
        setActionsOpen(false);
    }, [currentPath]);

    const flashMessage = flash?.success ?? flash?.error ?? null;
    const flashIsError = !flash?.success && !!flash?.error;
    const showFlash = flashMessage && flashMessage !== dismissedFlash;

    return (
        <div className="flex h-svh overflow-hidden bg-background">
            <Sidebar
                open={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                currentPath={currentPath}
                auth={auth}
            />

            <div className="flex min-w-0 flex-1 flex-col">
                <header className="flex h-14 shrink-0 items-center justify-between gap-4 border-b bg-background px-4 lg:px-6">
                    <div className="flex min-w-0 items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setSidebarOpen((value) => !value)}
                            className="flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                            aria-label={
                                sidebarOpen ? 'Hide sidebar' : 'Show sidebar'
                            }
                        >
                            <Menu className="size-4" />
                        </button>
                        <div className="min-w-0">
                            <h1 className="truncate text-base font-semibold tracking-tight">
                                {title}
                            </h1>
                            {description && (
                                <p className="truncate text-xs text-muted-foreground">
                                    {description}
                                </p>
                            )}
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-4 lg:p-6">
                    {showFlash && (
                        <div
                            className={cn(
                                'mb-4 flex items-start justify-between gap-3 rounded-lg border px-4 py-3 text-sm',
                                flashIsError
                                    ? 'border-destructive/30 bg-destructive/10 text-destructive'
                                    : 'border-primary/20 bg-primary/5 text-foreground',
                            )}
                        >
                            <div className="flex items-start gap-2">
                                {flashIsError ? (
                                    <XCircle className="mt-0.5 size-4 shrink-0" />
                                ) : (
                                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                                )}
                                <span>{flashMessage}</span>
                            </div>
                            <button
                                type="button"
                                onClick={() =>
                                    setDismissedFlash(flashMessage)
                                }
                                className="shrink-0 text-xs text-muted-foreground hover:text-foreground"
                                aria-label="Dismiss"
                            >
                                <X className="size-4" />
                            </button>
                        </div>
                    )}
                    {children}
                </main>
            </div>
        </div>
    );
}