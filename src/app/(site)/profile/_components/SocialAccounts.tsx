"use client"

import { type FC } from "react"
import { type UserLinkedAccounts } from "@/types"
import { useUser } from "@clerk/nextjs"

import { oauthProviders } from "@/config/site"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Icons } from "@/components/Icons"

import ProfileAvatarSkeleton from "./ProfileAvatarSkeleton"

interface SocialAccountsProps {}

const SocialAccounts: FC<SocialAccountsProps> = ({}) => {
    const { user, isLoaded, isSignedIn } = useUser()

    if (!isLoaded) {
        return <ProfileAvatarSkeleton />
    }

    if (isLoaded && !isSignedIn) {
        return null
    }

    console.log("user linkTo accounts: ", user.emailAddresses[0].linkedTo)

    const userLinkedAccounts: UserLinkedAccounts = oauthProviders.map(
        (provider) => {
            const userConnectedAccount = user.emailAddresses[0].linkedTo.find(
                (account) => account.type === provider.strategy
            )
            if (userConnectedAccount === undefined) {
                return { ...provider, isConnected: false }
            }
            return {
                ...provider,
                isConnected: true,
                path: userConnectedAccount.pathRoot,
            }
        }
    )

    return (
        <Card>
            <CardHeader>
                <CardTitle>Social Accounts</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid gap-3">
                    {userLinkedAccounts.map((provider) => {
                        const Icon = Icons[provider.icon]
                        return (
                            <div
                                key={provider.name}
                                className="flex items-center justify-between"
                            >
                                <div className="flex gap-4">
                                    <Icon className="h-6 w-6" />

                                    <div>
                                        <h4 className="text-base font-bold">
                                            {provider.name} account
                                        </h4>
                                        {provider.isConnected ? (
                                            <a
                                                href={provider.path}
                                                className="mt-2 text-sm text-blue-700 underline-offset-4 hover:underline"
                                            >
                                                {provider.path}
                                            </a>
                                        ) : (
                                            <span className="mt-2 text-sm text-gray-500">
                                                Not connected
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <Button
                                    variant={
                                        provider.isConnected
                                            ? "outline"
                                            : "default"
                                    }
                                >
                                    {provider.isConnected
                                        ? "Disconnect"
                                        : "Connect"}
                                </Button>
                            </div>
                        )
                    })}
                </div>
            </CardContent>
        </Card>
    )
}

export default SocialAccounts
