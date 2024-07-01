import { type FC } from "react"

import Container from "@/components/ui/container"

interface AboutProps {}

const About: FC<AboutProps> = ({}) => {
    return (
        <section className="py-20">
            <Container>
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-sm text-primary">Our vision</h2>
                    <p className="mt-4 text-base text-gray-500">
                        Describe what your company is building towards in the
                        future. This vision statement should serve the purpose
                        of selling the dream of the company to hiring talent,
                        investors and partners.
                    </p>
                </div>
            </Container>
        </section>
    )
}

export default About
