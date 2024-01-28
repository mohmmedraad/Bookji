import { db } from "@/db"
import { books, booksToCategories } from "@/db/schema"
import { and, eq } from "drizzle-orm"

export async function deleteStore(id: number) {
    const { insertId } = await db.delete(books).where(eq(books.id, id))
    return insertId
}

export async function deleteStoreBooks(storeId: number) {
    const { insertId } = await db
        .delete(books)
        .where(eq(books.storeId, storeId))
    return insertId
}

export async function deleteBookCategories(bookId: number) {
    const { insertId } = await db
        .delete(booksToCategories)
        .where(eq(booksToCategories.bookId, bookId))
    return insertId
}
