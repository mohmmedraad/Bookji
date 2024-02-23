"use client"

import { useState, type FC } from "react"

import SearchBar from "@/components/ui/SearchBar"
import MobileSearchBar from "@/components/MobileSearchBar"

import Filters from "./Filters"

interface FilterBarProps {
    // onSearchParamsChange: (params: Omit<SearchParams, "userId">) => void
}

const FilterBar: FC<FilterBarProps> = ({}) => {
    const [isClosed, setIsClosed] = useState(true)
    return (
        <div className="flex items-center justify-between">
            <SearchBar className="hidden min-w-[250px] sm:block" />
            <MobileSearchBar
                className="flex sm:hidden"
                isClosed={isClosed}
                isFocused={() => setIsClosed(false)}
                isBlurred={() => setIsClosed(true)}
            />
            {!isClosed ? null : <Filters />}
        </div>
    )
}

export default FilterBar
