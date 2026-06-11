"use client"
import {  AlertDialog,  AlertDialogAction,  AlertDialogCancel,  AlertDialogContent,  AlertDialogHeader, AlertDialogTitle, AlertDialogFooter} from "@/components/ui/alert-dialog"

export function DeleteDialog({ open, onOpenChange, onConfirm}: { open: boolean, onOpenChange: (open: boolean) => void, onConfirm: () => void }) {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        ທ່ານຕ້ອງການລຶບສິນຄ້ານີ້ແທ້ຫຼືບໍ່?
                    </AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>
                        ຍົກເລີກ
                    </AlertDialogCancel>
                    <AlertDialogAction onClick={onConfirm} className="bg-red-500 hover:bg-red-600 text-white">
                        ລຶບ
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}