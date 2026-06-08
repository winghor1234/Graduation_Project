

"use client"

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { getRedirectPath } from "@/utils/auth";
import { useEmployeeLogin } from "../hooks/Auth";
import { LoginInput } from "@/modules/auth/auth.type";
import { loginSchema } from "../validation";



export default function LoginForm() {
    const router = useRouter();
    const { mutate: login, isPending } = useEmployeeLogin();
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginInput>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = (data: LoginInput) => {
        login(data, {
            onSuccess: (res) => {
                toast.success("Login successful!");
                const role = res?.data?.role;
                router.replace(getRedirectPath(role));
            },

            onError: () => {
                toast.error("Invalid credentials");
            },
        });
    };

    return (
        <>
            <Toaster />
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 ">
                    {/* Email */}
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="admin@sportswear.com"
                            {...register("email")}
                            className={errors.email ? "border-red-500" : ""}
                        />
                        {errors.email && (
                            <p className="text-sm text-red-500 flex items-center gap-1">
                                <AlertCircle className="h-4 w-4" />
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    {/* Password */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password">Password</Label>
                            <Link
                                href="/forgot-password"
                                className="text-sm text-blue-600 hover:text-blue-700"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                {...register("password")}
                                className={errors.password ? "border-red-500" : ""}
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </button>
                        </div>

                        {errors.password && (
                            <p className="text-sm text-red-500 flex items-center gap-1">
                                <AlertCircle className="h-4 w-4" />
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <Button type="submit" className="w-full" disabled={isPending}>
                        {isPending ? "Signing in..." : "Sign in"}
                    </Button>

                </form>

                {/* Divider */}
                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">
                            Need help?
                        </span>
                    </div>
                </div>

                {/* Help Text */}
                <p className="text-center text-sm text-gray-600">
                    Contact your administrator if you need access to the system.
                </p>
        </>
    );
}