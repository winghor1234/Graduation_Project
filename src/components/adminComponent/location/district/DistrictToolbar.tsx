import { PropsTable } from "@/components/Type";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";

export function DistrictToolbar({ table, onAdd }: PropsTable) {
    return (
        <div className="flex justify-between">
            <Input
                placeholder="Search..."
                value={table.search}
                onChange={(e) => table.setSearch(e.target.value)}
                className="w-[250px]"
            />

            <Button onClick={onAdd}>
                <Plus className="w-4 h-4" />
                Add District
            </Button>
        </div>
    )
}