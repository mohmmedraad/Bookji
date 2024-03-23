"use client"

import { type FC } from "react"
import { Chart, LineAdvance } from "bizcharts"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"

interface SalesChartProps {
    data: Record<string, unknown>[]
}

const SalesChart: FC<SalesChartProps> = ({ data }) => {
    return (
        <Card className="mt-10">
            <CardHeader>
                <CardTitle>Sales</CardTitle>
            </CardHeader>
            <CardContent>
                <Chart
                    autoFit
                    padding={[10, 20, 50, 40]}
                    height={300}
                    data={data}
                >
                    <LineAdvance
                        shape="smooth"
                        point
                        area
                        position="month*value"
                        color="name"
                    />
                </Chart>
            </CardContent>
        </Card>
    )
}

export default SalesChart
