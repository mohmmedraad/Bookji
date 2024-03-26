import { create } from "zustand"

interface UserInfoStore {
    isLoaded: boolean
    username: string | null
    firstName: string | null
    lastName: string | null
    birthday: Date | null

    setUserName: (username: string | null) => void
    setFirstName: (username: string | null) => void
    setLastName: (username: string | null) => void
    setBirthday: (username: Date | null) => void
    setIsLoaded: (isLoaded: boolean) => void
}

export const useUserInfo = create<UserInfoStore>((set) => ({
    isLoaded: false,
    username: null,
    firstName: null,
    lastName: null,
    birthday: null,
    language: null,

    setUserName: (username) => set({ username }),
    setFirstName: (firstName) => set({ firstName }),
    setLastName: (lastName) => set({ lastName }),
    setBirthday: (birthday) => set({ birthday }),
    setIsLoaded: (isLoaded) => set({ isLoaded }),
}))
