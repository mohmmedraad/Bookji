import { type UseFormReturn } from "react-hook-form"
import { create } from "zustand"

import { type BookFormSchema } from "@/lib/validations/book"

type Form = UseFormReturn<BookFormSchema, unknown, undefined>

interface Store {
    form: Form | null
    setForm: (form: Form) => void
}

export const useBookForm = create<Store>((set) => ({
    form: null,
    setForm: (form) => set({ form }),
}))
