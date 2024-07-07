import { type FC } from "react"
import { FilterIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import CustomersFilterOption from "@/components/ui/customers-filter-option"
import Filter from "@/components/ui/Filter"
import FilterLabel from "@/components/ui/filter-label"
import FilterOption from "@/components/ui/filter-option"
import RangeFilterOption from "@/components/ui/range-filter-option"

interface DashboardCustomersFilterProps {}

const DashboardCustomersFilter: FC<DashboardCustomersFilterProps> = ({}) => {
    return (
        <Filter
            renderButton={() => (
                <Button variant={"outline"}>
                    <FilterIcon className="h-4 w-4 text-slate-900" />
                </Button>
            )}
            renderTitle={() => "Filters"}
        >
            <FilterOption>
                <FilterLabel>Total spend range</FilterLabel>
                <RangeFilterOption
                    param="total_spend"
                    minRangeValue={0}
                    maxRangeValue={500}
                />
            </FilterOption>

            <FilterOption className="mt-5">
                <FilterLabel>Total orders range</FilterLabel>
                <RangeFilterOption
                    param="total_orders"
                    minRangeValue={0}
                    maxRangeValue={500}
                />
            </FilterOption>
            <FilterOption className="mt-5">
                <FilterLabel>Customers</FilterLabel>
                <CustomersFilterOption />
            </FilterOption>
        </Filter>
    )
}

export default DashboardCustomersFilter
