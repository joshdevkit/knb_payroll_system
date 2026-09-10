import { Head, usePage } from "@inertiajs/react";
import { Loader2, RotateCcw, Save } from "lucide-react";
import { FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import AuthenticatedLayout from "@/components/layouts/authenticated-layout";
import { useSettingsForm } from "@/hooks/settings/useSettingsForm";
import type { SettingsPageProps } from "@/types/settings";
import { SettingField } from "@/components/settings/field";

export default function Settings() {
    const { settings } = usePage<SettingsPageProps>().props;

    const {
        data,
        processing,
        setField,
        submit,
    } = useSettingsForm(settings);

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        submit();
    };

    const reset = () => {
        setField(
            "holiday_pay_enabled",
            settings.holiday_pay_enabled,
        );
        setField(
            "holiday_regular_multiplier",
            String(settings.holiday_regular_multiplier),
        );
        setField(
            "holiday_special_multiplier",
            String(settings.holiday_special_multiplier),
        );
        setField(
            "late_grace_minutes",
            String(settings.late_grace_minutes),
        );
        setField(
            "night_shift_start",
            settings.night_shift_start?.slice(0, 5) ?? "22:00",
        );
        setField(
            "night_shift_end",
            settings.night_shift_end?.slice(0, 5) ?? "06:00",
        );
        setField(
            "night_shift_multiplier",
            String(settings.night_shift_multiplier),
        );
        setField(
            "overtime_threshold_minutes",
            String(settings.overtime_threshold_minutes),
        );
        setField(
            "overtime_multiplier",
            String(settings.overtime_multiplier),
        );
    };

    return (
        <AuthenticatedLayout
            title="Settings"
            description="Configure payroll calculation rules"
        >
            <Head title="Settings" />
            <div className="mx-auto space-y-6">
                <div>
                    <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                        Configuration
                    </p>

                    <h1 className="mt-1 font-display text-2xl font-bold sm:text-3xl">
                        Payroll settings
                    </h1>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Configure the rules used when generating payroll.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Holidays */}
                    <section className="overflow-hidden rounded-lg border bg-card">
                        <div className="border-b px-5 py-4">
                            <h2 className="font-semibold">
                                Holiday pay
                            </h2>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Configure how regular, special, and local
                                holidays are calculated.
                            </p>
                        </div>

                        <div className="space-y-6 p-5">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <Label>
                                        Enable holiday pay
                                    </Label>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        Include holiday pay when generating
                                        payroll.
                                    </p>
                                </div>

                                <Switch
                                    checked={data.holiday_pay_enabled}
                                    onCheckedChange={(checked) =>
                                        setField(
                                            "holiday_pay_enabled",
                                            checked,
                                        )
                                    }
                                />
                            </div>

                            <div className="grid gap-5 sm:grid-cols-2">
                                <SettingField
                                    label="Regular holiday multiplier"
                                    description="Example: 2.00 = 200% of daily rate."
                                >
                                    <Input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={
                                            data.holiday_regular_multiplier
                                        }
                                        onChange={(event) =>
                                            setField(
                                                "holiday_regular_multiplier",
                                                event.target.value,
                                            )
                                        }
                                    />
                                </SettingField>

                                <SettingField
                                    label="Special / local multiplier"
                                    description="Used for special non-working and local holidays."
                                >
                                    <Input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={
                                            data.holiday_special_multiplier
                                        }
                                        onChange={(event) =>
                                            setField(
                                                "holiday_special_multiplier",
                                                event.target.value,
                                            )
                                        }
                                    />
                                </SettingField>
                            </div>

                            <div className="rounded-md border bg-muted/30 p-4 text-sm">
                                <div className="font-medium">
                                    Holiday calculation
                                </div>

                                <div className="mt-2 grid gap-2 text-muted-foreground sm:grid-cols-3">
                                    <div>
                                        <span className="font-medium text-foreground">
                                            Regular:
                                        </span>{" "}
                                        {data.holiday_regular_multiplier}×
                                    </div>

                                    <div>
                                        <span className="font-medium text-foreground">
                                            Special:
                                        </span>{" "}
                                        {data.holiday_special_multiplier}×
                                    </div>

                                    <div>
                                        <span className="font-medium text-foreground">
                                            Local:
                                        </span>{" "}
                                        {data.holiday_special_multiplier}×
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Tardiness */}
                    <section className="overflow-hidden rounded-lg border bg-card">
                        <div className="border-b px-5 py-4">
                            <h2 className="font-semibold">
                                Attendance & tardiness
                            </h2>

                            <p className="mt-1 text-sm text-muted-foreground">
                                Configure attendance-related payroll
                                calculations.
                            </p>
                        </div>

                        <div className="p-5">
                            <SettingField
                                label="Late grace period"
                                description="Minutes allowed before tardiness is deducted."
                            >
                                <div className="relative">
                                    <Input
                                        type="number"
                                        min="0"
                                        value={data.late_grace_minutes}
                                        onChange={(event) =>
                                            setField(
                                                "late_grace_minutes",
                                                event.target.value,
                                            )
                                        }
                                    />
                                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                                        minutes
                                    </span>
                                </div>
                            </SettingField>
                        </div>
                    </section>

                    {/* Night differential */}
                    <section className="overflow-hidden rounded-lg border bg-card">
                        <div className="border-b px-5 py-4">
                            <h2 className="font-semibold">
                                Night differential
                            </h2>

                            <p className="mt-1 text-sm text-muted-foreground">
                                Configure the night shift period and
                                additional compensation.
                            </p>
                        </div>

                        <div className="grid gap-5 p-5 sm:grid-cols-3">
                            <SettingField
                                label="Start time"
                                description="Beginning of NSD period."
                            >
                                <Input
                                    type="time"
                                    value={data.night_shift_start}
                                    onChange={(event) =>
                                        setField(
                                            "night_shift_start",
                                            event.target.value,
                                        )
                                    }
                                />
                            </SettingField>

                            <SettingField
                                label="End time"
                                description="End of NSD period."
                            >
                                <Input
                                    type="time"
                                    value={data.night_shift_end}
                                    onChange={(event) =>
                                        setField(
                                            "night_shift_end",
                                            event.target.value,
                                        )
                                    }
                                />
                            </SettingField>

                            <SettingField
                                label="NSD multiplier"
                                description="Example: 0.10 = additional 10%."
                            >
                                <Input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={data.night_shift_multiplier}
                                    onChange={(event) =>
                                        setField(
                                            "night_shift_multiplier",
                                            event.target.value,
                                        )
                                    }
                                />
                            </SettingField>
                        </div>
                    </section>

                    {/* Overtime */}
                    <section className="overflow-hidden rounded-lg border bg-card">
                        <div className="border-b px-5 py-4">
                            <h2 className="font-semibold">
                                Overtime
                            </h2>

                            <p className="mt-1 text-sm text-muted-foreground">
                                Configure overtime qualification and rate.
                            </p>
                        </div>

                        <div className="grid gap-5 p-5 sm:grid-cols-2">
                            <SettingField
                                label="Minimum overtime"
                                description="Overtime below this duration is not included."
                            >
                                <div className="relative">
                                    <Input
                                        type="number"
                                        min="0"
                                        value={
                                            data.overtime_threshold_minutes
                                        }
                                        onChange={(event) =>
                                            setField(
                                                "overtime_threshold_minutes",
                                                event.target.value,
                                            )
                                        }
                                    />

                                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                                        minutes
                                    </span>
                                </div>
                            </SettingField>

                            <SettingField
                                label="Overtime multiplier"
                                description="Example: 1.25 = 125% of hourly rate."
                            >
                                <Input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={data.overtime_multiplier}
                                    onChange={(event) =>
                                        setField(
                                            "overtime_multiplier",
                                            event.target.value,
                                        )
                                    }
                                />
                            </SettingField>
                        </div>
                    </section>

                    <div className="flex items-center justify-end gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={reset}
                            disabled={processing}
                        >
                            <RotateCcw className="mr-2 h-4 w-4" />
                            Reset
                        </Button>

                        <Button
                            type="submit"
                            disabled={processing}
                        >
                            {processing ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Save className="mr-2 h-4 w-4" />
                            )}

                            Save settings
                        </Button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
