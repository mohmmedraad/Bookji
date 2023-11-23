"use client"

import { useEffect, useState, type FC } from "react"
import { type FiltersType } from "@/types"

// import { categories, coasts } from "@/config/shop"
import { type SearchParams } from "@/lib/validations/book"
import useDebounce from "@/hooks/useDebounce"
// import useShopSearch from "@/hooks/useShopSearch"
import SearchBar from "@/components/ui/SearchBar"
import MobileSearchBar from "@/components/MobileSearchBar"

import Filters from "./Filters"

interface FilterBarProps {
    onSearchParamsChange: (params: Omit<SearchParams, "userId">) => void
}

const FilterBar: FC<FilterBarProps> = ({ onSearchParamsChange }) => {
    // const { setSearchValue, setCategories, setCoast,categories } = useShopSearch()
    const [isClosed, setIsClosed] = useState(true)
    const [filters, setFilters] = useState<FiltersType>({
        categories: null,
        cost: {
            min: 0,
            max: 500,
        },
    })
    const filersValue = useDebounce(filters, 700)
    const [searchValue, setSearchValue] = useState<string>("")

    useEffect(() => {
        onSearchParamsChange({
            categories: filersValue?.categories?.map((c) => c.id) || [],
            text: searchValue,
            cost: filersValue?.cost,
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filersValue, searchValue])
    return (
        <div className="flex items-center justify-between">
            <SearchBar
                onValueChange={(value) => setSearchValue(value)}
                className="hidden min-w-[250px] sm:block"
            />
            <MobileSearchBar
                className="flex sm:hidden"
                isClosed={isClosed}
                onValueChange={(value) => setSearchValue(value)}
                isFocused={() => setIsClosed(false)}
                isBlurred={() => setIsClosed(true)}
            />

            {!isClosed ? null : <Filters onFiltersChange={setFilters} />}
        </div>
    )
}

export default FilterBar
