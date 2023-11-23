import {
    useEffect,
    useState,
    type Dispatch,
    type FC,
    type SetStateAction,
} from "react"
import { type Category, type FiltersType } from "@/types"
import { Slider } from "@nextui-org/react"
import { Filter } from "lucide-react"

import { type Cost } from "@/lib/validations/book"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { MultiSelect } from "@/components/ui/MultiSelect"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/Sheet"

interface FiltersProps {
    onFiltersChange: Dispatch<SetStateAction<FiltersType>>
}

const Filters: FC<FiltersProps> = ({ onFiltersChange }) => {
    const [categories, setCategories] = useState<Category[] | null>(null)
    const [cost, setCost] = useState<Cost>({ min: 0, max: 500 })
    const [minCost, setMinCost] = useState(0)
    const [maxCost, setMaxCost] = useState(0)

    function handleClearFilters() {
        setCategories(null)
        setCost({ min: 0, max: 500 })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => onFiltersChange({ categories, cost }), [categories, cost])
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant={"outline"}>
                    <Filter className="h-4 w-4 text-slate-900" />
                </Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-5">
                    <div className="space-y-4">
                        <label className="text-sm font-medium tracking-wide text-foreground">
                            Price range ($)
                        </label>
                        <Slider
                            aria-label="price range"
                            step={1}
                            minValue={0}
                            maxValue={500}
                            defaultValue={[0, 500]}
                            value={[minCost, maxCost]}
                            onChange={(value) => {
                                if (typeof value !== "number") {
                                    setMinCost(value[0])
                                    setMaxCost(value[1])
                                }
                            }}
                            onChangeEnd={(value) =>
                                setCost(
                                    typeof value !== "number"
                                        ? {
                                              min: value[0],
                                              max: value[1],
                                          }
                                        : { min: 0, max: 500 }
                                )
                            }
                            className="max-w-md"
                        />
                        <div className="flex items-center gap-4">
                            <Input
                                aria-label="min price"
                                type="number"
                                min={0}
                                max={500}
                                value={minCost}
                                onChange={(e) => setMinCost(+e.target.value)}
                            />
                            <span className="text-muted-foreground">-</span>
                            <Input
                                aria-label="max price"
                                type="number"
                                min={0}
                                max={500}
                                value={maxCost}
                                onChange={(e) => setMaxCost(+e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-sm font-medium tracking-wide text-foreground">
                            Categories
                        </label>
                        <MultiSelect
                            selected={categories}
                            setSelected={setCategories}
                        />
                    </div>
                    <div className="py-4">
                        <Button className="w-full" onClick={handleClearFilters}>
                            Clear filters
                        </Button>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )
}

export default Filters
