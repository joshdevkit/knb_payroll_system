import { FormEvent, useEffect, useState } from "react";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import type { Category } from "@/types/category";

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    categories: Category[];
};

export function CategoryManagerDialog({ open, onOpenChange, categories }: Props) {
    const [editing, setEditing] = useState<Category | null>(null);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [isActive, setIsActive] = useState(true);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        if (!open) {
            setEditing(null);
            setName("");
            setDescription("");
            setIsActive(true);
        }
    }, [open]);

    const startCreate = () => {
        setEditing(null);
        setName("");
        setDescription("");
        setIsActive(true);
    };

    const startEdit = (category: Category) => {
        setEditing(category);
        setName(category.name);
        setDescription(category.description ?? "");
        setIsActive(category.is_active);
    };

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setProcessing(true);

        const data = {
            name,
            description,
            ...(editing ? { is_active: isActive } : {}),
        };

        const options = {
            preserveScroll: true,
            onSuccess: () => startCreate(),
            onFinish: () => setProcessing(false),
        };

        if (editing) {
            router.put(`/categories/${editing.id}`, data, options);
        } else {
            router.post("/categories", data, options);
        }
    };

    const remove = (category: Category) => {
        if (!window.confirm(`Delete category "${category.name}"?`)) return;

        router.delete(`/categories/${category.id}`, {
            preserveScroll: true,
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Manage categories</DialogTitle>
                    <DialogDescription>
                        Create and manage employee departments and categories.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-6 md:grid-cols-[1fr_1.2fr]">
                    <form onSubmit={submit} className="space-y-4 rounded-lg border p-4">
                        <div>
                            <h3 className="font-medium">
                                {editing ? "Edit category" : "New category"}
                            </h3>
                            <p className="text-xs text-muted-foreground">
                                {editing
                                    ? "Update the selected category."
                                    : "Add a category for employee assignment."}
                            </p>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="category-name">Name</Label>
                            <Input
                                id="category-name"
                                value={name}
                                onChange={(event) => setName(event.target.value)}
                                placeholder="e.g. Housekeeping"
                                required
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="category-description">Description</Label>
                            <textarea
                                id="category-description"
                                value={description}
                                onChange={(event) => setDescription(event.target.value)}
                                placeholder="Optional description"
                                className="min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            />
                        </div>

                        {editing && (
                            <label className="flex items-center gap-2 text-sm">
                                <input
                                    type="checkbox"
                                    checked={isActive}
                                    onChange={(event) => setIsActive(event.target.checked)}
                                    className="h-4 w-4 rounded border-input"
                                />
                                Active category
                            </label>
                        )}

                        <div className="flex justify-end gap-2">
                            {editing && (
                                <Button type="button" variant="outline" onClick={startCreate} disabled={processing}>
                                    Cancel
                                </Button>
                            )}
                            <Button type="submit" disabled={processing}>
                                {processing ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : editing ? (
                                    <Pencil className="mr-2 h-4 w-4" />
                                ) : (
                                    <Plus className="mr-2 h-4 w-4" />
                                )}
                                {editing ? "Save changes" : "Add category"}
                            </Button>
                        </div>
                    </form>

                    <div className="min-h-0">
                        <div className="mb-3 flex items-center justify-between">
                            <div>
                                <h3 className="font-medium">Categories</h3>
                                <p className="text-xs text-muted-foreground">
                                    {categories.length} total
                                </p>
                            </div>
                        </div>

                        <div className="max-h-80 overflow-y-auto rounded-lg border">
                            {categories.length === 0 ? (
                                <div className="p-8 text-center text-sm text-muted-foreground">
                                    No categories yet.
                                </div>
                            ) : (
                                <div className="divide-y">
                                    {categories.map((category) => (
                                        <div key={category.id} className="flex items-center justify-between gap-3 p-3">
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <span className="truncate text-sm font-medium">
                                                        {category.name}
                                                    </span>
                                                    {!category.is_active && (
                                                        <span className="text-xs text-muted-foreground">
                                                            Inactive
                                                        </span>
                                                    )}
                                                </div>
                                                {category.description && (
                                                    <p className="truncate text-xs text-muted-foreground">
                                                        {category.description}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="flex shrink-0 items-center gap-1">
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon-sm"
                                                    onClick={() => startEdit(category)}
                                                    aria-label={`Edit ${category.name}`}
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon-sm"
                                                    className="text-destructive hover:text-destructive"
                                                    onClick={() => remove(category)}
                                                    aria-label={`Delete ${category.name}`}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                        Done
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
