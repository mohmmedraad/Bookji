import { FC } from "react"

import About from "./_sections/About"
import Hero from "./_sections/Hero"
import OurValues from "./_sections/OurValues"
import OurVision from "./_sections/OurVision"

interface pageProps {}

const page: FC<pageProps> = ({}) => {
    return (
        <>
            <Hero />
            <About />
            <OurVision />
            <OurValues />
        </>
    )
}

export default page
