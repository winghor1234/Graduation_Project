import { NextRequest, NextResponse } from "next/server"
import { expenseService } from "@/modules/expense/expense.service"

export async function GET() {
    try {
        const expenses = await expenseService.getAll()
        return NextResponse.json({ data: expenses })
    } catch {
        return NextResponse.json({ message: "Internal server error" }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { amount, reason, note, expense_date } = body

        if (!amount || !reason) {
            return NextResponse.json({ message: "amount ແລະ reason ຕ້ອງໃສ່" }, { status: 400 })
        }

        const expense = await expenseService.create({ amount: Number(amount), reason, note, expense_date })
        return NextResponse.json({ data: expense }, { status: 201 })
    } catch {
        return NextResponse.json({ message: "Internal server error" }, { status: 500 })
    }
}
