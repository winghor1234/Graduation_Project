// "use client"

// import { authApi } from "@/app/features/api"
// import { useAuthStore } from "@/store/useAuthStore"
// import { useEffect } from "react"


// export function AuthInitializer() {
//     const setUser = useAuthStore((s) => s.setUser)
//     const setLoading = useAuthStore((s) => s.setLoading)
    

//     useEffect(() => {
//         const fetchUser = async () => {
//             try {
//                 const user = await authApi.me()
//                 setUser(user?.data)
//             } catch {
//                 setUser(null)
//             } finally {
//                 setLoading(false)
//             }
//         }

//         fetchUser()
//     }, [])

//     return null
// }


"use client"

import { useEffect } from "react"
import { useAuthStore } from "@/store/useAuthStore"
import { useEmployeeMe } from "@/app/features/hooks/Auth"


export function AuthInitializer() {
  const { isLoading } = useEmployeeMe()
  const setLoading = useAuthStore((s) => s.setLoading)

  useEffect(() => {
    setLoading(isLoading)
  }, [isLoading, setLoading])

  return null
}