import type { FC, HTMLAttributes } from "react"
import Link from "next/link"

import { navLinks } from "@/config/site"

import { Icons } from "./Icons"
import { Sheet, SheetContent, SheetTrigger } from "./ui/Sheet"

const MobileNav: FC = ({}) => {
    return (
        <Sheet>
            <SheetTrigger className="block md:hidden">
                <Icons.Menu width="24px" height="24px" />
            </SheetTrigger>
            <SheetContent className="bg-primary p-6">
                <nav>
                    <ul className="mt-14 flex flex-col justify-center gap-10">
                        {navLinks.map(({ name, url }) => (
                            <li key={name} className="list-none">
                                <Link
                                    href={url}
                                    className="text-4xl font-semibold"
                                >
                                    {name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </SheetContent>
        </Sheet>
    )
}

export default MobileNav
