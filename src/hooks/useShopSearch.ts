import { create } from "zustand"

import { type Cost } from "@/lib/validations/book"
import { type Option } from "@/components/ui/MultiSelect"

interface Store {
    searchValue: string
    categories: Option[]
    cost: Cost
    setSearchValue: (searchValue: string) => void
    setCategories: (categories: Option[]) => void
    setCoast: (cost: Cost) => void
}

const useShopSearch = create<Store>((set) => ({
    searchValue: "",
    categories: [],
    cost: "free",
    setSearchValue: (searchValue) => set({ searchValue }),
    setCategories: (categories) => set({ categories }),
    setCoast: (cost) => set({ cost }),
}))

export default useShopSearch
