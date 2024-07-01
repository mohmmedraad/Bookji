import { type FC } from "react"
import Image from "next/image"

import { values } from "@/config/site"
import Container from "@/components/ui/container"

interface AboutProps {}

const About: FC<AboutProps> = ({}) => {
    return (
        <section className="py-20">
            <Container>
                <div>
                    <p className="mb-2 text-sm text-primary">Values</p>
                    <h2 className="text-[2.5rem] font-bold leading-none tracking-tighter text-accent-foreground md:text-5xl">
                        Our values
                    </h2>
                    <p className="mt-4 text-base text-gray-500">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    </p>
                </div>
                <div className="mt-20 grid items-center gap-20 lg:grid-cols-2">
                    <div className="aspect-[4/3] overflow-hidden rounded-2xl lg:aspect-[3/4]">
                        <Image
                            src="/img-3.webp"
                            alt="image"
                            width={600}
                            height={500}
                            className="h-full w-full bg-cover"
                            loading="lazy"
                        />
                    </div>
                    <div className="grid gap-6 md:grid-cols-2">
                        {values.map(({ Icon, title, description, color }) => (
                            <div
                                key={title}
                                className="flex flex-col items-center gap-6 text-center md:items-start md:text-left"
                            >
                                <div
                                    style={{ backgroundColor: color }}
                                    className={`w-max rounded-md p-3`}
                                >
                                    <Icon width={32} height={32} />
                                </div>
                                <h3 className="text-2xl font-bold">{title}</h3>
                                <p className="text-base text-gray-500">
                                    {description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </Container>
        </section>
    )
}

export default About
