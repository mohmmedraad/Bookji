import AboutUs from "./_sections/AboutUs"
import BestBook from "./_sections/BestBook"
import Hero from "./_sections/Hero"
import JoinUs from "./_sections/JoinUs"
import Testimonials from "./_sections/Testimonials"

export default function Home() {
    return (
        <main>
            <Hero />
            {/**
             * TODO: Add suspense
             */}
            <BestBook />
            <AboutUs />
            <Testimonials />
            <JoinUs />
        </main>
    )
}
