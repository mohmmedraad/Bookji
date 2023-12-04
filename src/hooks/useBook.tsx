import { type Book } from "@/db/schema"
import { create } from "zustand"

export type BookType = Omit<Book, "createdAt" | "updatedAt" | "inventory">

interface BookStore {
    book: BookType | null
    setBook: (book: BookType) => void
}

const useBook = create<BookStore>((set, get) => ({
    book: null,
    setBook: (book) => set({ book }),
}))

export default useBook
