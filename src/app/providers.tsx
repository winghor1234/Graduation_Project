"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactNode, useState } from "react"

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime:            1000 * 60 * 5,  // 5 ນາທີ — ບໍ່ refetch ທຸກຄັ້ງ
            gcTime:               1000 * 60 * 10, // 10 ນາທີ cache ຢູ່ memory
            refetchOnWindowFocus: false,           // ບໍ່ refetch ເວລາ switch tab
            refetchOnReconnect:   false,           // ບໍ່ refetch ເວລາ reconnect
            retry:                1,               // retry ເທື່ອດຽວ (default 3)
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}