import { create } from "zustand"

interface Store {
    searchValue: string
    category: string
    coast: string
    setSearchValue: (searchValue: string) => void
    setCategory: (category: string) => void
    setCoast: (coast: string) => void
}

const useShopSearch = create<Store>((set) => ({
    searchValue: "",
    category: "",
    coast: "",
    setSearchValue: (searchValue) => set({ searchValue }),
    setCategory: (category) => set({ category }),
    setCoast: (coast) => set({ coast }),
}))

export default useShopSearch
