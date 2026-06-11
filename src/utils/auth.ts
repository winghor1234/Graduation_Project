
import { Role } from "@prisma/client"

export const isAdmin = (role?: string) => {
    return role === Role.ADMIN || role === Role.STAFF
}

export function getRedirectPath(role: Role | undefined) {
  switch (role) {
    case "ADMIN":
      return "/dashboard"

    case "STAFF":
      return "/order"

    default:
      return "/home"
  }
}