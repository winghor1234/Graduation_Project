import { NextRequest, NextResponse } from "next/server"
import { expenseService } from "@/modules/expense/expense.service"

export async function DELETE(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        await expenseService.delete(id)
        return NextResponse.json({ message: "ລຶບສຳເລັດ" })
    } catch {
        return NextResponse.json({ message: "Internal server error" }, { status: 500 })
    }
}
