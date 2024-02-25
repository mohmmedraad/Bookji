import { useEffect, useState, type FC } from "react"
import Image from "next/image"
import { useQueryState } from "nuqs"

import { trpc } from "@/app/_trpc/client"

import { MultiSelect } from "./MultiSelect"

interface StoresFilterOptionProps {}

type Store = {
    id: number
    name: string
    slug: string | null
    logo: string | null
}

const StoresFilterOption: FC<StoresFilterOptionProps> = ({}) => {
    const [storesParam, setStoresParam] = useQueryState("stores")
    const [stores, setStores] = useState<Store[] | null>(null)

    const { data, isLoading } = trpc.store.getStores.useQuery(
        {
            searchValue: "",
        },
        {
            cacheTime: Infinity,
            staleTime: Infinity,
        }
    )

    useEffect(
        () => {
            if (!stores) return

            const newStores =
                stores.length !== 0
                    ? stores.map((store) => store.name).join(".")
                    : ""

            if (newStores === (storesParam || "")) return

            void setStoresParam(newStores)
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [stores]
    )

    return (
        <MultiSelect
            selected={stores}
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            setSelected={setStores}
            defaultSelected={storesParam ? storesParam.split(".") : []}
            data={data}
            isLoading={isLoading}
            placeholder="Select stores"
            renderOption={(option) => (
                <div className="flex items-center justify-center gap-1">
                    <Image
                        src={option.logo || ""}
                        alt={option.name}
                        className="h-3 w-3 rounded-full"
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
