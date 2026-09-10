import { Label } from "../ui/label";

export function SettingField({
    label,
    description,
    children,
}: {
    label: string;
    description?: string;
    children: React.ReactNode;
}) {
    return (
        <div className="space-y-2">
            <div>
                <Label>{label}</Label>

                {description && (
                    <p className="mt-1 text-xs text-muted-foreground">
                        {description}
                    </p>
                )}
            </div>

            {children}
        </div>
    );
}