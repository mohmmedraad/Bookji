import { FC } from "react"

import ContactForm from "./_sections/ContactForm"
import Enquiries from "./_sections/Enquiries"
import Hero from "./_sections/Hero"
import Locations from "./_sections/Locations"

interface pageProps {}

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
