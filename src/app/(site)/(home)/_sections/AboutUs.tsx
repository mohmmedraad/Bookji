import { type FC } from "react"

import { books, socialMediaLinks } from "@/config/site"
import { cn } from "@/lib/utils"
import BookCover from "@/components/ui/book-cover"
import { buttonVariants } from "@/components/ui/button"
import Container from "@/components/ui/Container"
import { Icons } from "@/components/Icons"

interface AboutUsProps {}

const AboutUs: FC<AboutUsProps> = ({}) => {
    const bookOne = books[4]
    const bookTwo = books[7]
    return (
        <section about="about us" className=" pb-20 pt-64">
            <Container className="grid justify-center gap-16 lg:grid-cols-2">
                <div className="relative flex justify-center">
                    <div className="absolute translate-x-[-30%] translate-y-[-36%] rotate-[-10deg]">
                        <BookCover
                            src={bookOne.cover}
                            alt={bookOne.title}
                            width={200}
                            height={300}
                            className="h-[321.924px] w-[233.767px] shadow-custom md:h-[399.358px] md:w-[289.986px]"
                        />
                        <Icons.ArrowShape className="absolute left-0 top-1/4 -translate-x-full rotate-[18deg]" />
                        <Icons.HighlightShape className="absolute left-0 top-0 translate-x-[-80%] translate-y-[-80%]" />
                    </div>
                    <div className="relative rotate-[8deg]">
                        <BookCover
                            src={bookTwo.cover}
                            alt={bookTwo.title}
                            width={200}
                            height={300}
                            className="h-[321.924px] w-[233.767px] shadow-custom md:h-[399.358px] md:w-[289.986px] "
                        />
                        <Icons.NewShape className="absolute left-[70%] top-[-20%]" />
                    </div>
                </div>
                <div className="flex max-w-xl flex-col justify-center text-center lg:text-left">
                    <p className="mb-2 text-sm text-primary">About Us</p>
                    <h2 className="text-[2.5rem] font-bold leading-none tracking-tighter text-accent-foreground md:text-5xl">
                        The Long Story about Our Bookstore
                    </h2>
                    <p className="mb-6 mt-4 max-w-lg text-base text-gray-500">
                        we started this business since 1934, in that year there
                        was no online sale...
                    </p>
                    <div className="flex items-center justify-center gap-8 lg:justify-start">
                        {socialMediaLinks.map(({ name, url, Icon }) => (
                            <a
                                href={url}
                                target="_blank"
                                key={name}
                                aria-label={name}
                                className={cn(
                                    buttonVariants(),
                                    "p-2 shadow-md"
                                )}
                            >
                                <Icon className="h-[33px] w-8 text-white" />
                            </a>
                        ))}
                    </div>
                </div>
            </Container>
        </section>
    )
}

export default AboutUs
