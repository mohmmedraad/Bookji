import Footer from "@/components/footer"
import NavBar from "@/components/navbar"

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <main>
            <NavBar />
            {children}
            <Footer />
        </main>
    )
}
