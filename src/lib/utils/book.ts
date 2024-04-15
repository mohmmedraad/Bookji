import { db } from "@/db"
import { books as booksTable, stores as storesTable } from "@/db/schema"
import { clerkClient } from "@clerk/nextjs"
import { and, eq, inArray } from "drizzle-orm"

export async function isBookExists<T extends number[] | number>(
    bookId: T,
    storeOwnerId?: string
): Promise<T extends number[] ? number[] : boolean> {
    const isArrayOfIds = Array.isArray(bookId)
    const books = await db
        .select({
            id: booksTable.id,
        })
        .from(booksTable)
        .where(
            and(
                isArrayOfIds
                    ? inArray(booksTable.id, bookId)
                    : eq(booksTable.id, bookId),
                eq(booksTable.isDeleted, false)
            )
        )
        .innerJoin(
            storesTable,
            and(
                eq(booksTable.storeId, storesTable.id),
                eq(storesTable.isDeleted, false),
                storeOwnerId ? eq(storesTable.ownerId, storeOwnerId) : undefined
            )
        )

    if (isArrayOfIds)
        return books.map((book) => book.id) as T extends number[]
            ? number[]
            : never

    return (books.length > 0) as T extends number[] ? never : boolean
}

const getUsers = async (userList: string[]) => {
    const users = await clerkClient.users.getUserList({
        userId: userList,
        limit: userList.length,
    })
    console.log("users: ", users)

    const usersFullNames: Map<string, string> = new Map()

    users.forEach((user) => {
        usersFullNames.set(user.id, `${user.firstName} ${user.lastName}`)
        usersFullNames.set(user.id + "-img", user.imageUrl)
    })
    return usersFullNames
}

const getUsersIds = <T extends { userId: string }>(list: T[]) => {
    return list.map((item) => item.userId)
}

export const withUsers = async <T extends { userId: string }>(list: T[]) => {
    if (list.length === 0) return []
    const usersIds = getUsersIds(list)
    console.log("usersIds: ", usersIds)

    const usersFullNames = await getUsers(usersIds)

    console.log("usersFullNames: ", usersFullNames)

    return list.map((item) => {
        return {
            ...item,
            userFullName: usersFullNames.get(item.userId),
            userImg: usersFullNames.get(item.userId + "-img"),
        }
    })
}
