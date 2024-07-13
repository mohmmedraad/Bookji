import AboutUs from "./_sections/AboutUs"
import BestBook from "./_sections/BestBook"
import Hero from "./_sections/Hero"
import JoinUs from "./_sections/JoinUs"
import Testimonials from "./_sections/Testimonials"

export const dynamic = "force-static"

export default function Home() {
    return (
        <>
            <Hero />
            <BestBook />
            <AboutUs />
            <Testimonials />
            <JoinUs />
        </>
    )
}
