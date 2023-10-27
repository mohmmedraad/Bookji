import { create } from "zustand"

type FormState = "signIn" | "verify"

interface FormStore {
    formState: FormState
    setFormState: (state: FormState) => void
}

const useStore = create<FormStore>((set, get) => ({
    formState: "signIn",
    setFormState: (formState) => set({ formState }),
}))

export default useStore
