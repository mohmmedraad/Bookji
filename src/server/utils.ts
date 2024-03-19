import { db } from "@/db"
import {
    books as booksTable,
    cartItems as cartItemsTable,
    carts as cartsTable,
    payments,
    stores as storesTable,
    type NewCartItem,
} from "@/db/schema"
import { clerkClient } from "@clerk/nextjs"
import { and, eq, inArray } from "drizzle-orm"

import { stripe } from "@/lib/stripe"

export async function createStripeAccount(
    payment: {
        stripeAccountId: string
        detailsSubmitted: boolean
    } | null,
    storeId: number
): Promise<string> {
    try {
        const account = await stripe.accounts.create({ type: "standard" })

        if (!account) {
            throw new Error("Error creating Stripe account.")
        }

        // If payment record exists, we update it with the new account id
        if (payment) {
            await db.update(payments).set({
                stripeAccountId: account.id,
            })
        } else {
            await db.insert(payments).values({
                storeId,
                stripeAccountId: account.id,
            })
        }

        return account.id
    } catch (error) {
        throw new Error("Error creating Stripe account.")
    }
}

export async function isStoreExists(storeId: number, userId?: string) {
    const store = await db.query.stores.findFirst({
        columns: {
            id: true,
        },
        where: and(
            eq(storesTable.id, storeId),
            userId ? eq(storesTable.ownerId, userId) : undefined,
            eq(storesTable.isDeleted, false)
        ),
    })

    return store !== undefined
}

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
    //@ts-expect-error clerk types are UserListParam but they are actually string[]
    const users = await clerkClient.users.getUserList(userList)
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
    const usersIds = getUsersIds(list)
    const usersFullNames = await getUsers(usersIds)

    return list.map((item) => {
        return {
            ...item,
            userFullName: usersFullNames.get(item.userId),
            userImg: usersFullNames.get(item.userId + "-img"),
        }
    })
}

export async function isCartExist(userId: string) {
    const cart = await db.query.carts.findFirst({
        columns: {
            id: true,
        },
        where: (cart) => eq(cart.userId, userId),
    })
    return cart
}

export async function createCart(userId: string, items: NewCartItem[] = []) {
    const cart = await db.insert(cartsTable).values({
        userId,
    })

    if (items.length === 0) {
        return cart
    }

    await db.insert(cartItemsTable).values(
        items.map((item) => ({
            storeId: item.storeId,
            bookId: item.bookId,
            cartId: Number(cart.insertId),
        }))
    )
    return cart
}
