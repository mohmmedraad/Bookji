import { useEffect, useState, type FC } from "react"
import { type Category } from "@/types"
import { Slider } from "@nextui-org/react"
import { Filter } from "lucide-react"
import { useQueryState } from "nuqs"

import { useBooksSearchParam } from "@/hooks/useBooksSearchParams"
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
    // onFiltersChange?: Dispatch<SetStateAction<FiltersType>>
}

function getSliderValue(index: number, price: string | null) {
    if (price && !isNaN(+price.split("-")[index]))
        return +price.split("-")[index]
}

const Filters: FC<FiltersProps> = ({}) => {
    const [categoriesParam, setCategoriesParam] = useQueryState("categories")
    const [, setPriceParam] = useQueryState("price")
    const [, setRatingParam] = useQueryState("rating")
    const searchParams = useBooksSearchParam()

    const [categories, setCategories] = useState<Category[] | null>(null)
    const minPrice = getSliderValue(0, searchParams.price) || 0
    const maxPrice = getSliderValue(1, searchParams.price) || 500
    const minRating = getSliderValue(0, searchParams.rating) || 0
    const maxRating = getSliderValue(1, searchParams.rating) || 5

    function handleClearFilters() {
        void setCategoriesParam("")
        void setPriceParam("0-500")
        void setRatingParam("0-5")
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(
        () => {
            if (!categories) return

            const newCategories =
                categories.length !== 0
                    ? categories.map((category) => category.name).join(".")
                    : ""

            console.log("newCategories: ", newCategories)
            console.log("categoriesParam: ", categoriesParam)

            if (newCategories === (categoriesParam || "")) return

            void setCategoriesParam(newCategories)
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [categories]
    )

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
                            value={[minPrice, maxPrice]}
                            onChange={(value) => {
                                if (typeof value !== "number") {
                                    void setPriceParam(
                                        `${value[0]}-${value[1]}`
                                    )
                                }
                            }}
                            className="max-w-md"
                        />

                        <div className="flex items-center gap-4">
                            <Input
                                aria-label="min price"
                                type="number"
                                min={0}
                                max={500}
                                value={minPrice}
                                onChange={(e) => {
                                    void setPriceParam(
                                        (prev) =>
                                            `${e.target.value}-${
                                                prev?.split("-")[1] || 0
                                            }`
                                    )
                                }}
                            />
                            <span className="text-muted-foreground">-</span>
                            <Input
                                aria-label="max price"
                                type="number"
                                min={0}
                                max={500}
                                value={maxPrice}
                                onChange={(e) => {
                                    void setPriceParam(
                                        (prev) =>
                                            `${prev?.split("-")[0] || 500}-${
                                                e.target.value
                                            }`
                                    )
                                }}
                            />
                        </div>
                    </div>
                    <div className="space-y-4">
                        <label className="text-sm font-medium tracking-wide text-foreground">
                            Rating range
                        </label>
                        <Slider
                            aria-label="rating range"
                            step={0.5}
                            minValue={0}
                            maxValue={5}
                            defaultValue={[0, 5]}
                            value={[minRating, maxRating]}
                            onChange={(value) => {
                                if (typeof value !== "number") {
                                    void setRatingParam(
                                        `${value[0]}-${value[1]}`
                                    )
                                }
                            }}
                            className="max-w-md"
                        />
                        <div className="flex items-center gap-4">
                            <Input
                                aria-label="min rating"
                                type="number"
                                min={0}
                                max={500}
                                value={minRating}
                                onChange={(e) => {
                                    void setRatingParam(
                                        (prev) =>
                                            `${e.target.value}-${
                                                prev?.split("-")[1] || 0
                                            }`
                                    )
                                }}
                            />
                            <span className="text-muted-foreground">-</span>
                            <Input
                                aria-label="max rating"
                                type="number"
                                min={0}
                                max={500}
                                value={maxRating}
                                onChange={(e) => {
                                    void setRatingParam(
                                        (prev) =>
                                            `${prev?.split("-")[0] || 500}-${
                                                e.target.value
                                            }`
                                    )
                                }}
                            />
                        </div>
                    </div>
                    <div className="space-y-4">
                        <label className="text-sm font-medium tracking-wide text-foreground">
                            Categories
                        </label>
                        <MultiSelect
                            selected={categories}
                            // eslint-disable-next-line @typescript-eslint/no-misused-promises
                            setSelected={setCategories}
                            defaultSelected={
                                categoriesParam
                                    ? categoriesParam.split(".")
                                    : []
                            }
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
