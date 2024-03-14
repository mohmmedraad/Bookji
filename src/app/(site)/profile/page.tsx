import { type FC } from "react"
import { currentUser } from "@clerk/nextjs"

import Container from "@/components/ui/Container"

import CookiesSettings from "./_components/CookiesSettings"
import EmailSetting from "./_components/EmailSetting"
import GeneralInformation from "./_components/GeneralInformation"
import ProfileAvatar from "./_components/ProfileAvatar"
import UserInfoProvider from "./_components/UserInfoProvider"

// import SocialAccounts from "./_components/SocialAccounts"

interface pageProps {}

const page: FC<pageProps> = async ({}) => {
    const user = await currentUser()

    if (!user) return

    return (
        <Container className="min-h-screen pt-40">
            <UserInfoProvider
                username={user.username}
                firstName={user.firstName}
                lastName={user.lastName}
                birthday={new Date(user.birthday)}
            />
            <div className="flex flex-col items-start gap-8 md:flex-row">
                <div className="grid w-full gap-8 md:w-80 md:shrink-0">
                    <ProfileAvatar
                        firstName={user.firstName}
                        lastName={user.lastName}
                        imageUrl={user.imageUrl}
                    />
                    {/* <SocialAccounts /> */}
                </div>
                <GeneralInformation username={user.username}
                firstName={user.firstName}
                lastName={user.lastName}
                birthday={new Date(user.birthday)} />
            </div>
            <div className="mt-8 grid gap-8 md:grid-flow-col">
                <CookiesSettings />
                <EmailSetting />
            </div>
        </Container>
    )
}

export default page
