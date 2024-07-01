import { type FC } from "react"
import { type Metadata } from "next"

import About from "./_sections/about"
import Hero from "./_sections/hero"
import OurValues from "./_sections/our-values"
import OurVision from "./_sections/our-vision"

interface pageProps {}

export const metadata: Metadata = {
    title: "About",
    description:
        "Learn more about Bookji - your trusted online bookstore. Discover our mission, team, and commitment to book enthusiasts.",
}

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
