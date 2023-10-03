import { type FC } from "react"

import { books } from "@/config/site"
import BookCover from "@/components/ui/BookCover"
import { Button } from "@/components/ui/Button"
import Container from "@/components/ui/Container"
import HeroSvg from "@/components/HeroSvg"

const Hero: FC = ({}) => {
    return (
        <section
            about="Hero"
            className="relative overflow-x-clip pt-40 before:absolute before:top-0 before:z-[-1] before:h-4/5 before:w-full before:bg-[#F6F6FE]"
        >
            <HeroSvg />
            <div className="">
                <Container className="text-center">
                    <span className="mb-1 text-sm text-primary">
                        Online-BookStore
                    </span>
                    <h1 className="text-[3.5rem] font-bold leading-none tracking-tighter text-accentForeground md:text-[4.5rem] md:leading-[80px]">
                        A World of{" "}
                        <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                            Stories
                        </span>
                    </h1>
                    <p className="mt-4 text-base text-gray-500">
                        Dive into the Realm of Endless Narratives
                    </p>
                    <Button className="mt-8 w-full xs:w-auto">
                        Join Bookie For Free
                    </Button>
                </Container>
                <div className="grid justify-center py-20">
                    <div className="relative flex items-center gap-24 before:absolute before:left-[-30%] before:z-[999] before:h-[44.375rem] before:w-[50vw] before:bg-gradient-boxGradient before:opacity-50 before:blur-[20px] after:absolute after:right-[-30%] after:z-[999] after:h-[44.375rem] after:w-[50vw] after:bg-gradient-boxGradient after:opacity-50 after:blur-[20px]">
                        <div className="flex h-[30rem] -translate-y-20 flex-col justify-between">
                            {books
                                .slice(0, 2)
                                .map(({ author, title, cover }) => (
                                    <div
                                        key={title}
                                        className="w-[7.1875rem] text-center"
                                    >
                                        <BookCover
                                            alt={title}
                                            src={cover}
                                            width={200}
                                            height={300}
                                            className="h-[10.3125rem] w-[7.1875rem] overflow-hidden "
                                        />
                                        <h3 className="mt-2 text-sm font-semibold">
                                            {title}
                                        </h3>
                                        <h4 className="mt-2 text-xs text-gray-500">
                                            {author}
                                        </h4>
                                    </div>
                                ))}
                        </div>
                        <div className="flex h-[30rem] flex-col justify-between">
                            {books
                                .slice(2, 4)
                                .map(({ author, title, cover }, index) => (
                                    <div
                                        key={title}
                                        className="w-[7.1875rem] text-center"
                                    >
                                        <BookCover
                                            alt={title}
                                            src={cover}
                                            width={200}
                                            height={300}
                                            className="h-[10.3125rem] w-[7.1875rem] overflow-hidden "
                                        />
                                        <h3 className="mt-2 text-sm font-semibold">
                                            {title}
                                        </h3>
                                        <h4 className="mt-2 text-xs text-gray-500">
                                            {author}
                                        </h4>
                                    </div>
                                ))}
                        </div>
                        <div className="text-center">
                            <BookCover
                                alt={books[4].title}
                                src={books[4].cover}
                                width={200}
                                height={300}
                                loading="eager" 
                                className="h-[30.5rem] w-80 overflow-hidden rounded-xl xs:w-[21.1875rem]"
                            />
                            <h3 className="mt-2 text-base font-semibold">
                                {books[4].title}
                            </h3>
                            <h4 className="mt-2 text-sm text-gray-500">
                                {books[4].author}
                            </h4>
                        </div>
                        <div className="flex h-[30rem] flex-col justify-between">
                            {books
                                .slice(5, 7)
                                .map(({ author, title, cover }) => (
                                    <div
                                        key={title}
                                        className="w-[7.1875rem] text-center"
                                    >
                                        <BookCover
                                            alt={title}
                                            src={cover}
                                            width={200}
                                            height={300}
                                            className="h-[10.3125rem] w-[7.1875rem] overflow-hidden "
                                        />
                                        <h3 className="mt-2 text-sm font-semibold">
                                            {title}
                                        </h3>
                                        <h4 className="mt-2 text-xs text-gray-500">
                                            {author}
                                        </h4>
                                    </div>
                                ))}
                        </div>
                        <div className="flex h-[30rem] -translate-y-20 flex-col justify-between">
                            {books.slice(7).map(({ author, title, cover }) => (
                                <div
                                    key={title}
                                    className="w-[7.1875rem] text-center"
                                >
                                    <BookCover
                                        alt={title}
                                        src={cover}
                                        width={200}
                                        height={300}
                                        className="h-[10.3125rem] w-[7.1875rem] overflow-hidden "
                                    />
                                    <h3 className="mt-2 text-sm font-semibold">
                                        {title}
                                    </h3>
                                    <h4 className="mt-2 text-xs text-gray-500">
                                        {author}
                                    </h4>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Hero
