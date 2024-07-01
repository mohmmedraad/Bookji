import { memo, type FC } from "react"

import MultiSelectFilterOption from "@/components/ui/multi-select-filter-option"
import { trpc } from "@/app/_trpc/client"

interface CategoriesFilterOptionProps {}

const CategoriesFilterOption: FC<CategoriesFilterOptionProps> = ({}) => {
    const { data, isLoading } = trpc.books.categories.useQuery(undefined, {
        cacheTime: Infinity,
        staleTime: Infinity,
    })

    return (
        <MultiSelectFilterOption
            param="categories"
            data={data}
            isLoading={isLoading}
            // renderOption={({ name }) => <div>{name}</div>}
        />
    )
}

export default memo(CategoriesFilterOption)
