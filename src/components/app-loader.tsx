// "use client"

// import { useAuthStore } from "@/store/useAuthStore"


// export function AppLoader({ children }: any) {
//     const loading = useAuthStore((s) => s.loading)

//     if (loading) {
//         return <div className="p-10">Loading...</div>
//     }

//     return children
// }

"use client"

import { useAuthStore } from "@/store/useAuthStore"

export function AppLoader({ children }: { children: React.ReactNode }) {
    const loading = useAuthStore((s) => s.loading)
    
    if (loading) {
        return (
            <div className="flex h-screen w-screen items-center justify-center text-sm text-gray-500">
                ກຳລັງໂຫຼດຂໍ້ມູນ...
            </div>
        )
    }
    
    return <>{children}</>
}