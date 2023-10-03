import { FC } from "react"
import Link from "next/link"

import { footerLinks } from "@/config/site"

import { Icons } from "./Icons"
import Container from "./ui/Container"

interface FooterProps {}

const Footer: FC<FooterProps> = ({}) => {
    return (
        <footer className="bg-[#32166D] py-20">
            <Container>
                <nav className="flex flex-wrap gap-8">
                    <div className="min-w-[232px] flex-[2]">
                        <Link href="/">
                            <div className="flex gap-2">
                                <Icons.Logo width="24" height="24" />
                                <span className="ml-2 text-2xl font-bold text-white">
                                    BOOK STORE
                                </span>
                            </div>
                        </Link>
                        <p className="mt-6 max-w-[232px] text-base font-semibold text-gray-300">
                            Find your favorite book on our store Bookie
                        </p>
                    </div>
                    {footerLinks.map((group) => (
                        <div key={group.groupName} className="min-w-max flex-1">
                            <p className="text-2xl font-bold text-white">
                                {group.groupName}
                            </p>
                            <div className="mt-6 grid gap-4">
                                {group.links.map((link) => (
                                    <Link
                                        className="text-base font-semibold text-gray-400"
                                        key={link.name}
                                        href={link.url}
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </nav>
            </Container>
        </footer>
    )
}

export default Footer
