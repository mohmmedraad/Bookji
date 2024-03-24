import { Clerk, type User } from "@clerk/nextjs/server"
import { faker } from "@faker-js/faker"
import fetch from "node-fetch"

import { db } from "./index.js"
import {
    addresses as addressesTable,
    books as booksTable,
    cartItems as cartItemsTable,
    carts as cartsTable,
    orderItems as orderItemsTable,
    orders as ordersTable,
    stores as storesTable,
    type NewAddress,
    type NewOrder,
} from "./schema.js"

const stroeBooks = [
    {
        id: 5,
        userId: "user_2cUPWoTcIyoHmf844ktO7kPM112",
        storeId: 24,
    },
    {
        id: 7,
        userId: "user_2cUPWoTcIyoHmf844ktO7kPM112",
        storeId: 24,
    },
    {
        id: 11,
        userId: "user_2cUPWoTcIyoHmf844ktO7kPM112",
        storeId: 24,
    },
]

const clerk = Clerk({
    secretKey: "sk_test_ms6XosVnETxrdffiWsdqKuIDqO2BCl7Ydygutl3o7l",
})

const main = () => {
    console.log("Seed start")

    console.log("Seed done")
}

void main()

async function seedStoreOrders(storeId: number, ordersNmuber: number) {
    const array = new Array(ordersNmuber).fill(0)
    const users = await clerk.users.getUserList({
        limit: 40,
    })

    const newAddresses = array.map(generateRandomAddress)

    await db.insert(addressesTable).values(newAddresses)

    const newOrders = newAddresses.map(({ id }) =>
        generateRandomOrder(24, generateRandomUser(users).id, id!)
    )

    await db.insert(ordersTable).values(newOrders)

    const orderItems = newOrders.flatMap(({ id }) => generateRandomItems(id!))

    await db.insert(orderItemsTable).values(orderItems)
}

function generateClerkRandomUser() {
    const email = faker.internet.email()

    return {
        emailAddress: [faker.internet.email()],
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        username: email.split("@")[0],
    }
}

function generateRandomOrder(
    storeId: number,
    userId: string,
    addressId: number
): NewOrder {
    return {
        id: faker.number.int({
            min: 0,
            max: 1_000_000,
        }),
        storeId,
        userId,
        addressId,
        name: faker.person.fullName(),
        email: faker.internet.email(),
        stripePaymentIntentId: userId,
        stripePaymentIntentStatus: "seccess",
        total: faker.finance.amount({
            min: 0,
            max: 500,
        }),
        createdAt: faker.date.between({
            from: "2023-01-01T00:00:00.000Z",
            to: "2024-01-01T00:00:00.000Z",
        }),
    }
}

function generateRandomItems(orderId: number) {
    const start = faker.number.int({
        min: 0,
        max: stroeBooks.length - 1,
    })

    // copilot give me the bulit in js min funciton
    const end = faker.number.int({
        min: Math.min(start + 1, stroeBooks.length),
        max: stroeBooks.length,
    })

    return stroeBooks.slice(start, end).map((item) => ({
        orderId,
        bookId: item.id,
        quantity: faker.number.int({
            min: 1,
            max: 10,
        }),
    }))
}

function generateRandomAddress(): NewAddress {
    return {
        id: faker.number.int({
            min: 0,
            max: 1_000_000,
        }),
        line1: faker.location.street(),
        line2: faker.location.street(),
        city: faker.location.city(),
        country: faker.location.country(),
        postalCode: faker.location.zipCode(),
        state: faker.location.state(),
    }
}

function generateRandomUser(users: User[]) {
    return users[
        faker.number.int({
            min: 0,
            max: users.length - 1,
        })
    ]
}

async function downloadImage(imageUrl: string) {
    const response = await fetch(imageUrl)
    const imageBuffer = await response.buffer()
    console.log("type: ", response.headers.get("content-type"))

    return new Blob([imageBuffer], {
        type: response.headers.get("content-type") as string,
    })
}
