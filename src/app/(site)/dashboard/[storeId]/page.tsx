import { type FC } from "react"
import Link from "next/link"

import { buttonVariants } from "@/components/ui/Button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/Card"

import UpdateStoreForm from "./_components/UpdateStoreForm"
import StoreInfo from "./_sections/StoreInfo"

interface pageProps {}

const page: FC<pageProps> = ({}) => {
    return (
        <>
            <StoreInfo />
            <div className="md:grid-cols-updateStore grid items-start gap-8 pt-[52px]">
                <Card>
                    <CardHeader>
                        <CardTitle>Connect to stripe</CardTitle>
                        <CardDescription>
                            Connect your store to Stripe to start accepting
                            payments
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Link href={"/"} className={buttonVariants()}>
                            Connect to Stripe
                        </Link>
                    </CardContent>
                </Card>
                <UpdateStoreForm />
            </div>
        </>
    )
}

export default page
