"use client"
import { LucideIcon } from "lucide-react"
import { Card, CardContent } from "../ui/card"

export function SummaryCard({ title, value, icon: Icon }: {
    title: string
    value: number
    icon: LucideIcon
}) {
    return (
        <Card className="rounded-2xl shadow">
            <CardContent className="p-4 flex items-center justify-between">
                <div>
                    <p className="text-sm text-muted-foreground">{title}</p>
                    <h2 className="text-xl font-bold">
                        ${value.toLocaleString()}
                    </h2>
                </div>
                <Icon />
            </CardContent>
        </Card>
    )
}