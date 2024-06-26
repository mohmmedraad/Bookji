import { type FC } from "react"
import { type Metadata } from "next"

import ContactForm from "./_sections/contact-form"
import Enquiries from "./_sections/enquiries"
import Hero from "./_sections/hero"
import Locations from "./_sections/locations"

interface pageProps {}

export const metadata: Metadata = {
    title: "Contact us",
    description:
        "Have questions or feedback? Contact Bookji Support for assistance. We're here to help you with any queries.",
}

const page: FC<pageProps> = ({}) => {
    return (
        <>
            <Hero />
            <Enquiries />
            <Locations />
            <ContactForm />
        </>
    )
}

export default page
