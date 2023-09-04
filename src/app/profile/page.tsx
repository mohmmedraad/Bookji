import { currentUser } from "@clerk/nextjs"

interface pageProps {}

const page = async ({}) => {
    const user = await currentUser()
    console.log(user)
    return <div>page</div>
}

export default page
