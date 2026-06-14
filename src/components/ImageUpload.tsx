"use client"

import { useMemo, useRef, useState } from "react"
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

    onDeleteExisting?: (id: string) => void

    max?: number
}

export default function ImageUpload({
    files,
    setFiles,
    existingImages,
    onDeleteExisting,
    max = 10,
}: Props) {
    const inputRef = useRef<HTMLInputElement>(null)
    const [dragging, setDragging] = useState(false)
    const safeExistingImages = useMemo(
        () =>
            existingImages.filter(
                (img) =>
                    img?.image_url &&
                    img.image_url.trim() !== ""
            ),
        [existingImages]
    )

    const totalImages =  safeExistingImages.length + files.length

    /* ---------------- FILE HANDLER ---------------- */

    const handleFiles = (
        fileList: FileList | null
    ) => {
        if (!fileList) return

        const imageFiles = Array.from(fileList)
            .filter((file) =>
                file.type.startsWith("image/")
            )
            .filter(
                (file) =>
                    file.size <= 5 * 1024 * 1024
            ) // 5MB

        const remainingSlots =
            max - totalImages

        if (remainingSlots <= 0) return

        setFiles((prev) => [
            ...prev,
            ...imageFiles.slice(0, remainingSlots),
        ])

        if (inputRef.current) {
            inputRef.current.value = ""
        }
    }

    const removeNewImage = (index: number ) => {
        setFiles((prev) =>
            prev.filter((_, i) => i !== index)
        )
    }

    const removeExistingImage = (id: string) => {
        onDeleteExisting?.(id)
    }

    /* ---------------- UI ---------------- */

    return (
        <div className="space-y-4">

            {/* Upload Zone */}

            <div
                onClick={() =>inputRef.current?.click() }
                onDragOver={(e) => {
                    e.preventDefault()
                    setDragging(true)
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => {
                    e.preventDefault()
                    setDragging(false)
                    handleFiles(  e.dataTransfer.files  )
                }}
                className={`
                    border-2 border-dashed rounded-xl
                    p-6 text-center cursor-pointer
                    transition-all
                    hover:border-primary
                    hover:bg-muted/30
                    ${dragging
                        ? "border-primary bg-primary/5"
                        : "border-muted-foreground/25"
                    }
                `}
            >
                <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    hidden
                    onChange={(e) =>
                        handleFiles(
                            e.target.files
                        )
                    }
                />

                <Upload className="mx-auto h-8 w-8 text-muted-foreground" />

                <p className="mt-2 text-sm font-medium">
                    ລາກຮູບພາບມາວາງ ຫຼື
                    ຄລິກເພື່ອເລືອກ
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                    JPG, PNG, WEBP •
                    ສູງສຸດ {max} ຮູບ
                </p>

                <div className="mt-2 text-xs font-medium">
                    {totalImages}/{max}
                </div>
            </div>

            {/* Empty */}

            {totalImages === 0 && (
                <div
                    className="
                    flex flex-col items-center
                    justify-center
                    rounded-xl border
                    bg-muted/20 py-10
                "
                >
                    <ImageIcon className="h-10 w-10 text-muted-foreground" />

                    <p className="mt-2 text-sm text-muted-foreground">
                        ຍັງບໍ່ມີຮູບພາບ
                    </p>
                </div>
            )}

            {/* Preview Grid */}

            {totalImages > 0 && (
                <div
                    className="
                    grid
                    grid-cols-2
                    sm:grid-cols-3
                    md:grid-cols-4
                    lg:grid-cols-5
                    xl:grid-cols-6
                    gap-3
                "
                >
                    {/* Existing Images */}

                    {safeExistingImages.map(
                        (img) => (
                            <div
                                key={
                                    img.image_id
                                }
                                className="
                                relative
                                aspect-square
                                overflow-hidden
                                rounded-xl
                                border
                                bg-muted
                                group
                            "
                            >
                                <Image
                                    src={
                                        img.image_url!
                                    }
                                    alt="Product"
                                    fill
                                    sizes="200px"
                                    className="object-cover"
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        removeExistingImage(
                                            img.image_id
                                        )
                                    }
                                    className="
                                    absolute
                                    top-2
                                    right-2
                                    z-10
                                    flex
                                    h-8
                                    w-8
                                    items-center
                                    justify-center
                                    rounded-full
                                    bg-red-500
                                    text-white
                                    shadow
                                    opacity-100
                                    md:opacity-0
                                    md:group-hover:opacity-100
                                    transition
                                "
                                >
                                    <X size={16} />
                                </button>

                                <span
                                    className="
                                    absolute
                                    bottom-2
                                    left-2
                                    rounded-md
                                    bg-blue-600
                                    px-2
                                    py-1
                                    text-[10px]
                                    text-white
                                "
                                >
                                    Current
                                </span>
                            </div>
                        )
                    )}

                    {/* New Images */}

                    {files.map(
                        (file, index) => {
                            const preview =
                                URL.createObjectURL(
                                    file
                                )

                            return (
                                <div
                                    key={`${file.name}-${file.lastModified}`}
                                    className="
                                    relative
                                    aspect-square
                                    overflow-hidden
                                    rounded-xl
                                    border
                                    group
                                "
                                >
                                    <Image
                                        src={
                                            preview
                                        }
                                        alt={
                                            file.name
                                        }
                                        fill
                                        sizes="200px"
                                        className="object-cover"
                                        unoptimized
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            removeNewImage(
                                                index
                                            )
                                        }
                                        className="
                                        absolute
                                        top-2
                                        right-2
                                        z-10
                                        flex
                                        h-8
                                        w-8
                                        items-center
                                        justify-center
                                        rounded-full
                                        bg-red-500
                                        text-white
                                        shadow
                                        opacity-100
                                        md:opacity-0
                                        md:group-hover:opacity-100
                                        transition
                                    "
                                    >
                                        <X
                                            size={
                                                16
                                            }
                                        />
                                    </button>

                                    <span
                                        className="
                                        absolute
                                        bottom-2
                                        left-2
                                        rounded-md
                                        bg-green-600
                                        px-2
                                        py-1
                                        text-[10px]
                                        text-white
                                    "
                                    >
                                        New
                                    </span>
                                </div>
                            )
                        }
                    )}
                </div>
            )}
        </div>
    )
}