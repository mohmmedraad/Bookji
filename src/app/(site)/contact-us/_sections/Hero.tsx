import { type FC } from "react"

import { contactLinks } from "@/config/site"
import { buttonVariants } from "@/components/ui/button"
import Container from "@/components/ui/container"

interface HeroProps {}

const Hero: FC<HeroProps> = ({}) => {
    return (
        <section className="pb-20 pt-40">
            <Container>
                <div className="text-center">
                    <span className="mb-1 text-sm text-primary">
                        contact us
                    </span>
                    <h2 className="text-[3.5rem] font-bold leading-none tracking-tighter text-accent-foreground md:text-[4.5rem] md:leading-[80px]">
                        Let&apos;s Stay Connected
                    </h2>
                    <p className="mt-4 text-base text-gray-500">
                        Reach Out to Us for Inquiries, Suggestions, or Simply to
                        Share Your Love for Literature
                    </p>
                </div>
                <div className="mt-28 grid gap-12 md:grid-cols-2 lg:grid-cols-3">
                    {contactLinks.map(
                        ({
                            Icon,
                            title,
                            description,
                            color,
                            linkName,
                            url,
                        }) => (
                            <div
                                key={title}
                                className="flex flex-col items-center gap-6 text-center "
                            >
                                <div
                                    style={{ backgroundColor: color }}
                                    className="w-max rounded-md p-3 shadow-2xl"
                                >
                                    <Icon width={32} height={32} />
                                </div>
                                <h3 className="text-[2rem] font-bold">
                                    {title}
                                </h3>
                                <p className="text-base text-gray-500">
                                    {description}
                                </p>
                                <a
                                    href={url}
                                    className={buttonVariants({
                                        variant: "outline",
                                    })}
                                >
                                    {linkName}
                                </a>
                            </div>
                        )
                    )}
                </div>
            </Container>
        </section>
    )
}

export default Hero
