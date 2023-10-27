import { FC } from "react"
import Image from "next/image"

import Container from "@/components/ui/Container"

interface HeroProps {}

const Hero: FC<HeroProps> = ({}) => {
    return (
        <section className="pb-20 pt-40">
            <Container className="grid justify-center text-center">
                <span className="mb-1 text-sm text-primary">
                    Online-BookStore
                </span>
                <h2 className="max-w-2xl text-[3.5rem] font-bold leading-none tracking-tighter text-accentForeground md:text-[4.5rem] md:leading-[80px]">
                    Discover the Chronicles of Our Literary Haven
                </h2>
                <p className="mt-4 max-w-2xl text-base text-gray-500">
                    Embark on a Journey Where Words Transcend Pages, Imagination
                    Knows No Bounds, and Every Book Is a Key to Unlock New
                    Realms of Wisdom, Adventure, and Self-Discovery
                </p>
            </Container>
            <Container>
                <div className="mx-auto mt-20 aspect-video w-full max-w-5xl overflow-hidden rounded-2xl">
                    <Image
                        src="/img-1.webp"
                        width={1000}
                        height={500}
                        alt="about image"
                        className="h-full w-full bg-cover"
                        loading="eager"
                    />
                </div>
            </Container>
        </section>
    )
}

export default Hero
