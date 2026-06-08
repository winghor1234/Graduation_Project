import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { CreateDistrictInput, District, Province, updateDistrictInput } from "@/modules/location/location.type"
import { DistrictFormValues } from "@/schemas/schema"
import { UseMutationResult } from "@tanstack/react-query"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"

type Props = {
    open: boolean
    onOpenChange: (open: boolean) => void
    district?: District
    create: UseMutationResult<District, Error, CreateDistrictInput>
    update: UseMutationResult<District, Error, { id: string; data: updateDistrictInput }>
    provinces: Province[]
}

export function DistrictFormDialog({ open, onOpenChange, district, create, update, provinces }: Props) {

    const isEdit = !!district

    const { register, handleSubmit, reset, formState: { errors }, watch, setValue } = useForm({
        defaultValues: {
            province_id: "",
            district_name: "",
        }
    })

    useEffect(() => {
        if (district) {
            reset({
                district_name: district.district_name,
                province_id: district.province.province_id
            })
        }
    }, [district])


    const onSubmit = async (values: DistrictFormValues) => {

        if (isEdit) {
            await update.mutateAsync({
                id: district.district_id,
                data: values
            })
        } else {
            console.log("values : ",values)
            await create.mutateAsync(values)
        }

        onOpenChange(false)
        reset()
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{isEdit ? "Edit" : "Create"} District</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <Input {...register("district_name")} placeholder="District name..." />
                        <div className="h-6 text-red-500">{errors.district_name?.message}</div>
                    </div>
                    <div>
                        <Select
                            onValueChange={(value) => setValue("province_id", value)}
                            defaultValue={watch("province_id")}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select province..." />
                            </SelectTrigger>

                            <SelectContent>
                                {provinces.map((p,index) => (
                                    <SelectItem key={p.province_id} value={p.province_id}>
                                     {index + 1}. {p.province_name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <div className="h-6 text-red-500">
                            {errors.province_id?.message}
                        </div>
                    </div>
                    <Button type="submit" className="w-full">
                        Submit
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}