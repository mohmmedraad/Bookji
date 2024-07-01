import { create } from "zustand"

type FormState = "signIn" | "verify"

interface FormStore {
    formState: FormState
    emailAddress: string
    origin: string
    setOrigin: (origin: string | undefined) => void
    setEmailAddress: (emailAddress: string) => void
    setFormState: (state: FormState) => void
}

const useStore = create<FormStore>((set) => ({
    formState: "signIn",
    emailAddress: "",
    origin: "/",
    setOrigin: (origin) => set({ origin }),
    setEmailAddress: (emailAddress) => set({ emailAddress }),
    setFormState: (formState) => set({ formState }),
}))

export default useStore
