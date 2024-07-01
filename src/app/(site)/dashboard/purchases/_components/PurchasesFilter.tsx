import { type FC } from "react"
import { FilterIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import Filter from "@/components/ui/filter"
import FilterLabel from "@/components/ui/filter-label"
import FilterOption from "@/components/ui/filter-option"
import RangeFilterOption from "@/components/ui/range-filter-option"
import StoresFilterOption from "@/components/ui/stores-filter-option"

interface PurchasesFilterProps {}

const PurchasesFilter: FC<PurchasesFilterProps> = ({}) => {
    return (
        <Filter
            renderButton={() => (
                <Button variant={"outline"}>
                    <FilterIcon className="h-4 w-4 text-slate-900" />
                </Button>
            )}
            renderTitle={() => "Filters"}
        >
            <FilterOption>
                <FilterLabel>Total range</FilterLabel>
                <RangeFilterOption
                    param="total"
                    minRangeValue={0}
                    maxRangeValue={500}
                />
            </FilterOption>
            <FilterOption className="mt-3">
                <FilterLabel>Stores</FilterLabel>
                <StoresFilterOption />
            </FilterOption>
        </Filter>
    )
}

export default PurchasesFilter
