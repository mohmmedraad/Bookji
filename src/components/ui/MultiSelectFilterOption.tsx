import { useEffect, useState } from "react"
import { useQueryState } from "nuqs"

import { MultiSelect } from "./MultiSelect"

type Option = {
    id: number | string
    name: string
}

interface MultiSelectFilterOptionProps<T extends Option> {
    param: string
    data: T[] | undefined
    isLoading: boolean
    renderOption?: React.FC<T>
}

const MultiSelectFilterOption = <T extends Option>({
    param,
    data,
    isLoading,
    renderOption,
}: MultiSelectFilterOptionProps<T>) => {
    const [selectedParam, setSelectedParam] = useQueryState(param)
    const [selectedOptions, setSelectedOptions] = useState<T[] | null>(null)

    useEffect(
        () => {
            if (!selectedOptions) return
            const newSelectedOptions =
                selectedOptions.length !== 0
                    ? selectedOptions.map((option) => option.name).join(".")
                    : ""
            if (newSelectedOptions === (selectedParam || "")) return
            void setSelectedParam(newSelectedOptions)
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [selectedOptions]
    )
    // clear the selected categories if the categoriesParam is null

    useEffect(() => {
        if (selectedParam !== null) return
        void setSelectedOptions(null)
    }, [selectedParam])

    return (
        <MultiSelect
            selected={selectedOptions}
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            defaultSelected={selectedParam ? selectedParam.split(".") : []}
            data={data}
            isLoading={isLoading}
            renderOption={renderOption}
            setSelected={setSelectedOptions}
        />
    )
}

export default MultiSelectFilterOption
