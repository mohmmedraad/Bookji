import { type FC } from "react"
import Image from "next/image"

import Container from "@/components/ui/container"

interface AboutProps {}

const About: FC<AboutProps> = ({}) => {
    return (
        <section className="py-20">
            <Container className="grid items-center gap-20 lg:grid-cols-2">
                <div>
                    <p className="mb-2 text-sm text-primary">About</p>
                    <h2 className="text-[2.5rem] font-bold leading-none tracking-tighter text-accent-foreground md:text-5xl">
                        About Book Store
                    </h2>
                    <p className="mt-4 text-base text-gray-500">
                        Welcome to our literary haven, where pages come to life
                        and stories transport you to realms beyond imagination.
                        Founded with a passion for literature, our book store is
                        more than just a repository of books; it&rsquo;s a
                        sanctuary for bibliophiles, a gateway to knowledge, and
                        a hub of inspiration. With an extensive collection
                        spanning genres and eras, we invite you to embark on a
                        journey of literary exploration. Let the scent of pages
                        and the allure of narratives guide you as you step into
                        a realm of boundless imagination.
                    </p>
                </div>
                <div className="aspect-[4/3] overflow-hidden rounded-2xl lg:aspect-[1/1]">
                    <Image
                        src="/img-2.webp"
                        alt="image"
                        width={500}
                        height={300}
                        className="h-full w-full bg-cover"
                        loading="lazy"
                    />
                </div>
            </Container>
        </section>
    )
}

export default About
