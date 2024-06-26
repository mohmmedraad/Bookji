"use client"

import { useState, type FC } from "react"

import SearchBar from "@/components/ui/search-bar"
import MobileSearchBar from "@/components/mobile-search-bar"

import ShopFilter from "./shop-filter"

interface FilterBarProps {}

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
            {!isClosed ? null : <ShopFilter />}
        </div>
    )
}

export default FilterBar
