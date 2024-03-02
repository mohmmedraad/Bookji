import { type FC } from "react"
import { FilterIcon } from "lucide-react"

import { useOrdersSearchParams } from "@/hooks/useOrdersSearchParams"
import { Button } from "@/components/ui/Button"
import Filter from "@/components/ui/Filter"
import FilterLabel from "@/components/ui/FilterLabel"
import FilterOption from "@/components/ui/FilterOption"
import RangeFilterOption from "@/components/ui/RangeFilterOption"
import SearchInput from "@/components/ui/SearchInput"

interface DashboardOrdersFilterProps {}

const DashboardOrdersFilter: FC<DashboardOrdersFilterProps> = ({}) => {
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
            <FilterOption className="mt-5">
                <FilterLabel>City</FilterLabel>
                <SearchInput param="city" />
            </FilterOption>
            <FilterOption className="mt-5">
                <FilterLabel>State</FilterLabel>
                <SearchInput param="state" />
            </FilterOption>
            <FilterOption className="mt-5">
                <FilterLabel>Country</FilterLabel>
                <SearchInput param="country" />
            </FilterOption>
        </Filter>
    )
}

export default DashboardOrdersFilter
