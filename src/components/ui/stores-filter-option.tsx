import { type FC } from "react"
import Image from "next/image"

import { trpc } from "@/app/_trpc/client"

import MultiSelectFilterOption from "./multi-select-filter-option"

interface StoresFilterOptionProps {}

const StoresFilterOption: FC<StoresFilterOptionProps> = ({}) => {
    const { data, isLoading } = trpc.store.getStores.useQuery(
        {
            searchValue: "",
        },
        {
            cacheTime: Infinity,
            staleTime: Infinity,
        }
    )

    return (
        <MultiSelectFilterOption
            param="stores"
            data={data}
            isLoading={isLoading}
            renderOption={(option) => (
                <div className="flex items-center justify-center gap-1">
                    <Image
                        src={option.logo || ""}
                        alt={option.name}
                        className="h-6 w-6 rounded-full border-[1px] border-solid border-gray-400"
                        width={12}
                        height={12}
                    />
                    <span>{option.name}</span>
                </div>
            )}
        />
    )
}

export default StoresFilterOption
