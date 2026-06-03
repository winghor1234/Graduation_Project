import { prisma } from "@/lib/prisma"
import { comparePassword, hashPassword } from "@/utils/password"
import { sendOTPEmail } from "@/utils/email"
import { EmployeeRegisterInput, LoginInput, CustomerRegisterInput, ForgotPasswordInput, VerifyOTPInput, ResetPasswordInput, ResendOTPInput } from "./auth.type"
import { generateAccessToken, generateRefreshToken } from "@/utils/cookie"
import { BadRequestError, ForbiddenError, NotFoundError, UnauthorizedError } from "@/utils/response"
import { NextRequest } from "next/server"
import { verifyAccessToken } from "@/utils/jwt"

export const authService = {
    // CUSTOMER REGISTER
    async customerRegister(data: CustomerRegisterInput) {
        const existingUser = await prisma.customer.findFirst({
            where: { phone: data.phone }

        });

        if (existingUser) {
            throw new NotFoundError("User already exists")
        }
        const hashedPassword = await hashPassword(data.password);
        const user = await prisma.customer.create({
            data: {
                customer_name: data.customer_name,
                email: data.email,
                phone: data.phone,
                password: hashedPassword,
                gender: data.gender ?? undefined,
                address: data.address ?? undefined,
                isActive: true

            }
        });

        const accessToken = generateAccessToken(user.customer_id, user.role);
        const refreshToken = generateRefreshToken(user.customer_id);
        const refreshTokenRecord = await prisma.refreshToken.create({
            data: {
                token: refreshToken,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                customer: {
                    connect: {
                        customer_id: user.customer_id
                    }
                }
            }
        });
        if (!refreshTokenRecord) {
            throw new BadRequestError("Failed to create refresh token");
        }

        return {
            user,
            accessToken,
            refreshToken
        };

    },
    // CUSTOMER LOGIN
    async customerLogin(data: LoginInput) {
        const user = await prisma.customer.findUnique({
            where: { email: data.email }
        });
        if (!user) {
            throw new BadRequestError("Invalid email or password");
        }
        /* 🔒 CHECK ACCOUNT LOCK */
        if (user.lockUntil && user.lockUntil > new Date()) {
            throw new ForbiddenError("Account temporarily locked");
        }
        const isPasswordValid = await comparePassword(data.password, user.password);

        /* ❌ PASSWORD WRONG */
        if (!isPasswordValid) {
            const attempts = user.failedLoginAttempts + 1;
            await prisma.customer.update({
                where: { customer_id: user.customer_id },
                data: {
                    failedLoginAttempts: attempts
                }
            });
            if (attempts >= 5) {
                await prisma.customer.update({
                    where: { customer_id: user.customer_id },
                    data: {
                        lockUntil: new Date(Date.now() + 15 * 60 * 1000)
                    }
                });
                throw new ForbiddenError("Account locked for 15 minutes");
            }
            throw new BadRequestError("Invalid email or password");
        }

        /* ✅ LOGIN SUCCESS → RESET ATTEMPTS */

        await prisma.customer.update({
            where: { customer_id: user.customer_id },
            data: {
                failedLoginAttempts: 0,
                lockUntil: null
            }
        });
        const accessToken = generateAccessToken(user.customer_id, user.role);
        const refreshToken = generateRefreshToken(user.customer_id);
        await prisma.refreshToken.create({
            data: {
                token: refreshToken,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                customer: {
                    connect: {
                        customer_id: user.customer_id
                    }
                }
            }
        });
        return { user, accessToken, refreshToken };

    },


    // -----------------------------------------------------------------------------------

    // async login(data: LoginInput, type: AuthType) {

    //     let user: LoginInput;
    //     let role: "CUSTOMER" | "ADMIN" | "STAFF";
    //     let userId: string;
    //     let model: "customer" | "employee";

    //     /* 🔍 SELECT USER */
    //     if (type === "CUSTOMER") {

    //         user = await prisma.customer.findUnique({
    //             where: { email: data.email }
    //         });

    //         if (user) {
    //             role = "CUSTOMER";
    //             userId = user.customer_id;
    //             model = "customer";
    //         }

    //     } else {

    //         user = await prisma.employee.findUnique({
    //             where: { email: data.email }
    //         });

    //         if (user) {
    //             role = user.role;
    //             userId = user.employee_id;
    //             model = "employee";
    //         }

    //     }

    //     if (!user) {
    //         throw new UnauthorizedError("Invalid email or password");
    //     }

    //     /* 🔒 ACCOUNT LOCK */
    //     if (user.lockUntil && user.lockUntil > new Date()) {
    //         throw new ForbiddenError("Account temporarily locked");
    //     }

    //     const isValid = await comparePassword(data.password, user.password);

    //     const config = authConfig[role];

    //     /* ❌ WRONG PASSWORD */
    //     if (!isValid) {

    //         const attempts = user.failedLoginAttempts + 1;

    //         await prisma[model].update({
    //             where: { [model === "customer" ? "customer_id" : "employee_id"]: userId },
    //             data: { failedLoginAttempts: attempts }
    //         });

    //         if (attempts >= config.maxLoginAttempts) {

    //             await prisma[model].update({
    //                 where: { [model === "customer" ? "customer_id" : "employee_id"]: userId },
    //                 data: {
    //                     lockUntil: new Date(Date.now() + config.lockTime)
    //                 }
    //             });

    //             throw new ForbiddenError("Account locked");
    //         }

    //         throw new UnauthorizedError("Invalid email or password");
    //     }

    //     /* ✅ SUCCESS */
    //     await prisma[model].update({
    //         where: { [model === "customer" ? "customer_id" : "employee_id"]: userId },
    //         data: {
    //             failedLoginAttempts: 0,
    //             lockUntil: null
    //         }
    //     });

    //     const accessToken = generateAccessToken(userId, role);
    //     const refreshToken = generateRefreshToken(userId);

    //     await prisma.refreshToken.create({
    //         data: {
    //             token: refreshToken,
    //             expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),

    //             ...(model === "customer"
    //                 ? { customer: { connect: { customer_id: userId } } }
    //                 : { employee: { connect: { employee_id: userId } } })
    //         }
    //     });

    //     return { user, accessToken, refreshToken };

    // },
    // --------------------------------------------------------------------------------
    // FORGOT PASSWORD
    async customerForgotPassword(email: string) {
        const user = await prisma.customer.findUnique({
            where: { email }
        });
        if (!user) {
            throw new NotFoundError("User not found");
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const record = await prisma.oTP.create({
            data: {
                email,
                otp_code: otp,
                type: "RESET_PASSWORD",
                expiresAt: new Date(Date.now() + 5 * 60 * 1000)
            }
        });
        if (!record) {
            throw new BadRequestError("Failed to create OTP");
        }
        // send code to email
        sendOTPEmail(email, otp);
        return { message: "OTP sent" }
    },

    // VERIFY OTP
    async customerVerifyOTP(email: string, otp: string) {
        const record = await prisma.oTP.findFirst({
            where: {
                email,
                otp_code: otp,
                verified: false
            }
        });

        if (!record) {
            throw new BadRequestError("Invalid OTP");
        }

        if (record.expiresAt < new Date()) {
            throw new UnauthorizedError("OTP expired");
        }

        const result = await prisma.oTP.update({
            where: { otp_id: record.otp_id },
            data: { verified: true }
        });
        if (!result) {
            throw new BadRequestError("Failed to verify OTP");
        }
        return true;
    },

    // RESET PASSWORD
    async customerResetPassword(email: string, password: string) {
        const otp = await prisma.oTP.findFirst({
            where: {
                email,
                verified: true
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        if (!otp) {
            throw new BadRequestError("OTP verification required");
        }
        const hashed = await hashPassword(password);
        const result = await prisma.customer.update({
            where: { email },
            data: { password: hashed }
        });
        if (!result) {
            throw new BadRequestError("Failed to reset password");
        }
        return true;
    },

    async customerLogout(customerId: string) {
        const result = await prisma.refreshToken.deleteMany({
            where: {
                customer_id: customerId
            }
        });
        if (!result) {
            throw new BadRequestError("Failed to logout");
        }
        return true;
    },

    async refreshToken(token: string) {
        const storedToken = await prisma.refreshToken.findUnique({
            where: { token },
            include: { customer: true }
        });
        if (!storedToken) {
            throw new UnauthorizedError("Invalid refresh token");
        }

        if (!storedToken.customer) {
            throw new UnauthorizedError("Customer not found");
        }

        if (storedToken.expiresAt < new Date()) {
            throw new UnauthorizedError("Refresh token expired");
        }

        const customer = storedToken.customer;
        const newAccessToken = generateAccessToken(
            customer.customer_id,
            customer.role
        );

        const newRefreshToken = generateRefreshToken(
            customer.customer_id
        );

        await prisma.refreshToken.delete({
            where: { token }
        });

        const result = await prisma.refreshToken.create({
            data: {
                token: newRefreshToken,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                customer: {
                    connect: {
                        customer_id: customer.customer_id
                    }
                }
            }
        });
        if (!result) {
            throw new BadRequestError("Failed to create new refresh token");
        }

        return {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
        };
    },

    // Admin and staff auth---------------------------------------------------------------------------------------------------

    async adminRegister(data: EmployeeRegisterInput) {
        const existingUser = await prisma.employee.findFirst({
            where: { phone: data.phone }
        });

        if (existingUser) {
            throw new BadRequestError("User already exists")
        }
        const hashedPassword = await hashPassword(data.password);
        const user = await prisma.employee.create({
            data: {
                employee_name: data.employee_name,
                email: data.email,
                phone: data.phone,
                password: hashedPassword
            }
        });
        if (!user) {
            throw new BadRequestError("Failed to create user");
        }

        const accessToken = generateAccessToken(user.employee_id, user.role);
        const refreshToken = generateRefreshToken(user.employee_id);
        const refreshTokenRecord = await prisma.refreshToken.create({
            data: {
                token: refreshToken,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                employee: {
                    connect: {
                        employee_id: user.employee_id
                    }
                }
            }
        });
        if (!refreshTokenRecord) {
            throw new BadRequestError("Failed to create refresh token");
        }

        return {
            user,
            accessToken,
            refreshToken
        };

    },

    async adminLogin(data: LoginInput) {
        const user = await prisma.employee.findUnique({
            where: { email: data.email }
        });
        if (!user) {
            throw new BadRequestError("Invalid email or password");
        }

        /* 🔒 CHECK ACCOUNT LOCK */
        if (user.lockUntil && user.lockUntil > new Date()) {
            throw new ForbiddenError("Account temporarily locked");
        }

        const isPasswordValid = await comparePassword(
            data.password,
            user.password
        );

        /* ❌ PASSWORD WRONG */
        if (!isPasswordValid) {
            const attempts = user.failedLoginAttempts + 1;
            await prisma.employee.update({
                where: { employee_id: user.employee_id },
                data: {
                    failedLoginAttempts: attempts
                }
            });
            if (attempts >= 5) {
                await prisma.employee.update({
                    where: { employee_id: user.employee_id },
                    data: {
                        lockUntil: new Date(Date.now() + 15 * 60 * 1000)
                    }
                });
                throw new ForbiddenError("Account locked for 15 minutes");
            }
            throw new BadRequestError("Invalid email or password");
        }
        /* ✅ LOGIN SUCCESS → RESET ATTEMPTS */

        await prisma.employee.update({
            where: { employee_id: user.employee_id },
            data: {
                failedLoginAttempts: 0,
                lockUntil: null
            }
        })
        const accessToken = generateAccessToken(user.employee_id, user.role);
        const refreshToken = generateRefreshToken(user.employee_id);
        const refreshTokenRecord = await prisma.refreshToken.create({
            data: {
                token: refreshToken,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                employee: {
                    connect: {
                        employee_id: user.employee_id
                    }
                }
            }
        });
        if (!refreshTokenRecord) {
            throw new BadRequestError("Failed to create refresh token");
        }

        return { user, accessToken, refreshToken };
    },
    async adminForgotPassword(data: ForgotPasswordInput) {
        console.log("data : ", data)
        const user = await prisma.employee.findUnique({
            where: { email: data.email }
        });
        if (!user) {
            throw new NotFoundError("User not found");
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const result = await prisma.oTP.create({
            data: {
                email: data.email,
                otp_code: otp,
                type: "RESET_PASSWORD",
                expiresAt: new Date(Date.now() + 5 * 60 * 1000)
            }
        });
        if (!result) {
            throw new BadRequestError("Failed to create OTP");
        }
        console.log(`OTP: ${otp}`)
        // send code to email
        sendOTPEmail(data.email, otp);
        return { message: "OTP sent" }
    },

    // RESEND OTP 
    async adminResendOTP(data: ResendOTPInput) {
        const user = await prisma.employee.findUnique({
            where: { email: data.email }
        });
        if (!user) {
            throw new NotFoundError("User not found");
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const result = await prisma.oTP.create({
            data: {
                email: data.email,
                otp_code: otp,
                type: "RESET_PASSWORD",
                expiresAt: new Date(Date.now() + 5 * 60 * 1000)
            }
        });
        if (!result) {
            throw new BadRequestError("Failed to create OTP");
        }
        console.log(`OTP: ${otp}`)
        // send code to email
        sendOTPEmail(data.email, otp);
        return { message: "OTP sent" }
    },


    // VERIFY OTP
    async adminVerifyOTP(data: VerifyOTPInput) {
        const record = await prisma.oTP.findFirst({
            where: {
                email: data.email,
                otp_code: data.otp,
                verified: false
            }
        });

        if (!record) {
            throw new BadRequestError("Invalid OTP");
        }

        if (record.expiresAt < new Date()) {
            throw new UnauthorizedError("OTP expired");
        }

        const result = await prisma.oTP.update({
            where: { otp_id: record.otp_id },
            data: { verified: true }
        });
        if (!result) {
            throw new BadRequestError("Failed to verify OTP");
        }

        return true;
    },


    // RESET PASSWORD
    async adminResetPassword(data: ResetPasswordInput) {

        const otp = await prisma.oTP.findFirst({
            where: {
                email: data.email,
                verified: true,
                createdAt: {
                    gt: new Date(Date.now() - 10 * 60 * 1000)
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        if (!otp) {
            throw new BadRequestError("OTP verification required");
        }

        const user = await prisma.employee.findUnique({
            where: { email: data.email }
        });

        if (!user) {
            throw new NotFoundError("User not found");
        }

        const hashed = await hashPassword(data.password);

        await prisma.employee.update({
            where: { email: data.email },
            data: { password: hashed }
        });

        // ❗ invalidate old OTP
        await prisma.oTP.update({
            where: { otp_id: otp.otp_id },
            data: { verified: false }
        });

        // 🔑 login user
        const accessToken = generateAccessToken(user.employee_id, user.role);
        const refreshToken = generateRefreshToken(user.employee_id);

        const refreshTokenRecord = await prisma.refreshToken.create({
            data: {
                token: refreshToken,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                employee: {
                    connect: {
                        employee_id: user.employee_id
                    }
                }
            }
        });

        if (!refreshTokenRecord) {
            throw new BadRequestError("Failed to create refresh token");
        }

        return {
            user,
            accessToken,
            refreshToken
        };
    },

    async adminLogout(customerId: string) {

        const result = await prisma.refreshToken.deleteMany({
            where: {
                customer_id: customerId
            }
        });
        if (!result) {
            throw new BadRequestError("Failed to logout");
        }

        return true;
    },

    async adminRefreshToken(token: string) {
        const storedToken = await prisma.refreshToken.findUnique({
            where: { token },
            include: { employee: true }
        });

        if (!storedToken) {
            throw new UnauthorizedError("Invalid refresh token");
        }

        if (!storedToken.employee) {
            throw new NotFoundError("Customer not found");
        }

        if (storedToken.expiresAt < new Date()) {
            throw new UnauthorizedError("Refresh token expired");
        }
        const employee = storedToken.employee;
        const newAccessToken = generateAccessToken(
            employee.employee_id,
            employee.role
        );
        const newRefreshToken = generateRefreshToken(
            employee.employee_id
        );

        await prisma.refreshToken.delete({
            where: { token }
        });

        const refreshTokenRecord = await prisma.refreshToken.create({
            data: {
                token: newRefreshToken,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                employee: {
                    connect: {
                        employee_id: employee.employee_id
                    }
                }
            }
        });
        if (!refreshTokenRecord) {
            throw new BadRequestError("Failed to create refresh token");
        }

        return {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
        };
    },

    // get me 
    async getMe(req: NextRequest) {
        const payload = verifyAccessToken(req);
        // console.log("payload : ", payload)
        // 🔥 แยก customer / employee
        if (payload.role === "CUSTOMER") {
            const user = await prisma.customer.findUnique({
                where: { customer_id: payload.userId }
            })
            return {
                ...user,
                role: "CUSTOMER"
            }
        }

        const employee = await prisma.employee.findUnique({
            where: { employee_id: payload.userId }
        })

        return employee
    }

}