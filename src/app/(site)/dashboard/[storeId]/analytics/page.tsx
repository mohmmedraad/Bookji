import { type FC } from "react"
import {
    BadgeDollarSign,
    UserPlus,
    Wallet,
    type LucideIcon,
} from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Icons } from "@/components/Icons"

import SalesChart from "./_components/SalesChart"
import TrendingArrow from "./_components/TrendingArrow"

interface pageProps {}

const cards: {
    Icon: LucideIcon
    title: string
    number: string
    status: "up" | "down"
    percent: string
}[] = [
    {
        Icon: UserPlus,
        title: "Total customers",
        number: "1,200",
        status: "up",
        percent: "15%",
    },
    {
        Icon: Wallet,
        title: "Total revenue",
        number: "$0.00",
        status: "down",
        percent: "40%",
    },
    {
        Icon: BadgeDollarSign,
        title: "Total sales",
        number: "$100.00",
        status: "up",
        percent: "33%",
    },
    {
        Icon: Wallet,
        title: "Total orders",
        number: "1000",
        status: "up",
        percent: "80%",
    },
]

const page: FC<pageProps> = ({}) => {
    return (
        <div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {cards.map(({ title, Icon, number, status, percent }) => (
                    <Card key={title}>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3">
                                <div className="rounded-md border-1 border-slate-200 p-3 ">
                                    <Icon className="h-6 w-6 text-[#344054]" />
                                </div>
                                {title}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex items-center gap-4">
                            <div className="flex items-start gap-2">
                                <span className="text-4xl text-[#101828]">
                                    {number}
                                </span>
                                <TrendingArrow
                                    status={status}
                                    percent={percent}
                                    // className="absolute right-2 top-0"
                                />
                            </div>
                            {status === "up" ? (
                                <Icons.UpChart />
                            ) : (
                                <Icons.DownChart />
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>
            <SalesChart />
        </div>
    )
}

export default page
