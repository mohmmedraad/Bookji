import { useEffect, useState, type FC } from "react"
import { Slider } from "@nextui-org/react"
import { useQueryState } from "nuqs"

import { useBooksSearchParams } from "@/hooks/useBooksSearchParams"
import useDebounce from "@/hooks/useDebounce"
import { useIsMount } from "@/hooks/useIsMount"

import { Input } from "./Input"

interface RangeFilterOptionProps {
    minRangeValue: number
    maxRangeValue: number
    param: keyof Omit<
        ReturnType<typeof useBooksSearchParams>,
        "handleClearSearch"
    >
    step?: number
}

function getSliderValue(index: number, price: string | null) {
    if (price && !isNaN(+price.split("-")[index]))
        return +price.split("-")[index]
}

const RangeFilterOption: FC<RangeFilterOptionProps> = ({
    maxRangeValue,
    minRangeValue,
    param,
    step = 1,
}) => {
    const [, setRangeParam] = useQueryState(param)
    const searchParams = useBooksSearchParams()
    const isMount = useIsMount()

    const [range, setRange] = useState({
        min: getSliderValue(0, searchParams[param]) || minRangeValue,
        max: getSliderValue(1, searchParams[param]) || maxRangeValue,
    })

    const rangeValue = useDebounce(range, 500)

    useEffect(() => {
        // preventing the initial render from setting the query param
        if (rangeValue === null || !isMount) return

        void setRangeParam(`${rangeValue.min}-${rangeValue.max}`)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rangeValue])

    return (
        <>
            <Slider
                aria-label={`${param} range`}
                step={step}
                minValue={minRangeValue}
                maxValue={maxRangeValue}
                defaultValue={[minRangeValue, maxRangeValue]}
                value={[range.min, range.max]}
                onChange={(value) => {
                    if (typeof value !== "number") {
                        setRange({
                            min: value[0],
                            max: value[1],
                        })
                    }
                }}
                className="max-w-md"
            />

            <div className="flex items-center gap-4">
                <Input
                    aria-label={`min ${param}`}
                    type="number"
                    min={minRangeValue}
                    max={maxRangeValue}
                    value={range.min}
                    step={step}
                    onChange={(e) =>
                        setRange((prev) => ({
                            ...prev,
                            min: +e.target.value,
                        }))
                    }
                />
                <span className="text-muted-foreground">-</span>
                <Input
                    aria-label={`max ${param}`}
                    type="number"
                    min={minRangeValue}
                    max={maxRangeValue}
                    value={range.max}
                    step={step}
                    onChange={(e) =>
                        setRange((prev) => ({
                            ...prev,
                            max: +e.target.value,
                        }))
                    }
                />
            </div>
        </>
    )
}

export default RangeFilterOption
