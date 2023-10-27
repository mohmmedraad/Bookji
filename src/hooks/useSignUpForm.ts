import { create } from "zustand"

type FormState = "signUp" | "verify"

interface FormStore {
    formState: FormState
    setFormState: (state: FormState) => void
}

const useStore = create<FormStore>((set, get) => ({
    formState: "signUp",
    setFormState: (formState) => set({ formState }),
}))

export default useStore
