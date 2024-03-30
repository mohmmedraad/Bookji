import { type FC } from "react"
import { type Metadata } from "next"

import ContactForm from "./_sections/ContactForm"
import Enquiries from "./_sections/Enquiries"
import Hero from "./_sections/Hero"
import Locations from "./_sections/Locations"

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
