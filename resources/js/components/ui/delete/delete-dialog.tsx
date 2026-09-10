import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2, Trash2 } from "lucide-react";

type DeleteDialogProps = {
    open: boolean;
    title?: string;
    description?: string;
    confirmLabel?: string;
    cancelLabel?: string;
    loading?: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
};

export function DeleteDialog({
    open,
    title = "Are you sure?",
    description = "This action cannot be undone. This will permanently delete the selected record.",
    confirmLabel = "Delete",
    cancelLabel = "Cancel",
    loading = false,
    onOpenChange,
    onConfirm,
}: DeleteDialogProps) {
    return (
        <AlertDialog
            open={open}
            onOpenChange={(value) => {
                if (!loading) {
                    onOpenChange(value);
                }
            }}
        >
            <AlertDialogContent>
                <AlertDialogHeader>
                    <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
                        <Trash2 className="h-5 w-5 text-destructive" />
                    </div>

                    <AlertDialogTitle>
                        {title}
                    </AlertDialogTitle>

                    <AlertDialogDescription>
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel disabled={loading}>
                        {cancelLabel}
                    </AlertDialogCancel>

                    <AlertDialogAction
                        disabled={loading}
                        onClick={(event) => {
                            event.preventDefault();
                            onConfirm();
                        }}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Deleting...
                            </>
                        ) : (
                            <>
                                <Trash2 className="mr-2 h-4 w-4" />
                                {confirmLabel}
                            </>
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}