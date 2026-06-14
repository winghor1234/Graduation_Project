"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { Upload, X, ImageIcon } from "lucide-react"

type ExistingImage = {
    image_id: string
    image_url: string | null
}

type Props = {
    files: File[]
    setFiles: React.Dispatch<React.SetStateAction<File[]>>

    existingImages: ExistingImage[]
    setExistingImages: React.Dispatch<React.SetStateAction<ExistingImage[]>>

    max?: number
}

export default function ImageUpload({
    files,
    setFiles,
    existingImages,
    setExistingImages,
    max = 10,
}: Props) {
    const inputRef = useRef<HTMLInputElement>(null)
    const [dragging, setDragging] = useState(false)

    const safeExistingImages = existingImages.filter(
        (img) => img?.image_url && img.image_url.trim() !== ""
    )

    const total = safeExistingImages.length + files.length

    /* ---------------- FILE HANDLER ---------------- */

    const handleFiles = (fileList: FileList | null) => {
        if (!fileList) return

        const arr = Array.from(fileList).filter((f) =>
            f.type.startsWith("image/")
        )

        const remaining = max - total
        if (remaining <= 0) return

        setFiles((prev) => [...prev, ...arr.slice(0, remaining)])
    }

    const removeNewImage = (index: number) => {
        setFiles((prev) => prev.filter((_, i) => i !== index))
    }

    const removeExistingImage = (id: string) => {
        setExistingImages((prev) =>
            prev.filter((img) => img.image_id !== id)
        )
    }

    /* ---------------- UI ---------------- */

    return (
        <div className="space-y-4">

            {/* UPLOAD ZONE */}
            <div
                onClick={() => inputRef.current?.click()}
                onDragOver={(e) => {
                    e.preventDefault()
                    setDragging(true)
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => {
                    e.preventDefault()
                    setDragging(false)
                    handleFiles(e.dataTransfer.files)
                }}
                className={`
          border-2 border-dashed rounded-xl p-6 text-center cursor-pointer
          transition
          ${dragging ? "border-blue-500 bg-blue-50" : "border-gray-300"}
        `}
            >
                <input
                    ref={inputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    hidden
                    onChange={(e) => handleFiles(e.target.files)}
                />

                <Upload className="mx-auto mb-2 text-gray-500" />

                <p className="text-sm font-medium">
                    Upload images or drag & drop
                </p>

                <p className="text-xs text-gray-400">
                    {total}/{max} images
                </p>
            </div>

            {/* EMPTY STATE */}
            {total === 0 && (
                <div className="flex flex-col items-center justify-center border rounded-lg py-8 bg-gray-50">
                    <ImageIcon className="text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">No images yet</p>
                </div>
            )}

            {/* GRID */}
            {total > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">

                    {/* EXISTING IMAGES */}
                    {safeExistingImages.map((img) => (
                        <div
                            key={img.image_id}
                            className="relative aspect-square rounded-xl overflow-hidden border group"
                        >
                            {/* SAFE GUARD */}
                            {img.image_url && (
                                <Image
                                    src={img.image_url}
                                    alt="existing"
                                    fill
                                    className="object-cover"
                                />
                            )}

                            {/* DELETE */}
                            <button
                                type="button"
                                onClick={() => removeExistingImage(img.image_id)}
                                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-100 md:opacity-0 md:group-hover:opacity-100"
                            >
                                <X size={14} />
                            </button>

                            <div className="absolute bottom-2 left-2 text-[10px] bg-blue-600 text-white px-2 py-1 rounded">
                                Current
                            </div>
                        </div>
                    ))}

                    {/* NEW IMAGES */}
                    {files.map((file, index) => (
                        <div
                            key={index}
                            className="relative aspect-square rounded-xl overflow-hidden border group"
                        >
                            <Image
                                src={URL.createObjectURL(file)}
                                alt={file.name}
                                fill
                                className="object-cover"
                            />

                            <button
                                type="button"
                                onClick={() => removeNewImage(index)}
                                className="absolute top-2 right-2 bg-black text-white p-1 rounded-full opacity-0 group-hover:opacity-100"
                            >
                                <X size={14} />
                            </button>

                            <div className="absolute bottom-2 left-2 text-[10px] bg-green-600 text-white px-2 py-1 rounded">
                                New
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}