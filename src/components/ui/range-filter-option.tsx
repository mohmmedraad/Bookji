import { memo, type FC } from "react"

import {
    useRangeFilterOption,
    type UseRangeFilterOptionProps,
} from "@/hooks/useRangeFilterOption"

import { Input } from "./input"
import { Slider } from "./slider"

interface RangeFilterOptionProps extends UseRangeFilterOptionProps {
    step?: number
}

const RangeFilterOption: FC<RangeFilterOptionProps> = ({
    maxRangeValue,
    minRangeValue,
    param,
    step = 1,
}) => {
    const { maxRange, minRange, setRange } = useRangeFilterOption({
        maxRangeValue,
        minRangeValue,
        param,
    })

    return (
        <>
            <Slider
                aria-label={`${param} range`}
                step={step}
                min={minRangeValue}
                max={maxRangeValue}
                value={[minRange, maxRange]}
                defaultValue={[minRangeValue, maxRangeValue]}
                onValueChange={(value) => {
                    setRange({
                        min: value[0],
                        max: value[1],
                    })
                }}
            />
            <div className="flex items-center gap-4">
                <Input
                    aria-label={`min ${param} range`}
                    type="number"
                    min={minRangeValue}
                    max={maxRangeValue}
                    value={minRange}
                    step={step}
                    onChange={(e) =>
                        setRange((prev) => ({
                            max: prev?.max || maxRangeValue,
                            min: +e.target.value,
                        }))
                    }
                />
                <span className="text-muted-foreground">-</span>
                <Input
                    aria-label={`max ${param} range`}
                    type="number"
                    min={minRangeValue}
                    max={maxRangeValue}
                    value={maxRange}
                    step={step}
                    onChange={(e) =>
                        setRange((prev) => ({
                            min: prev?.min || minRangeValue,
                            max: +e.target.value,
                        }))
                    }
                />
            </div>
        </>
    )
}

export default memo(RangeFilterOption)
