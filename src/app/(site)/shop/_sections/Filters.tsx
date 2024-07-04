import { type FC } from "react"
import { Filter } from "lucide-react"
import { useQueryState } from "nuqs"

import { Button } from "@/components/ui/button"
import CategoriesFilter from "@/components/ui/CategoriesFilterOption"
import { Label } from "@/components/ui/Label"
import RangeFilter from "@/components/ui/RangeFilterOption"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/Sheet"
import StoresFilter from "@/components/ui/StoresFilterOption"

interface FiltersProps {}

const Filters: FC<FiltersProps> = ({}) => {
    const [, setCategoriesParam] = useQueryState("categories")
    const [, setPriceParam] = useQueryState("price")
    const [, setRatingParam] = useQueryState("rating")
    const [, setStoresParam] = useQueryState("stores")

    function handleClearFilters() {
        void setStoresParam("")
        void setCategoriesParam("")
        void setPriceParam("0-500")
        void setRatingParam("0-5")
    }

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant={"outline"}>
                    <Filter className="h-4 w-4 text-slate-900" />
                </Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="flex h-full flex-col gap-5">
                    <div className="flex h-full flex-col gap-5">
                        <div className="space-y-4">
                            <Label className="text-sm font-medium tracking-wide text-foreground">
                                Price range
                            </Label>
                            <RangeFilter
                                param="price"
                                minRangeValue={0}
                                maxRangeValue={500}
                            />
                        </div>
                        <div className="space-y-4">
                            <Label className="text-sm font-medium tracking-wide text-foreground">
                                Rating range
                            </Label>
                            <RangeFilter
                                param="rating"
                                minRangeValue={0}
                                maxRangeValue={5}
                                step={0.5}
                            />
                        </div>
                        <div className="space-y-4">
                            <Label className="text-sm font-medium tracking-wide text-foreground">
                                Categories
                            </Label>
                            <CategoriesFilter />
                        </div>
                        <div className="space-y-4">
                            <Label className="text-sm font-medium tracking-wide text-foreground">
                                Stores
                            </Label>
                            <StoresFilter />
                        </div>
                    </div>
                    <div className="shrink-0 py-4">
                        <Button className="w-full" onClick={handleClearFilters}>
                            Clear filters
                        </Button>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )
}

export default Filters
