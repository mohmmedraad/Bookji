import { type FC } from "react"
import { Slider } from "@nextui-org/react"
import { useQueryState } from "nuqs"

import { useBooksSearchParam } from "@/hooks/useBooksSearchParams"

import { Input } from "./ui/Input"

interface RangeFilterProps {
    minRangeValue: number
    maxRangeValue: number
    param: keyof ReturnType<typeof useBooksSearchParam>
    step?: number
}

function getSliderValue(index: number, price: string | null) {
    if (price && !isNaN(+price.split("-")[index]))
        return +price.split("-")[index]
}

const RangeFilter: FC<RangeFilterProps> = ({
    maxRangeValue,
    minRangeValue,
    param,
    step = 1,
}) => {
    const [, setRangeParam] = useQueryState(param)
    const searchParams = useBooksSearchParam()

    const minRange = getSliderValue(0, searchParams[param]) || 0
    const maxRange = getSliderValue(1, searchParams[param]) || 5

    return (
        <>
            <Slider
                aria-label="price range"
                step={step}
                minValue={minRangeValue}
                maxValue={maxRangeValue}
                defaultValue={[minRangeValue, maxRangeValue]}
                value={[minRange, maxRange]}
                onChange={(value) => {
                    if (typeof value !== "number") {
                        void setRangeParam(
                            `${value[minRangeValue]}-${value[1]}`
                        )
                    }
                }}
                className="max-w-md"
            />

            <div className="flex items-center gap-4">
                <Input
                    aria-label="min price"
                    type="number"
                    min={minRangeValue}
                    max={maxRangeValue}
                    value={minRange}
                    step={step}
                    onChange={(e) => {
                        void setRangeParam(
                            (prev) =>
                                `${e.target.value}-${
                                    prev?.split("-")[1] || maxRangeValue
                                }`
                        )
                    }}
                />
                <span className="text-muted-foreground">-</span>
                <Input
                    aria-label="max price"
                    type="number"
                    min={minRangeValue}
                    max={maxRangeValue}
                    value={maxRange}
                    step={step}
                    onChange={(e) => {
                        void setRangeParam(
                            (prev) =>
                                `${prev?.split("-")[0] || minRangeValue}-${
                                    e.target.value
                                }`
                        )
                    }}
                />
            </div>
        </>
    )
}

export default RangeFilter
