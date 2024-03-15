import { type FC } from "react"
import { FilterIcon } from "lucide-react"

import { useOrdersSearchParams } from "@/hooks/useOrdersSearchParams"
import { Button } from "@/components/ui/Button"
import Filter from "@/components/ui/Filter"
import FilterLabel from "@/components/ui/FilterLabel"
import FilterOption from "@/components/ui/FilterOption"
import RangeFilterOption from "@/components/ui/RangeFilterOption"
import StoresFilterOption from "@/components/ui/StoresFilterOption"

interface PurchasesFilterProps {}

const PurchasesFilter: FC<PurchasesFilterProps> = ({}) => {
    const { handleClearSearch } = useOrdersSearchParams()

    function handleClearFilters() {
        handleClearSearch()
    }

    return (
        <Filter
            renderButton={() => (
                <Button variant={"outline"}>
                    <FilterIcon className="h-4 w-4 text-slate-900" />
                </Button>
            )}
            renderTitle={() => "Filters"}
            onClearFilters={handleClearFilters}
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
