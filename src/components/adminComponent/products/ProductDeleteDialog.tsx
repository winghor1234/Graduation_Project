"use client"
import {  AlertDialog,  AlertDialogAction,  AlertDialogCancel,  AlertDialogContent,  AlertDialogHeader, AlertDialogTitle, AlertDialogFooter} from "@/components/ui/alert-dialog"
export function DeleteDialog({ open, onOpenChange, onConfirm}: { open: boolean, onOpenChange: (open: boolean) => void, onConfirm: () => void }) {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Delete this product?
                    </AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction onClick={onConfirm}>
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

    )
}