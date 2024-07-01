import { type FC } from "react"
import Image from "next/image"
import { ChevronRight } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import Container from "@/components/ui/container"

interface LocationsProps {}

const Locations: FC<LocationsProps> = ({}) => {
    return (
        <section className="py-20">
            <Container>
                <div className="mx-auto max-w-2xl text-center">
                    <p className="mb-2 text-sm text-primary">Locations</p>

                    <h2 className="text-[2.5rem] font-bold leading-none tracking-tighter text-accent-foreground md:text-5xl">
                        Our locations
                    </h2>
                    <p className="mt-4 text-base text-gray-500">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    </p>
                </div>
                <div className="mt-28 grid gap-16 lg:grid-cols-2">
                    <div className="text-center">
                        <div className="mb-8 aspect-video overflow-hidden rounded-2xl">
                            <Image
                                width={600}
                                height={300}
                                src="/img-4.webp"
                                className="h-full w-full bg-cover"
                                alt="sydney location"
                                loading="lazy"
                            />
                        </div>
                        <h3 className="text-[2.5rem] font-bold">Sydney</h3>
                        <p className="my-6 text-gray-500">
                            123 Sample St, Sydney NSW 2000 AU
                        </p>
                        <a
                            href="/contact-us"
                            className={buttonVariants({ variant: "ghost" })}
                        >
                            Get Directions
                            <ChevronRight className="ml-2 h-6 w-6 text-gray-500" />
                        </a>
                    </div>
                    <div className="text-center">
                        <div className="mb-8 aspect-video overflow-hidden rounded-2xl">
                            <Image
                                width={600}
                                height={300}
                                src="/img-5.webp"
                                className="h-full w-full bg-cover"
                                alt="new york location"
                                loading="lazy"
                            />
                        </div>
                        <h3 className="text-[2.5rem] font-bold">New York</h3>
                        <p className="my-6 text-gray-500">
                            123 Sample St, New York NY 10000 USA
                        </p>
                        <a
                            href="/contact-us"
                            className={buttonVariants({ variant: "ghost" })}
                        >
                            Get Directions
                            <ChevronRight className="ml-2 h-6 w-6 text-gray-500" />
                        </a>
                    </div>
                </div>
            </Container>
        </section>
    )
}

export default Locations
