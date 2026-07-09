
import { Role } from "@prisma/client"

export const isAdmin = (role?: string) => {
    return role === Role.ADMIN || role === Role.STAFF
}

export function getRedirectPath(role: Role | undefined) {
  switch (role) {
    case "ADMIN":
      return "/admin/dashboard"

    case "STAFF":
      return "/admin/order"

    default:
      return "/customer/home"
  }
}