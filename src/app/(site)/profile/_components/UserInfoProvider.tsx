"use client"

import { useEffect, type FC } from "react"

import { useUserInfo } from "@/hooks/useUserInfo"

interface UserInfoProviderProps {
    username: string | null
    firstName: string | null
    lastName: string | null
    birthday: Date | null
}

const UserInfoProvider: FC<UserInfoProviderProps> = ({
    username,
    firstName,
    lastName,
    birthday,
}) => {
    const setIsLoaded = useUserInfo((state) => state.setIsLoaded)
    const setUserName = useUserInfo((state) => state.setUserName)
    const setFirstName = useUserInfo((state) => state.setFirstName)
    const setLastName = useUserInfo((state) => state.setLastName)
    const setBirthday = useUserInfo((state) => state.setBirthday)

    useEffect(() => {
        setIsLoaded(true)
        setUserName(username)
        setFirstName(firstName)
        setLastName(lastName)
        setBirthday(birthday)
    }, [])

    return null
}

export default UserInfoProvider
