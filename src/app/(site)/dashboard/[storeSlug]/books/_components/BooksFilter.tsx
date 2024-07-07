import { type FC } from "react"
import { FilterIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import CategoriesFilterOption from "@/components/ui/categories-filter-option"
import Filter from "@/components/ui/Filter"
import FilterLabel from "@/components/ui/filter-label"
import FilterOption from "@/components/ui/filter-option"
import RangeFilterOption from "@/components/ui/range-filter-option"

interface BooksFilterProps {}

const BooksFilter: FC<BooksFilterProps> = ({}) => {
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
                <FilterLabel>Orders range</FilterLabel>
                <RangeFilterOption
                    param="orders"
                    minRangeValue={0}
                    maxRangeValue={300}
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
