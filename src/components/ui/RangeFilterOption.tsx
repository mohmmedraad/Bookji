import { type FC } from "react"
import { Slider } from "@nextui-org/react"
import { useQueryState } from "nuqs"

import { useBooksSearchParams } from "@/hooks/useBooksSearchParams"

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

    const minRange = getSliderValue(0, searchParams[param]) || minRangeValue
    const maxRange = getSliderValue(1, searchParams[param]) || maxRangeValue

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

export default RangeFilterOption
