import { currentUser } from "@clerk/nextjs"

interface pageProps {}

const page = async ({}) => {
    const user = await currentUser()
    return <div>page</div>
}

export default page
