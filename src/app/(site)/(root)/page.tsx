"use client"

import { useEffect, useState } from "react"
import { CircularProgress } from "@nextui-org/react"

import { trpc } from "@/app/_trpc/client"

// import AboutUs from "./_sections/AboutUs"
// import BestBook from "./_sections/BestBook"
// import Hero from "./_sections/Hero"
// import JoinUs from "./_sections/JoinUs"
// import Testimonials from "./_sections/Testimonials"

export default function Home() {
    return (
        <main>
            {/* <Hero /> */}
            {/**
             * TODO: Add suspense
             */}
            {/* <BestBook />
            <AboutUs />
            <Testimonials />
            <JoinUs /> */}
        </main>
    )
}
