import React from "react"
import { redirect } from "next/navigation"
import { currentUser } from "@clerk/nextjs"

import Container from "@/components/ui/Container"
import ProfileContainer from "@/components/ui/ProfileContainer"
import { Separator } from "@/components/ui/Separator"

import ProfileInfo from "./_sections/ProfileInfo"
import ProfilePagesLinks from "./_sections/ProfilePages"

const bio =
    "Seraphina Nightshade, a mystic traveler of otherworldly realms, is a name whispered in hushed tones across enchanted taverns. Born beneath a rare cosmic alignment, her destiny intertwined with secrets of forgotten civilizations and hidden arcane arts. Guided by the moon's glow, Seraphina has deciphered the enigmatic runes of the Starfall Codex and unraveled the temporal paradoxes of the Chronos Labyrinth. Her prowess in"

const Layout = async ({ children }: { children: React.ReactNode }) => {
    const user = await currentUser()

    if (user == null || user.id == null) return redirect("/sign-in")
    return (
        <>
            <ProfileInfo
                userName="mohammed123"
                firstName={user.firstName}
                lastName={user.lastName}
                title={undefined}
                avatarUrl={user.imageUrl}
                thumbnailUrl={undefined}
                bio={bio}
            />
            <Container>
                <ProfileContainer>
                    <ProfilePagesLinks />
                    {children}
                </ProfileContainer>
            </Container>
        </>
    )
}

export default Layout
