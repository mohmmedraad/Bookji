import { type FC } from "react"
import { type Metadata } from "next"

import About from "./_sections/About"
import Hero from "./_sections/Hero"
import OurValues from "./_sections/OurValues"
import OurVision from "./_sections/OurVision"

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
