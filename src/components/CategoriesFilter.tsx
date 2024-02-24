import { useEffect, useState, type FC } from "react"
import { type Category } from "@/types"
import { useQueryState } from "nuqs"

import { trpc } from "@/app/_trpc/client"

import { MultiSelect } from "./ui/MultiSelect"

interface CategoriesFilterProps {}

const CategoriesFilter: FC<CategoriesFilterProps> = ({}) => {
    const [categoriesParam, setCategoriesParam] = useQueryState("categories")
    const [categories, setCategories] = useState<Category[] | null>(null)

    const { data, isLoading } = trpc.getAllCategories.useQuery(undefined, {
        cacheTime: Infinity,
        staleTime: Infinity,
    })

    useEffect(
        () => {
            if (!categories) return

            const newCategories =
                categories.length !== 0
                    ? categories.map((category) => category.name).join(".")
                    : ""

            if (newCategories === (categoriesParam || "")) return

            void setCategoriesParam(newCategories)
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [categories]
    )

    return (
        <MultiSelect
            selected={categories}
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            setSelected={setCategories}
            defaultSelected={categoriesParam ? categoriesParam.split(".") : []}
            data={data}
            isLoading={isLoading}
        />
    )
}

export default CategoriesFilter
