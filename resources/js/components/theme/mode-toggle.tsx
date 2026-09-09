import { Moon, Sun } from "lucide-react";
import { Switch } from "../ui/switch";
import { useTheme } from "./theme-provider";

export function ModeToggle() {
    const { theme, setTheme } = useTheme();

    const isDark = theme === "dark";

    return (
        <div className="flex items-center gap-2.5 rounded-md px-2.5 py-2">
            {isDark ? (
                <Moon className="size-4 shrink-0 text-sidebar-foreground/70" />
            ) : (
                <Sun className="size-4 shrink-0 text-sidebar-foreground/70" />
            )}

            <span className="flex-1 text-sm text-sidebar-foreground/70">
                Dark mode
            </span>

            <Switch
                checked={isDark}
                onCheckedChange={(checked) =>
                    setTheme(checked ? "dark" : "light")
                }
                aria-label="Toggle dark mode"
            />
        </div>
    );
}