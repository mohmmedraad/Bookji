import Footer from "@/components/Footer"
import NavBar from "@/components/NavBar"

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
