"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Map, GitBranch, Building2 } from "lucide-react"

import ProvincePage from "./province/page"
import DistrictPage from "./district/page"
import BranchPage from "./branch/page"

export default function LocationLayout() {

    const [tab, setTab] = useState<"province" | "district" | "branch">("province")

    const tabs = [
        { key: "province", label: "ແຂວງ", icon: Map },
        { key: "district", label: "ເມືອງ", icon: GitBranch },
        { key: "branch", label: "ສາຂາ", icon: Building2 },
    ]

    return (
        <div >
            <div className="w-full px-4 md:px-6 pb-6">
                <div className="flex gap-2 pb-2">
                    {tabs.map((t) => {
                        const Icon = t.icon
                        const active = tab === t.key
                        return (
                            <button
                                key={t.key}
                                onClick={() => setTab(t.key as "province" | "district" | "branch")}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-2 text-sm rounded-t-lg transition duration-300 ease-in-out cursor-pointer",
                                    active
                                        ? "bg-background border border-b-0 shadow-sm text-primary"
                                        : "text-muted-foreground hover:bg-muted"
                                )}
                            >
                                <Icon className="w-4 h-4" />
                                {t.label}
                            </button>
                        )
                    })}
                </div>

                <div className="bg-background border rounded-xl shadow-sm p-4 md:p-6 min-h-[400px]">

                    {tab === "province" && <ProvincePage />}
                    {tab === "district" && <DistrictPage />}
                    {tab === "branch" && <BranchPage />}

                </div>

            </div>

        </div>
    )
}