import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Branch, District, CreateBranchInput, updateBranchInput } from "@/modules/location/location.type"
import { BranchFormValues } from "@/schemas/schema"
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
    branch?: Branch
    create: UseMutationResult<Branch, Error, CreateBranchInput>
    update: UseMutationResult<Branch, Error, { id: string; data: updateBranchInput }>
    districts: District[]
}

export function BranchFormDialog({ open, onOpenChange, branch, create, update, districts }: Props) {

    const isEdit = !!branch

    const { register, handleSubmit, reset, formState: { errors }, watch, setValue } = useForm({
        defaultValues: {
            district_id: "",
            branch_name: "",
        }
    })

    useEffect(() => {
        if (branch) {
            reset({
                branch_name: branch.branch_name,
                district_id: branch.district_id
            })
        }
    }, [branch])

    const onSubmit = async (values: BranchFormValues) => {

        if (isEdit) {
            await update.mutateAsync({
                id: branch.branch_id,
                data: values
            })
        } else {
            await create.mutateAsync(values)
        }

        onOpenChange(false)
        reset()
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{isEdit ? "Edit" : "Create"} Branch</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                    {/* branch name */}
                    <div>
                        <Input {...register("branch_name")} placeholder="Branch name..." />
                        <div className="h-6 text-red-500">{errors.branch_name?.message}</div>
                    </div>

                    {/* district select */}
                    <div>
                        <Select
                            onValueChange={(value) => setValue("district_id", value)}
                            defaultValue={watch("district_id")}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select district..." />
                            </SelectTrigger>

                            <SelectContent>
                                {districts.map((d, index) => (
                                    <SelectItem key={d.district_id} value={d.district_id}>
                                        {index + 1}. {d.district_name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <div className="h-6 text-red-500">
                            {errors.district_id?.message}
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