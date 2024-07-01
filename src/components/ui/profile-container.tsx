import { type FC, type ReactNode } from "react"

import { cn } from "@/lib/utils"

type ProfileContainerProps = { className?: string; children: ReactNode }

const ProfileContainer: FC<ProfileContainerProps> = ({
    className,
    children,
}) => {
    return (
        <>
            <div className="mt-12 gap-3 px-3 lg:mt-6 lg:grid lg:grid-cols-profile lg:gap-8 lg:px-6">
                <div
                    className={cn(
                        "max-w-[54.125rem] lg:col-start-2",
                        className
                    )}
                >
                    {children}
                </div>
            </div>
        </>
    )
}

export default ProfileContainer
