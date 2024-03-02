import { type FC } from "react"
import { FilterIcon } from "lucide-react"

import { useBooksSearchParams } from "@/hooks/useBooksSearchParams"
import { Button } from "@/components/ui/Button"
import CategoriesFilterOption from "@/components/ui/CategoriesFilterOption"
import Filter from "@/components/ui/Filter"
import FilterLabel from "@/components/ui/FilterLabel"
import FilterOption from "@/components/ui/FilterOption"
import RangeFilterOption from "@/components/ui/RangeFilterOption"

interface BooksFilterProps {}

const BooksFilter: FC<BooksFilterProps> = ({}) => {
    const { handleClearSearch } = useBooksSearchParams()

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
                <FilterLabel>Price range</FilterLabel>
                <RangeFilterOption
                    param="price"
                    minRangeValue={0}
                    maxRangeValue={500}
                />
            </FilterOption>
            <FilterOption className="mt-5">
                <FilterLabel>Rating range</FilterLabel>
                <RangeFilterOption
                    param="rating"
                    minRangeValue={0}
                    maxRangeValue={5}
                    step={0.5}
                />
            </FilterOption>
            <FilterOption className="mt-5">
                <FilterLabel>Inventory range</FilterLabel>
                <RangeFilterOption
                    param="inventory"
                    minRangeValue={0}
                    maxRangeValue={100}
                />
            </FilterOption>
            <FilterOption className="mt-5">
                <FilterLabel>Categories</FilterLabel>
                <CategoriesFilterOption />
            </FilterOption>
        </Filter>
    )
}

export default BooksFilter
