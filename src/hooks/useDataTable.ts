

"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useMemo, useState } from "react"

type Order = "asc" | "desc"
type Filters = Record<string, string>

type SortState = {
  field: string
  order: Order
}

export function useDataTable() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // -------------------------
  // URL STATE
  // -------------------------
  const page = Number(searchParams.get("page") ?? 1)
  const limit = Number(searchParams.get("limit") ?? 10)
  const search = searchParams.get("search") ?? ""
  const sortField = searchParams.get("sort") ?? ""
  const sortOrder = (searchParams.get("order") as Order) ?? "asc"

  // -------------------------
  // BASE UPDATE FUNCTION
  // -------------------------
  const updateParams = (updates: Record<string, string | number>) => {
    const params = new URLSearchParams(searchParams.toString())

    Object.entries(updates).forEach(([key, value]) => {
      params.set(key, String(value))
    })

    router.push(`?${params.toString()}`)
  }

  // -------------------------
  // PAGINATION
  // -------------------------
  const setPage = (value: number) => {
    updateParams({ page: value })
  }

  const setLimit = (value: number) => {
    updateParams({ limit: value, page: 1 })
  }

  // -------------------------
  // SEARCH
  // -------------------------
  const setSearch = (value: string) => {
    updateParams({
      search: value,
      page: 1,
    })
  }

  // -------------------------
  // SORT (FIXED - ONLY ONE)
  // -------------------------
  const setSort = (field: string, order: Order = "asc") => {
    updateParams({
      sort: field,
      order,
      page: 1,
    })
  }

  const sort: SortState = {
    field: sortField,
    order: sortOrder,
  }

  // -------------------------
  // FILTERS
  // -------------------------
  const [filters, setFilters] = useState<Filters>({})

  const setFilter = (key: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  // -------------------------
  // API PARAMS
  // -------------------------
  const params = useMemo(() => {
    return {
      page,
      limit,
      search,
      sort: sort.field,
      order: sort.order,
      filters,
    }
  }, [page, limit, search, sortField, sortOrder, filters])

  return {
    // state
    page,
    limit,
    search,
    sort,

    // actions
    setPage,
    setLimit,
    setSearch,
    setSort,

    // filters
    filters,
    setFilter,

    // API
    params,
  }
}