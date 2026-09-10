import {
    CircleDollarSign,
    Wallet,
} from "lucide-react";

type Props = {
    limit: number;
    outstanding: number;
    available: number;
};

export function CashAdvanceSummaryCard({
    limit,
    outstanding,
    available,
}: Props) {
    const formatCurrency = (value: number) =>
        `₱${value.toLocaleString("en-PH", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`;

    return (
        <section className="rounded-lg border bg-card p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <Wallet className="h-5 w-5 text-primary" />

                        <h2 className="font-semibold">
                            Cash advance limit
                        </h2>
                    </div>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Maximum cash advance allowed per
                        cutoff.
                    </p>
                </div>

                <p className="text-2xl font-bold">
                    {formatCurrency(limit)}
                </p>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-3">
                <div className="rounded-md border bg-muted/30 p-4">
                    <p className="text-xs text-muted-foreground">
                        Outstanding balance
                    </p>

                    <p className="mt-1 font-semibold">
                        {formatCurrency(outstanding)}
                    </p>
                </div>

                <div className="rounded-md border bg-muted/30 p-4">
                    <p className="text-xs text-muted-foreground">
                        Available
                    </p>

                    <p
                        className={`mt-1 font-semibold ${
                            available > 0
                                ? "text-emerald-600 dark:text-emerald-400"
                                : "text-destructive"
                        }`}
                    >
                        {formatCurrency(available)}
                    </p>
                </div>

                <div className="rounded-md border bg-muted/30 p-4">
                    <p className="text-xs text-muted-foreground">
                        Limit usage
                    </p>

                    <div className="mt-2 flex items-center gap-2">
                        <CircleDollarSign className="h-4 w-4 text-muted-foreground" />

                        <p className="font-semibold">
                            {limit > 0
                                ? `${Math.min(
                                      (outstanding / limit) *
                                          100,
                                      100,
                                  ).toFixed(0)}%`
                                : "0%"}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}