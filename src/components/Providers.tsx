import { FC, ReactNode } from "react"
import { ClerkProvider } from "@clerk/nextjs"

interface LayoutProps {
    children: ReactNode
}

const Providers: FC<LayoutProps> = ({ children }) => {
    return <ClerkProvider>{children}</ClerkProvider>
}

export default Providers
