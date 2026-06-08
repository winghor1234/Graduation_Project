import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { CreateProvinceInput, Province, updateProvinceInput } from '@/modules/location/location.type';
import { ProvinceFormValues } from '@/schemas/schema';
import { UseMutationResult } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

type Props = {
    open: boolean
    onOpenChange: (open: boolean) => void
    province?: Province
    create: UseMutationResult<Province, Error, CreateProvinceInput>
    update: UseMutationResult<Province,Error, { id: string; data: updateProvinceInput }>
}

export function ProvinceFormDialog({ open, onOpenChange, province, create, update }: Props) {
    const isEdit = !!province

    const { register, handleSubmit, reset } = useForm({
        defaultValues: { province_name: "" }
    })

    useEffect(() => {
        if (province) {
            reset({ province_name: province.province_name })
        }
    }, [province])

    const onSubmit = async (values: ProvinceFormValues ) => {
        if (isEdit) {
            await update.mutateAsync({
                id: province.province_id,
                data: { province_name: values.province_name },
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
                    <DialogTitle>
                        {isEdit ? "Edit Province" : "Add Province"}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <Input {...register("province_name")} placeholder="Province name..." />
                    <Button type="submit" className="w-full">
                        {isEdit ? "Update" : "Create"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}