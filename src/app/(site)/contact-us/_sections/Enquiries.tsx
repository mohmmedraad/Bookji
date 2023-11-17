import { type FC } from "react"

import Container from "@/components/ui/Container"

interface EnquiriesProps {}

const Enquiries: FC<EnquiriesProps> = ({}) => {
    return (
        <section className="py-20">
            <Container>
                <div className="mx-auto max-w-2xl text-center">
                    <p className="mb-2 text-sm text-primary">Enquiries</p>

                    <h2 className="text-[2.5rem] font-bold leading-none tracking-tighter text-accent-foreground md:text-5xl">
                        General enquiries
                    </h2>
                    <p className="mt-4 text-base text-gray-500">
                        For general queries, including partnership
                        opportunities, please email hello@companyname.com
                    </p>
                </div>
            </Container>
        </section>
    )
}

export default Enquiries
