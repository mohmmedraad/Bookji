"use client"

import { type FC } from "react"
import { Chart, LineAdvance } from "bizcharts"
import {
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"

interface SalesChartProps {}
const data = [
    {
        name: "Page A",
        uv: 4000,
        pv: 2400,
        amt: 2400,
    },
    {
        name: "Page B",
        uv: 3000,
        pv: 1398,
        amt: 2210,
    },
    {
        name: "Page C",
        uv: 2000,
        pv: 9800,
        amt: 2290,
    },
    {
        name: "Page D",
        uv: 2780,
        pv: 3908,
        amt: 2000,
    },
    {
        name: "Page E",
        uv: 1890,
        pv: 4800,
        amt: 2181,
    },
    {
        name: "Page F",
        uv: 2390,
        pv: 3800,
        amt: 2500,
    },
    {
        name: "Page G",
        uv: 3490,
        pv: 4300,
        amt: 2100,
    },
]

const data2 = [
    {
        month: "Jan",
        city: "Tokyo",
        temperature: 7,
    },
    {
        month: "Jan",
        city: "London",
        temperature: 3.9,
    },
    {
        month: "Feb",
        city: "Tokyo",
        temperature: 13,
    },
    {
        month: "Feb",
        city: "London",
        temperature: 4.2,
    },
    {
        month: "Mar",
        city: "Tokyo",
        temperature: 16.5,
    },
    {
        month: "Mar",
        city: "London",
        temperature: 5.7,
    },
    {
        month: "Apr",
        city: "Tokyo",
        temperature: 14.5,
    },
    {
        month: "Apr",
        city: "London",
        temperature: 8.5,
    },
    {
        month: "May",
        city: "Tokyo",
        temperature: 10,
    },
    {
        month: "May",
        city: "London",
        temperature: 11.9,
    },
    {
        month: "Jun",
        city: "Tokyo",
        temperature: 7.5,
    },
    {
        month: "Jun",
        city: "London",
        temperature: 15.2,
    },
    {
        month: "Jul",
        city: "Tokyo",
        temperature: 9.2,
    },
    {
        month: "Jul",
        city: "London",
        temperature: 17,
    },
    {
        month: "Aug",
        city: "Tokyo",
        temperature: 14.5,
    },
    {
        month: "Aug",
        city: "London",
        temperature: 16.6,
    },
    {
        month: "Sep",
        city: "Tokyo",
        temperature: 9.3,
    },
    {
        month: "Sep",
        city: "London",
        temperature: 14.2,
    },
    {
        month: "Oct",
        city: "Tokyo",
        temperature: 8.3,
    },
    {
        month: "Oct",
        city: "London",
        temperature: 10.3,
    },
    {
        month: "Nov",
        city: "Tokyo",
        temperature: 8.9,
    },
    {
        month: "Nov",
        city: "London",
        temperature: 5.6,
    },
    {
        month: "Dec",
        city: "Tokyo",
        temperature: 5.6,
    },
    {
        month: "Dec",
        city: "London",
        temperature: 9.8,
    },
]

const SalesChart: FC<SalesChartProps> = ({}) => {
    return (
        <Card className="mt-10">
            <CardHeader>
                <CardTitle>Sales</CardTitle>
            </CardHeader>
            <CardContent>
                {/* <ResponsiveContainer height={400} width={"100%"}>
                    <LineChart
                        // width={1000}
                        // height={400}
                        className="h-full w-full"
                        data={data}
                    >
                        <Line type="monotone" dataKey="uv" stroke="#8884d8" />
                        <Line type="monotone" dataKey="pv" stroke="#82ca9d" />
                        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                    </LineChart>
                </ResponsiveContainer> */}
                <Chart
                    autoFit
                    padding={[10, 20, 50, 40]}
                    height={300}
                    data={data2}
                >
                    <h1>1111</h1>
                    <LineAdvance
                        shape="smooth"
                        point
                        area
                        position="month*temperature"
                        color="city"
                    />
                </Chart>
            </CardContent>
        </Card>
    )
}

export default SalesChart
