
"use client"

import { adminApi, adminAuthApi, categoryApi, customerApi, DeliveryApi, importApi, locationApi, orderApi, paymentApi, productApi, purchaseApi, refundApi, saleApi, supplierApi } from "./api"
import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query"
import { CreateCustomerInput, UpdateCustomerInput } from "@/modules/customer/customer.type"
import { CreateEmployeeInput, UpdateEmployeeInput } from "@/modules/employee/employee.type"
import { Category, UpdateCategoryInput } from "@/modules/category/category.type"
import { CreateSupplierInput, UpdateSupplierInput } from "@/modules/supplier/supplier.type"
import { CreatePurchaseOrderInput, UpdatePurchaseOrderInput } from "@/modules/purchase/purchase.type"
import { CreateOrderInput, OrderInput, UpdateOrderStatusInput } from "@/modules/order/order.types"
import { CreateSaleInput } from "@/modules/sale/sale.type"
import { CreateRefundInput } from "@/modules/refund/refund.type"
import { ForgotPasswordInput, VerifyOTPInput } from "@/modules/auth/auth.type"
import { CreateImportInput } from '@/modules/import/import.type';
import { VerifyPaymentInput } from '@/modules/payment/payment.type';
import { CreateDeliveryInput, UpdateDeliveryInput } from "@/modules/delivery/delivery.type"
import { CreateBranchInput, CreateDistrictInput, CreateProvinceInput, updateBranchInput, updateDistrictInput, updateProvinceInput } from '@/modules/location/location.type';


export type UseGetParams = {
    page?: number
    limit?: number
    search?: string
    orderBy?: string
    order?: "asc" | "desc"
}

// export const useAuth = () => {
//     const router = useRouter()
//     const [loading, setLoading] = useState(false)

//     const login = async (data: LoginInput) => {
//         try {
//             setLoading(true)
//             await adminAuthApi.login(data)
//             router.push("/admin/dashboard")
//         } catch (error) {
//             console.log(error)
//             // 🔥 show error ให้ user
//             alert(error instanceof Error ? error.message : "Login failed")

//         } finally {
//             setLoading(false)
//         }
//     }

//     const register = async (data: RegisterInput) => {
//         try {
//             setLoading(true)
//             await adminAuthApi.register(data)
//             router.push("/auth/login")
//         } finally {
//             setLoading(false)
//         }
//     }

//     const logout = async () => {
//         await authApi.logout()
//         router.push("/auth/login")
//     }

//     const refresh = async () => {
//         await authApi.refresh()
//     }

//     return { login, register, logout, loading, refresh }
// }

export const useAuth = () => {
    const { data, isLoading } = useAdminMe()

    return {
        user: data?.data ?? null,
        isLoading,
        isAuthenticated: !!data?.data,
    }
}

export const useAdminMe = () => {
    return useQuery({
        queryKey: ["me"],
        queryFn: adminAuthApi.adminMe,
        retry: false,
        staleTime: 1000 * 60 * 5,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    })
}

export const useAdminLogin = () => {
    const qc = useQueryClient()

    return useMutation({
        mutationFn: adminAuthApi.adminLogin,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["me"] })
        },
    })
}

export const useAdminForgotPassword = () => {
    return useMutation({
        mutationFn: (data: ForgotPasswordInput) => adminAuthApi.adminForgotPassword(data),
    })
}

export const useAdminVerifyOtp = () => {
    return useMutation({
        mutationFn: (data: VerifyOTPInput) => adminAuthApi.adminVerifyOtp(data),
    })
}

export const useAdminResendOTP = () => {
    return useMutation({
        mutationFn: (data: ForgotPasswordInput) => adminAuthApi.adminResendOtp(data),
    })
}

export const useAdminResetPassword = () => {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: adminAuthApi.adminResetPassword,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["me"] })
        }
    })
}



// export const useAdminResetPassword = () => {
//     const qc = useQueryClient()

//     return useMutation<
//         {
//             user: any
//             accessToken: string
//             refreshToken: string
//         },
//         Error,
//         ResetPasswordInput
//     >({
//         mutationFn: (data) => adminAuthApi.adminResetPassword(data),

//         onSuccess: () => {
//             qc.invalidateQueries({ queryKey: ["me"] })
//         }
//     })
// }


export const useAdminRegister = () => {
    const qc = useQueryClient()

    return useMutation({
        mutationFn: adminAuthApi.adminRegister,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["me"] })
        },
    })
}

export const useAdminLogout = () => {
    const qc = useQueryClient()

    return useMutation({
        mutationFn: adminAuthApi.adminLogout,
        onSuccess: () => {
            qc.removeQueries({ queryKey: ["me"] })
            window.location.href = "/login"

        },
    })
}

export const useAdminRefresh = () => {
    return useMutation({
        mutationFn: adminAuthApi.adminRefresh,
    })
}



// -------------------------------------------------------- Product start -----------------------------------------------------------------------


export const useGetProducts = (params?: UseGetParams) => {
    return useQuery({
        queryKey: ["products", params],
        queryFn: () => productApi.getAll(params),
        placeholderData: keepPreviousData,
    })
}

export const useGetProduct = (id: string) => {
    return useQuery({
        queryKey: ["product", id],
        queryFn: () => productApi.getOne(id),
    })
}

export const useCreateProduct = () => {
    const qc = useQueryClient()

    return useMutation({
        mutationFn: productApi.create,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["products"] })
        },
    })
}

export const useUpdateProduct = () => {
    const qc = useQueryClient()

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: FormData }) => productApi.update(id, data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["products"] })
        },
    })
}

export const useDeleteProduct = () => {
    const qc = useQueryClient()

    return useMutation({
        mutationFn: productApi.delete,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["products"] })
        },
    })
}

// -------------------------------------------------------- Product end -----------------------------------------------------------------------




// -------------------------------------------------------- Category start -----------------------------------------------------------------------

// export const useGetCategories = () => {
//     return useQuery<Category[]>({
//         queryKey: ["categories"],
//         queryFn: categoryApi.getAll,
//     })
// }

export const useGetCategories = (params?: UseGetParams) => {
    return useQuery({
        queryKey: ["categories", params],
        queryFn: () => categoryApi.getAll(params),
        placeholderData: keepPreviousData,
    })
}

export const useGetCategory = (id: string) => {
    return useQuery<Category>({
        queryKey: ["category", id],
        queryFn: () => categoryApi.getOne(id),
    })
}

export const useCreateCategory = () => {
    const qc = useQueryClient()

    return useMutation({
        mutationFn: categoryApi.create,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["categories"] })
        },
    })
}

export const useUpdateCategory = () => {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: ({ id, data, }: { id: string, data: UpdateCategoryInput }) => categoryApi.update(id, data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["categories"] })
        },
    })
}

export const useDeleteCategory = () => {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: (id: string) => categoryApi.delete(id),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["categories"] })
        },
    })
}


// -------------------------------------------------------- Category end -----------------------------------------------------------------------



// -------------------------------------------------------- Customer start -----------------------------------------------------------------------


export const useGetCustomers = (params?: UseGetParams) => {
    return useQuery({
        queryKey: ["customers", params],
        queryFn: () => customerApi.getAll(params),
        placeholderData: keepPreviousData,
    })
}

export const useGetCustomer = (id: string) => {
    return useQuery({
        queryKey: ["customer", id],
        queryFn: () => customerApi.getOne(id),
    })
}

export const useCreateCustomer = () => {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: (data: CreateCustomerInput) =>
            customerApi.create(data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["customers"] })
        },
    })
}

export const useUpdateCustomer = () => {
    const qc = useQueryClient()

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateCustomerInput }) =>
            customerApi.update(id, data),

        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["customers"] })
        },
    })
}

// export const useDeleteCustomer = () => {
//     const qc = useQueryClient()

//     return useMutation({
//         mutationFn: (id: string) => customerApi.delete(id),

//         onSuccess: () => {
//             qc.invalidateQueries({ queryKey: ["customers"] })
//         },
//     })
// }

export const useUpdateCustomerStatus = () => {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: (id: string) => customerApi.updateStatus(id),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["customers"] })
        }
    })

}


// -------------------------------------------------------- Customer end -----------------------------------------------------------------------




// -------------------------------------------------------- Admin start -----------------------------------------------------------------------


export const useGetAdmin = () => {
    return useQuery({
        queryKey: ["admin"],
        queryFn: adminApi.getAll,
    })
}

export const useCreateAdmin = () => {
    const qc = useQueryClient()

    return useMutation({
        mutationFn: (data: CreateEmployeeInput) =>
            adminApi.create(data),

        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["admin"] })
        },
    })
}

export const useUpdateEmployee = () => {
    const qc = useQueryClient()

    return useMutation({
        mutationFn: ({ id, data, }: { id: string, data: UpdateEmployeeInput }) => adminApi.update(id, data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["admin"] })
        },
    })
}

// export const useDeleteEmployee = () => {
//     const qc = useQueryClient()

//     return useMutation({
//         mutationFn: (id: string) => employeeApi.delete(id),
//         onSuccess: () => {
//             qc.invalidateQueries({ queryKey: ["employees"] })
//         },
//     })
// }


// -------------------------------------------------------- Admin end -----------------------------------------------------------------------


// -------------------------------------------------------- Supplier start -----------------------------------------------------------------------


export const useAdminUpdateStatus = () => {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: adminApi.updateStatus,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["me"] })
        },
    })
}


// -------------------------------------------------------- Admin end -----------------------------------------------------------------------



// -------------------------------------------------------- Supplier start -----------------------------------------------------------------------


// export const useGetSuppliers = () => {
//     return useQuery({
//         queryKey: ["suppliers"],
//         queryFn: supplierApi.getAll
//     })
// }

export const useGetSuppliers = (params?: UseGetParams) => {
    return useQuery({
        queryKey: ["suppliers", params],
        queryFn: () => supplierApi.getAll(params),
        placeholderData: keepPreviousData,
    })
}

export const useCreateSupplier = () => {
    const qc = useQueryClient()

    return useMutation({
        mutationFn: (data: CreateSupplierInput) =>
            supplierApi.create(data),

        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["suppliers"] })
        }
    })
}

export const useUpdateSupplier = () => {
    const qc = useQueryClient()

    return useMutation({
        mutationFn: ({
            id,
            data
        }: {
            id: string
            data: UpdateSupplierInput
        }) => supplierApi.update(id, data),

        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["suppliers"] })
        }
    })
}

export const useDeleteSupplier = () => {
    const qc = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => supplierApi.delete(id),

        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["suppliers"] })
        }
    })
}


// -------------------------------------------------------- Supplier end -----------------------------------------------------------------------


// --------------------------------------------------------  Purchase start -----------------------------------------------------------------------


// export const useGetPurchaseOrders = () => {
//     return useQuery({
//         queryKey: ["purchase-orders"],
//         queryFn: purchaseApi.getAll
//     })
// }

export const useGetPurchaseOrders = (params?: UseGetParams) => {
    return useQuery({
        queryKey: ["purchase", params],
        queryFn: () => purchaseApi.getAll(params),
        placeholderData: keepPreviousData,
    })
}

export const useGetPurchaseOrder = (id: string) => {
    return useQuery({
        queryKey: ["purchase", id],
        queryFn: () => purchaseApi.getById(id),
        enabled: !!id
    })
}

export const useCreatePurchaseOrder = () => {
    const qc = useQueryClient()

    return useMutation({
        mutationFn: (data: CreatePurchaseOrderInput) =>
            purchaseApi.create(data),

        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["purchase"] })
        }
    })
}

export const useUpdatePurchaseOrder = () => {
    const qc = useQueryClient()

    return useMutation({
        mutationFn: ({
            id,
            data
        }: {
            id: string
            data: UpdatePurchaseOrderInput
        }) => purchaseApi.update(id, data),

        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["purchase"] })
        }
    })
}

export const useDeletePurchaseOrder = () => {
    const qc = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => purchaseApi.delete(id),

        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["purchase"] })
        }
    })
}



// --------------------------------------------------------  Purchase end -----------------------------------------------------------------------


// --------------------------------------------------------  Order start -----------------------------------------------------------------------

// export const useGetOrders = () => {
//     return useQuery({
//         queryKey: ["orders"],
//         queryFn: orderApi.getAll
//     })
// }
export const useGetOrders = (params?: UseGetParams) => {
    return useQuery({
        queryKey: ["orders", params],
        queryFn: () => orderApi.getAll(params),
        placeholderData: keepPreviousData,
    })
}

export const useGetOrder = (id: string) => {
    return useQuery({
        queryKey: ["order", id],
        queryFn: () => orderApi.getById(id),
        enabled: !!id
    })
}

export const useCreateOrder = () => {
    const qc = useQueryClient()

    return useMutation({
        mutationFn: orderApi.create,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["orders"] })
        }
    })
}

export const useUpdateOrderStatus = () => {
    const qc = useQueryClient()

    return useMutation({
        mutationFn: ({
            id,
            data
        }: {
            id: string
            data: UpdateOrderStatusInput
        }) => orderApi.updateStatus(id, data),

        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["orders"] })
        }
    })
}

export const useDeleteOrder = () => {
    const qc = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => orderApi.delete(id),

        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["orders"] })
        }
    })
}



// --------------------------------------------------------  Order end---------------------------------------------------------------------



// --------------------------------------------------------  sale or POS start -----------------------------------------------------------------------


// export const useGetSales = () => {
//     return useQuery({
//         queryKey: ["sales"],
//         queryFn: saleApi.getAll
//     })
// }


export const useGetSales = (params?: UseGetParams) => {
    return useQuery({
        queryKey: ["sales", params],
        queryFn: () => saleApi.getAll(params),
        placeholderData: keepPreviousData,
    })
}
export const useGetSale = (id: string) => {
    return useQuery({
        queryKey: ["sale", id],
        queryFn: () => saleApi.getById(id),
        enabled: !!id
    })
}

export const useCreateSale = () => {
    const qc = useQueryClient()

    return useMutation({
        mutationFn: (data: CreateSaleInput) =>
            saleApi.create(data),

        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["sales"] })
            qc.invalidateQueries({ queryKey: ["products"] })
        }
    })
}

// export const useDeleteSale = () => {
//     const qc = useQueryClient()

//     return useMutation({
//         mutationFn: (id: string) => saleApi.delete(id),

//         onSuccess: () => {
//             qc.invalidateQueries({ queryKey: ["sales"] })
//         }
//     })
// }



// --------------------------------------------------------  sale or POS end -----------------------------------------------------------------------



// --------------------------------------------------------  Refund start -----------------------------------------------------------------------


// export const useGetRefunds = () => {
//     return useQuery({
//         queryKey: ["refunds"],
//         queryFn: refundApi.getAll
//     })
// }

export const useGetRefunds = (params?: UseGetParams) => {
    return useQuery({
        queryKey: ["refunds", params],
        queryFn: () => refundApi.getAll(params),
        placeholderData: keepPreviousData,
    })
}

export const useGetRefund = (id: string) => {
    return useQuery({
        queryKey: ["refund", id],
        queryFn: () => refundApi.getById(id),
        enabled: !!id
    })
}

export const useCreateRefund = () => {
    const qc = useQueryClient()

    return useMutation({
        mutationFn: (data: CreateRefundInput) =>
            refundApi.create(data),

        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["refunds"] })
            qc.invalidateQueries({ queryKey: ["sales"] })
            qc.invalidateQueries({ queryKey: ["products"] })
        }
    })
}

export const useDeleteRefund = () => {
    const qc = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => refundApi.delete(id),

        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["refunds"] })
        }
    })
}



// --------------------------------------------------------  Refund end -----------------------------------------------------------------------



// --------------------------------------------------------  Import start -----------------------------------------------------------------------



export const useGetImports = (params?: UseGetParams) => {
    return useQuery({
        queryKey: ["imports", params],
        queryFn: () => importApi.getAll(params),
        placeholderData: keepPreviousData,
    })
}

export const useCreateImport = () => {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: (data: CreateImportInput) =>
            importApi.create(data),

        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["imports"] })
            qc.invalidateQueries({ queryKey: ["products"] })
        }
    })
}


export const useDeleteImport = () => {
    const qc = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => importApi.delete(id),

        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["imports"] })
        }
    })
}





// --------------------------------------------------------  Import end -----------------------------------------------------------------------



// --------------------------------------------------------  Import end -----------------------------------------------------------------------


export const useGetPayment = (params?: UseGetParams) => {
    return useQuery({
        queryKey: ["payments", params],
        queryFn: () => paymentApi.getAll(params),
        placeholderData: keepPreviousData,
    })
}


export const useGetPaymentById = (id: string) => {
    return useQuery({
        queryKey: ["payment", id],
        queryFn: () => paymentApi.getById(id),
        enabled: !!id
    })
}


export const useCreatePayment = () => {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: paymentApi.create,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["payments"] })
        }
    })
}



export const useVerifyPayment = () => {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: ({
            id,
            data
        }: {
            id: string
            data: VerifyPaymentInput
        }) =>
            paymentApi.verifyPayment(id, data),

        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["payments"] })
        }
    })
}




// --------------------------------------------------------  Payment end -----------------------------------------------------------------------



// --------------------------------------------------------  Delivery start -----------------------------------------------------------------------



export const useGetDeliveries = (params?: UseGetParams) => {
    return useQuery({
        queryKey: ["deliveries", params],
        queryFn: () => DeliveryApi.getAll(params),
        placeholderData: keepPreviousData,
    })
}


export const useGetDelivery = (id: string) => {
    return useQuery({
        queryKey: ["delivery", id],
        queryFn: () => DeliveryApi.getById(id),
        enabled: !!id
    })
}


export const useCreateDelivery = () => {
    const qc = useQueryClient()

    return useMutation({
        mutationFn: (data: CreateDeliveryInput) => DeliveryApi.create(data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["deliveries"] })
        }
    })
}



export const useUpdateDelivery = () => {
    const qc = useQueryClient()

    return useMutation({
        mutationFn: ({
            id,
            data
        }: {
            id: string
            data: UpdateDeliveryInput
        }) => DeliveryApi.update(id, data),

        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["deliveries"] })
        }
    })
}


// --------------------------------------------------------  Delivery end -----------------------------------------------------------------------



// --------------------------------------------------------  Location start -----------------------------------------------------------------------


// export const useGetDistrictsByProvince = (provinceId: string) => {
//     return useQuery({
//         queryKey: ["districts", provinceId],
//         queryFn: () => locationApi.getDistrictsByProvince(provinceId),
//         placeholderData: keepPreviousData,
//     })
// }

// export const useGetBranchesByDistrict = (districtId: string) => {
//     return useQuery({
//         queryKey: ["branches", districtId],
//         queryFn: () => locationApi.getBranchesByDistrict(districtId),
//         placeholderData: keepPreviousData,
//     })
// }


// ----------------------------------------- Province start ---------------------------------------------------


export const useGetProvinces = (params?: UseGetParams) => {
    return useQuery({
        queryKey: ["provinces", params],
        queryFn: () => locationApi.getProvinces(params),
        placeholderData: keepPreviousData,
    })
}

export const useGetProvince = (id: string) => {
    return useQuery({
        queryKey: ["province", id],
        queryFn: () => locationApi.getProvince(id),
        enabled: !!id
    })
}

export const useCreateProvince = () => {
    const qc = useQueryClient()

    return useMutation({
        mutationFn: (data: CreateProvinceInput) => locationApi.createProvince(data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["provinces"] })
        }
    })
}


export const useUpdateProvince = () => {
    const qc = useQueryClient()

    return useMutation({
        mutationFn: ({
            id,
            data
        }: {
            id: string
            data: updateProvinceInput
        }) => locationApi.updateProvince(id, data),

        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["provinces"] })
        }
    })
}


export const useDeleteProvince = () => {
    const qc = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => locationApi.deleteProvince(id),

        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["provinces"] })
        },
        onError: () => {
            qc.invalidateQueries({ queryKey: ["provinces"] })
        },
        onSettled: () => {
            qc.invalidateQueries({ queryKey: ["provinces"] })
        }
    }
    )
}


// ----------------------------------------- Province end ---------------------------------------------------


// ----------------------------------------- District start ---------------------------------------------------


export const useGetDistricts = (params?: UseGetParams) => {
    return useQuery({
        queryKey: ["districts", params],
        queryFn: () => locationApi.getDistricts(params),
        placeholderData: keepPreviousData,
    })
}

export const useGetDistrict = (id: string) => {
    return useQuery({
        queryKey: ["district", id],
        queryFn: () => locationApi.getDistrict(id),
        enabled: !!id
    })
}

export const useCreateDistrict = () => {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: (data: CreateDistrictInput) => locationApi.createDistrict(data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["districts"] })
        }
    })
}


export const useUpdateDistrict = () => {
    const qc = useQueryClient()

    return useMutation({
        mutationFn: ({
            id,
            data
        }: {
            id: string
            data: updateDistrictInput
        }) => locationApi.updateDistrict(id, data),

        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["districts"] })
        }
    })
}


export const useDeleteDistrict = () => {
    const qc = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => locationApi.deleteDistrict(id),

        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["districts"] })
        },
        onError: () => {
            qc.invalidateQueries({ queryKey: ["districts"] })
        },
        onSettled: () => {
            qc.invalidateQueries({ queryKey: ["districts"] })
        }
    })

}
// ----------------------------------------- District end ---------------------------------------------------


// ----------------------------------------- Branch start ---------------------------------------------------

export const useGetBranches = (params?: UseGetParams) => {
    return useQuery({
        queryKey: ["branches", params],
        queryFn: () => locationApi.getBranches(params),
        placeholderData: keepPreviousData,
    })
}


export const useGetBranch = (id: string) => {
    return useQuery({
        queryKey: ["branch", id],
        queryFn: () => locationApi.getBranch(id),
        enabled: !!id
    })
}


export const useCreateBranch = () => {
    const qc = useQueryClient()

    return useMutation({
        mutationFn: (data: CreateBranchInput) => locationApi.createBranch(data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["branches"] })
        }
    })
}



export const useUpdateBranch = () => {
    const qc = useQueryClient()

    return useMutation({
        mutationFn: ({
            id,
            data
        }: {
            id: string
            data: updateBranchInput
        }) => locationApi.updateBranch(id, data),

        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["branches"] })
        }
    })
}


export const useDeleteBranch = () => {
    const qc = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => locationApi.deleteBranch(id),

        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["branches"] })
        },
        onError: () => {
            qc.invalidateQueries({ queryKey: ["branches"] })
        }, onSettled: () => {
            qc.invalidateQueries({ queryKey: ["branches"] })
        }
    }
    )


    // ----------------------------------------- Branch end ---------------------------------------------------



}

// --------------------------------------------------------  Location end -----------------------------------------------------------------------


