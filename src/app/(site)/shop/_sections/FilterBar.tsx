"use client"

import { useState, type FC } from "react"

import { categories, coasts } from "@/config/shop"
import useShopSearch from "@/hooks/useShopSearch"
import { ComboboxDemo } from "@/components/ui/Combobox"
import SearchBar from "@/components/ui/SearchBar"
import MobileSearchBar from "@/components/MobileSearchBar"

interface FilterBarProps {}

const FilterBar: FC<FilterBarProps> = ({}) => {
    const { setSearchValue, setCategory, setCoast } = useShopSearch()
    const [isClosed, setIsClosed] = useState(true)
    return (
        <div className="flex items-center justify-between">
            <SearchBar
                onValueChange={(value) => setSearchValue(value)}
                className="hidden sm:block"
            />
            <MobileSearchBar
                className="flex sm:hidden"
                isClosed={isClosed}
                onValueChange={(value) => setSearchValue(value)}
                isFocused={() => setIsClosed(false)}
                isBlurred={() => setIsClosed(true)}
            />
            {!isClosed ? null : (
                <div className="flex gap-4">
                    <ComboboxDemo
                        options={categories}
                        name="Category"
                        setFun={(value) => setCategory(value)}
                    />
                    <ComboboxDemo
                        options={coasts}
                        name="Coast"
                        setFun={(value) => setCoast(value)}
                    />
                </div>
            )}
        </div>
    )
}

export default FilterBar
