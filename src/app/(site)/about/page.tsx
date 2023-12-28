import { type FC } from "react"

import About from "./_sections/About"
import Hero from "./_sections/Hero"
import OurValues from "./_sections/OurValues"
import OurVision from "./_sections/OurVision"

interface pageProps {}

const page: FC<pageProps> = ({}) => {
    return (
        <div className="bg-background">
            <Hero />
            <About />
            <OurVision />
            <OurValues />
        </div>
    )
}

export default page
