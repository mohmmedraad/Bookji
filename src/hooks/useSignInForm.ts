import { create } from "zustand"

type FormState = "signIn" | "verify"

interface FormStore {
    formState: FormState
    emailAddress: string
    setEmailAddress: (emailAddress: string) => void
    setFormState: (state: FormState) => void
}

const useStore = create<FormStore>((set, get) => ({
    formState: "signIn",
    emailAddress: "",
    setEmailAddress: (emailAddress) => set({ emailAddress }),
    setFormState: (formState) => set({ formState }),
}))

export default useStore
