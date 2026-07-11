"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

type Props = {
    open: boolean
    onOpenChange: (v: boolean) => void
    orderId: string | null
    onUpload: (orderId: string, file: File) => void
    isPending: boolean
}

export function SlipUploadDialog({ open, onOpenChange, orderId, onUpload, isPending }: Props) {
    const inputRef = useRef<HTMLInputElement>(null)
    const [preview, setPreview] = useState<string | null>(null)
    const [file, setFile] = useState<File | null>(null)

    const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0]
        if (!f) return
        setFile(f)
        setPreview(URL.createObjectURL(f))
    }

    const handleClose = (v: boolean) => {
        if (!v) { setPreview(null); setFile(null) }
        onOpenChange(v)
    }

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="max-w-sm rounded-2xl">
                <DialogHeader>
                    <DialogTitle className="text-base font-bold">ອັບໂຫຼດສະລິບການໂອນ</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 pt-1">
                    {preview ? (
                        <div className="relative">
                            <div className="relative h-64 w-full rounded-xl overflow-hidden border border-gray-100 bg-gray-50">
                                <Image src={preview} alt="slip preview" fill className="object-contain" />
                            </div>
                            <button
                                onClick={() => { setPreview(null); setFile(null) }}
                                className="absolute top-2 right-2 size-7 bg-white/90 border border-gray-200 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                            >
                                <X className="size-3.5 text-gray-600" />
                            </button>
                        </div>
                    ) : (
                        <button
                            type="button"
                            onClick={() => inputRef.current?.click()}
                            className="w-full border-2 border-dashed border-gray-200 hover:border-gray-400 rounded-xl p-10 text-center transition-colors group"
                        >
                            <Upload className="size-8 mx-auto mb-3 text-gray-300 group-hover:text-gray-500 transition-colors" />
                            <p className="text-sm font-semibold text-gray-700 mb-1">ກົດເພື່ອເລືອກໄຟລ໌</p>
                            <p className="text-xs text-gray-400">PNG, JPG ສູງສຸດ 10MB</p>
                        </button>
                    )}

                    <input ref={inputRef} type="file" accept="image/*" onChange={handleSelect} className="hidden" />

                    {!preview && (
                        <Button variant="outline" className="w-full rounded-xl" onClick={() => inputRef.current?.click()}>
                            ເລືອກໄຟລ໌
                        </Button>
                    )}

                    {preview && (
                        <Button
                            className="w-full h-11 rounded-xl bg-gray-900 hover:bg-gray-700 text-white font-bold gap-2"
                            onClick={() => file && orderId && onUpload(orderId, file)}
                            disabled={isPending}
                        >
                            <Upload className="size-4" />
                            {isPending ? "ກຳລັງອັບໂຫຼດ..." : "ຢືນຢັນອັບໂຫຼດ"}
                        </Button>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
