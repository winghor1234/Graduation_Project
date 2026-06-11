"use client"

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, ArrowLeft, Mail } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { useEmployeeForgotPassword } from "@/app/features/hooks/Auth";
import { ForgotPasswordInput } from "@/modules/auth/auth.type";
import z from "zod";

const forgotPasswordSchema = z.object({
    email: z.string().email(),
});

export default function ForgotPasswordPage() {
    const router = useRouter();
    const { mutate: sendOtp, isPending } = useEmployeeForgotPassword();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotPasswordInput>({
        resolver: zodResolver(forgotPasswordSchema),
    });

    const onSubmit = (data: ForgotPasswordInput) => {
        sendOtp(data, {
            onSuccess: () => {
                toast.success("ສົ່ງລະຫັດ OTP ໄປທີ່ອີເມວຂອງທ່ານແລ້ວ!");
                router.push(`/verify-otp?email=${data.email}`);
            },
            onError: () => {
                toast.error("ບໍ່ສາມາດສົ່ງລະຫັດ OTP ໄດ້");
            },
        });
    };

    return (
        <>
            <Toaster />
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                <div className="space-y-2">
                    <Label htmlFor="email">ທີ່ຢູື່ອີເມວ</Label>

                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />

                        <Input
                            id="email"
                            type="email"
                            placeholder="admin@sportswear.com"
                            {...register("email")}
                            className={`pl-10 ${errors.email ? "border-red-500" : ""}`}
                        />
                    </div>

                    {errors.email && (
                        <p className="text-sm text-red-500 flex items-center gap-1">
                            <AlertCircle className="h-4 w-4" />
                            {errors.email.message}
                        </p>
                    )}
                </div>

                <Button type="submit" className="w-full" disabled={isPending}>
                    {isPending ? "ກຳລັງສົ່ງ OTP..." : "ສົ່ງ OTP"}
                </Button>

                <Link
                    href="/login"
                    className="flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-gray-900 py-2"
                >
                    <ArrowLeft className="h-4 w-4" />
                    ກັບຄືນໄປໜ້າເຂົ້າສູ່ລະບົບ
                </Link>

            </form>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-900">
                    <strong>ໝາຍເຫດ:</strong> ລະຫັດ OTP ຈະມີອາຍຸການໃຊ້ງານໄດ້ 10 ນາທີ.
                </p>
            </div>
        </>
    );
}