

"use client"

import { useEffect } from "react"
import { useAuthStore } from "@/store/useAuthStore"
import { Me } from "@/app/features/hooks/Auth"


export function AuthInitializer() {
  const { isLoading } = Me()
  const setLoading = useAuthStore((s) => s.setLoading)

  useEffect(() => {
    setLoading(isLoading)
  }, [isLoading, setLoading])

  return null
}