import { useEffect, useState, type FC } from "react"
import { useQueryState } from "nuqs"

import { trpc } from "@/app/_trpc/client"

import { MultiSelect } from "./ui/MultiSelect"

interface StoresFilterProps {}

type Store = {
    id: number
    name: string
}

const StoresFilter: FC<StoresFilterProps> = ({}) => {
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
        />
    )
}

export default StoresFilter
