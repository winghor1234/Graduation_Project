"use client"

import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useRef, useEffect } from "react";
import { ArrowLeft, Shield } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { useEmployeeResendOTP, useEmployeeVerifyOtp } from "@/app/features/hooks/Auth";


export default function VerifyOTPPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const { mutate: verifyOtp, isPending } = useEmployeeVerifyOtp();
  const { mutate: resendOtp, isPending: isResending } = useEmployeeResendOTP();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [resendTimer, setResendTimer] = useState(60);

  // const { handleSubmit, formState: { errors }, setError, clearErrors, } = useForm<VerifyOTPInput>({ resolver: zodResolver(otpSchema) });
  const { handleSubmit, formState: { errors }, setError, clearErrors, } = useForm();

  useEffect(() => {
    if (!email) router.push("/forgot-password");
  }, [email]);


  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;

    setOtp(newOtp);
    clearErrors("otp");

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const onSubmit = () => {
    const otpValue = otp.join("");

    if (otpValue.length !== 6) {
      setError("otp", { message: "ກະລຸນາປ້ອນຕົວເລກໃຫ້ຄົບທັງ 6 ຫຼັກ" });
      return;
    }

    verifyOtp(
      { email, otp: otpValue },
      {
        onSuccess: () => {
          toast.success("ຢືນຢັນ OTP ສຳເລັດແລ້ວ!");
          router.push(`/reset-password?email=${email}`);
        },
        onError: () => {
          setError("otp", { message: "ລະຫັດ OTP ບໍ່ຖືກຕ້ອງ" });
          toast.error("ລະຫັດ OTP ບໍ່ຖືກຕ້ອງ");
        },
      }
    );
  };

  return (
    <>
      <Toaster />
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            ປ້ອນລະຫັດ OTP
          </Label>

          <div className="flex gap-2 justify-center">
            {otp.map((digit, index) => (
              <Input
                key={index}
                ref={(el) => {
                  if (el !== null) {
                    inputRefs.current[index] = el;
                  }
                }} type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                className={`w-12 h-12 text-center font-bold ${errors.otp ? "border-red-500" : ""
                  }`}
              />
            ))}
          </div>

          {/* {errors.otp && (
            <p className="text-sm text-red-500 flex items-center gap-1 justify-center">
              <AlertCircle className="h-4 w-4" />
              {errors.otp.message}
            </p>
          )} */}
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isPending}
        >
          {isPending ? "ກຳລັງຢືນຢັນ..." : "ຢືນຢັນ OTP"}
        </Button>
        <button
          type="button"
          disabled={resendTimer > 0 || isResending}
          onClick={() => {
            resendOtp({ email }, {
              onSuccess: () => {
                toast.success("ສົ່ງລະຫັດ OTP ໃໝ່ສຳເລັດແລ້ວ")
                setResendTimer(60)
              },
              onError: () => {
                toast.error("ບໍ່ສາມາດສົ່ງລະຫັດ OTP ໃໝ່ໄດ້")
              }
            })
          }}
          className="text-sm text-blue-600 hover:text-blue-700 disabled:text-gray-400"
        >
          {resendTimer > 0
            ? `ສົ່ງ OTP ອີກຄັ້ງໃນ ${resendTimer} ວິນາທີ`
            : "ສົ່ງ OTP ອີກຄັ້ງ"}
        </button>

        <Link
          href="/forgot-password"
          className="flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-gray-900 w-full py-2"
        >
          <ArrowLeft className="h-4 w-4" />
          ກັບຄືນ
        </Link>

      </form>
    </>
  );
}