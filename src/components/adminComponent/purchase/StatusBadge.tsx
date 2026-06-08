import { Badge } from "@/components/ui/badge"

export const getStatusBadge = (status: string) => {
    switch (status) {
        case "pending":
            return <Badge className="bg-yellow-500 text-white">Pending</Badge>

        case "approved":
            return <Badge className="bg-blue-500 text-white">Approved</Badge>

        case "completed":
            return <Badge className="bg-green-600 text-white">Completed</Badge>

        case "cancelled":
            return <Badge className="bg-red-500 text-white">Cancelled</Badge>

        default:
            return <Badge variant="secondary">{status}</Badge>
    }
}