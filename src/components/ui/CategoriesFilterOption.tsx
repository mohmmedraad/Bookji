import { type FC } from "react"

import { trpc } from "@/app/_trpc/client"

import MultiSelectFilterOption from "./MultiSelectFilterOption"

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

export default CategoriesFilterOption
