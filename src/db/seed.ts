import { createReadStream, readFileSync, statSync } from "fs"
import path from "path"
import { Clerk, type User } from "@clerk/nextjs/server"
import { faker } from "@faker-js/faker"
import fetch from "node-fetch"

import { uploadFiles } from "@/lib/uploadthing.js"

import { db } from "./index.js"
import {
    addresses as addressesTable,
    books as booksTable,
    booksToCategories,
    cartItems as cartItemsTable,
    carts as cartsTable,
    categories as categoriesTable,
    NewBook,
    NewRating,
    orderItems as orderItemsTable,
    orders as ordersTable,
    ratings as ratingsTable,
    stores as storesTable,
    type NewAddress,
    type NewOrder,
} from "./schema.js"

const categories = [
    { id: 1, name: "Fiction" },
    { id: 2, name: "Non-Fiction" },
    { id: 3, name: "Science Fiction" },
    { id: 4, name: "Mystery/Thriller" },
    { id: 5, name: "Fantasy" },
    {
        id: 6,
        name: "Historical Fiction",
        createdAt: "2023-11-22T13:51:44.000Z",
    },
    { id: 7, name: "Romance" },
    {
        id: 8,
        name: "Biography/Autobiography",
        createdAt: "2023-11-22T13:51:44.000Z",
    },
    { id: 9, name: "History" },
    { id: 10, name: "Science" },
    { id: 11, name: "Self-Help" },
    { id: 12, name: "Business" },
    { id: 13, name: "Health" },
    { id: 14, name: "Travel" },
    { id: 15, name: "Cooking" },
    { id: 16, name: "Technology" },
    { id: 17, name: "Computer Science" },
    {
        id: 18,
        name: "Artificial Intelligence",
        createdAt: "2023-11-22T13:51:44.000Z",
    },
    { id: 19, name: "Data Science" },
    { id: 20, name: "Programming" },
    { id: 21, name: "Machine Learning" },
    { id: 22, name: "Web Development" },
    { id: 23, name: "Networks" },
    { id: 24, name: "Cybersecurity" },
    {
        id: 25,
        name: "User Interface Design",
        createdAt: "2023-11-22T13:51:44.000Z",
    },
    {
        id: 26,
        name: "User Experience Design",
        createdAt: "2023-11-22T13:51:44.000Z",
    },
    {
        id: 27,
        name: "Interaction Design",
        createdAt: "2023-11-22T13:51:44.000Z",
    },
    { id: 28, name: "Visual Design" },
    { id: 29, name: "Prototyping" },
    { id: 30, name: "Usability" },
    {
        id: 31,
        name: "Human-Computer Interaction",
        createdAt: "2023-11-22T13:51:44.000Z",
    },
    { id: 32, name: "Philosophy" },
    { id: 33, name: "Psychology" },
    { id: 34, name: "Sociology" },
    { id: 35, name: "Anthropology" },
    {
        id: 36,
        name: "Political Science",
        createdAt: "2023-11-22T13:51:44.000Z",
    },
    { id: 37, name: "Economics" },
    {
        id: 38,
        name: "Environmental Science",
        createdAt: "2023-11-22T13:51:44.000Z",
    },
    { id: 39, name: "Physics" },
    { id: 40, name: "Chemistry" },
    { id: 41, name: "Biology" },
    { id: 42, name: "Mathematics" },
    {
        id: 43,
        name: "Philology/Linguistics",
        createdAt: "2023-11-22T13:51:44.000Z",
    },
    { id: 44, name: "Poetry" },
    { id: 45, name: "Drama" },
    { id: 46, name: "Horror" },
]

const usersIds = [
    "user_2eSUZ3ao2KO31TLUXn86Z1rO7NW",
    "user_2e62ZrHB5MYDVkv2QfEY91ugDqJ",
    "user_2e62ZcMiW1Wu2XPPOJSRl3Z7Kys",
    "user_2e62ZdLx2hy1zTltGHpc0NjCpKX",
    "user_2e62ZhH9GeZRJ8r14nQ0W0c5iED",
    "user_2e62ZcM6RWgAqfvOenCczgO0nPr",
    "user_2e62ZjnNxbHO8OVaU6J5ZFJTTsK",
    "user_2e62ZoRVxORKVNRy5A7kMEnCL6e",
    "user_2e62ZnFtqOfydb4M3mnMk9PTUhu",
    "user_2e62ZjsoqZbaUb6uzd8FhgNCBFv",
    "user_2cUP2SL92h9GfUYQ70GIRX0N1wF",
    "user_2cUPWoTcIyoHmf844ktO7kPM112",
    "user_2dG0tRU1hsDdH7Ry4n4ALKYWR6I",
    "user_2e62BkBu3ew8fJaCI6nchuj3hmC",
    "user_2e62BpE6i8px7ZoHeK04ukXjQFR",
    "user_2e62Bn7ty370LvOhCQvi8epzPig",
    "user_2e62BjRGGCYCKyY5c6QEqDzO9l7",
    "user_2e62BnmYywI6C9IAa6x3xjrrWHb",
    "user_2e62BmVDPyWuZri3SAMiOmKM7T7",
    "user_2e62BjeLYni0uHwhB069jXFFnps",
]

const users = [
    {
        userId: "user_2e62ZrHB5MYDVkv2QfEY91ugDqJ",
        store: {
            id: 1,
            name: "I Am a Book",
            description: "",
            logo: "https://utfs.io/f/9f81716d-69c7-413b-ae56-6356d6271555-1d.jpg",
            slug: "i-am-a-book",
            active: true,
            books: [
                {
                    id: 1,
                    title: "The Adventure of Lily",
                    description:
                        "Once upon a time, there was a small village nestled in the heart of a lush forest. The villagers were kind and hardworking, and they lived in harmony with the creatures of the forest.",
                    price: "10.00",
                    inventory: 20,
                    slug: "the-adventure-of-lily",
                    author: "Jackie Knapp",
                    cover: "https://utfs.io/f/276506e6-ab79-4410-b4c8-1c5433fbbc47-37soc9.jpg",
                    storeId: 1,
                    userId: "user_2e62ZrHB5MYDVkv2QfEY91ugDqJ",
                    categories: [3, 6],
                    rating: [
                        {
                            bookId: 1,
                            rating: 5,
                            userId: "user_2e62ZrHB5MYDVkv2QfEY91ugDqJ",
                            comment:
                                "I absolutely loved this book! The story was captivating, and the characters were so well-developed. It's a must-read for anyone who enjoys adventure and fantasy.",
                        },
                        {
                            bookId: 1,
                            rating: 4,
                            userId: "user_2e62ZcMiW1Wu2XPPOJSRl3Z7Kys",
                            comment:
                                "A delightful read that took me on a journey through a magical world. The author's descriptive writing style made every scene come to life.",
                        },
                        {
                            bookId: 1,
                            rating: 3,
                            userId: "user_2e62ZdLx2hy1zTltGHpc0NjCpKX",
                            comment:
                                "While I enjoyed the storyline, I found some parts to be a bit predictable. Nonetheless, it was a pleasant reading experience overall.",
                        },
                    ],
                },
                {
                    id: 2,
                    title: "The Hypocrite World",
                    description: "",
                    price: "20.00",
                    inventory: 25,
                    slug: "the-hypocrite-world",
                    author: "Sophia Hill",
                    cover: "https://utfs.io/f/d0d045d2-d32b-496e-ad3d-7c0005df2dea-a1b2g.jpg",
                    storeId: 1,
                    userId: "user_2e62ZrHB5MYDVkv2QfEY91ugDqJ",
                    categories: [2, 4],
                    rating: [
                        {
                            bookId: 2,
                            rating: 2,
                            userId: "user_2e62ZoRVxORKVNRy5A7kMEnCL6e",
                            comment:
                                "I had high hopes for this book, but unfortunately, it fell short of my expectations. The plot felt disjointed, and the characters lacked depth.",
                        },
                        {
                            bookId: 2,
                            rating: 3,
                            userId: "user_2e62ZnFtqOfydb4M3mnMk9PTUhu",
                            comment:
                                "An interesting concept that explored important themes, but the execution could have been better. Still worth a read for its thought-provoking content.",
                        },
                        {
                            bookId: 2,
                            rating: 4,
                            userId: "user_2e62ZjsoqZbaUb6uzd8FhgNCBFv",
                            comment:
                                "I found this book to be engaging and thought-provoking. The author's exploration of societal issues was insightful and kept me hooked until the end.",
                        },
                    ],
                },
            ],
        },
    },
    {
        userId: "user_2e62ZoRVxORKVNRy5A7kMEnCL6e",
        store: {
            id: 2,
            name: "BookPlace",
            description: "",
            logo: "https://utfs.io/f/9f81716d-69c7-413b-ae56-6356d6271555-1d.jpg",
            slug: "BookPlace",
            active: true,
            books: [
                {
                    id: 3,
                    title: "Cold Lake",
                    description:
                        "When a fisherman reels in a plastic bag containing a severed human head from the depths of Cold Lake, Colorado, sheriff David Wolf and his deputies scramble to the scene. It doesn't take long to realize more surprises lurk below.",
                    price: "40.00",
                    inventory: 50,
                    slug: "cold-lake",
                    author: "David Wolf",
                    cover: "https://utfs.io/f/276506e6-ab79-4410-b4c8-1c5433fbbc47-37soc9.jpg",
                    storeId: 2,
                    userId: "user_2e62ZoRVxORKVNRy5A7kMEnCL6e",
                    categories: [1, 5],
                    rating: [
                        {
                            bookId: 3,
                            rating: 4,
                            userId: "user_2e62ZhH9GeZRJ8r14nQ0W0c5iED",
                            comment:
                                "A thrilling and suspenseful mystery that kept me guessing until the end. The author's attention to detail and twisty plot made it an enjoyable read.",
                        },
                        {
                            bookId: 3,
                            rating: 5,
                            userId: "user_2e62ZcM6RWgAqfvOenCczgO0nPr",
                            comment:
                                "Wow! What a rollercoaster of emotions! This book had me on the edge of my seat from start to finish. Highly recommended for mystery lovers.",
                        },
                        {
                            bookId: 3,
                            rating: 3,
                            userId: "user_2e62ZjsoqZbaUb6uzd8FhgNCBFv",
                            comment:
                                "While the premise was intriguing, I felt that the story lacked depth in certain areas. However, it still managed to hold my interest throughout.",
                        },
                    ],
                },
                {
                    id: 4,
                    title: "The Final Empire",
                    description:
                        "For a thousand years the ash fell and no flowers bloomed. For a thousand years the Skaa slaved in misery and lived in fear. For a thousand years the Lord Ruler.",
                    price: "24.50",
                    inventory: 25,
                    slug: "the-final-empire",
                    author: "Brandon Sanderson",
                    cover: "https://utfs.io/f/bd023b0d-9977-4a37-99fd-9a51be9b5a41-arj9aj.jpg",
                    storeId: 2,
                    userId: "user_2e62ZoRVxORKVNRy5A7kMEnCL6e",
                    categories: [1, 4],
                    rating: [
                        {
                            bookId: 4,
                            rating: 5,
                            userId: "user_2e62BkBu3ew8fJaCI6nchuj3hmC",
                            comment:
                                "An epic fantasy masterpiece! The world-building, character development, and intricate plot twists make this a must-read for any fantasy enthusiast.",
                        },
                        {
                            bookId: 4,
                            rating: 4,
                            userId: "user_2e62Bn7ty370LvOhCQvi8epzPig",
                            comment:
                                "I thoroughly enjoyed every aspect of this book. The author's imagination and storytelling prowess shine throughout. A definite recommendation from me!",
                        },
                        {
                            bookId: 4,
                            rating: 3,
                            userId: "user_2e62BjsoqZbaUb6uzd8FhgNCBFv",
                            comment:
                                "While I appreciated the world-building and intricate magic system, I found the pacing to be a bit slow at times. Still, a solid fantasy read.",
                        },
                    ],
                },
            ],
        },
    },
]

const clerk = Clerk({
    secretKey: process.env.CLERK_SECRET_KEY,
})

const main = async () => {
    // await db.insert(storesTable).values(
    //     users.map((user) => ({
    //         id: user.store.id,
    //         userId: user.userId,
    //         ownerId: user.userId,
    //         name: user.store.name,
    //         description: user.store.description,
    //         logo: user.store.logo,
    //         slug: user.store.slug,
    //         active: user.store.active,
    //     }))
    // )

    // await db.insert(booksTable).values(
    //     users.flatMap((user) =>
    //         user.store.books.map((book) => ({
    //             id: book.id,
    //             title: book.title,
    //             description: book.description,
    //             price: book.price,
    //             inventory: book.inventory,
    //             slug: book.slug,
    //             conver: book.cover,
    //             author: book.author,
    //             storeId: book.storeId,
    //             userId: book.userId,
    //         }))
    //     )
    // )
    // const booksCategories = users
    //     .map((user) =>
    //         user.store.books.map((book) =>
    //             book.categories.map((c) => ({ bookId: book.id, categoryId: c }))
    //         )
    //     )
    //     .flat(3)

    // const ratings = await db.insert(booksToCategories).values(booksCategories)

    await seedStoreOrders(4, 10)
}

void main()

async function seedStoreOrders(storeId: number, ordersCount: number) {
    const array = new Array(ordersCount).fill(0)
    const users = await clerk.users.getUserList({
        limit: 40,
    })

    const newAddresses = array.map(generateRandomAddress)

    await db.insert(addressesTable).values(newAddresses)

    const newOrders = newAddresses.map(({ id }) =>
        generateRandomOrder(storeId, generateRandomUser(users).id, id!)
    )

    await db.insert(ordersTable).values(newOrders)

    const orderItems = newOrders.flatMap(({ id }) =>
        generateRandomItems(id!, 6)
    )

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

function generateRandomItems(orderId: number, bookId: number) {
    // const start = faker.number.int({
    //     min: 0,
    //     max: stroeBooks.length - 1,
    // })

    // // copilot give me the bulit in js min funciton
    // const end = faker.number.int({
    //     min: Math.min(start + 1, stroeBooks.length),
    //     max: stroeBooks.length,
    // })

    return {
        orderId,
        bookId,
        quantity: faker.number.int({
            min: 1,
            max: 10,
        }),
    }
}

function generateRandomAddress(): NewAddress {
    return {
        // id: faker.number.int({
        //     min: 0,
        //     max: 1_000_000,
        // }),
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

function getFile(fileName: string) {
    const imgPath = path.join(__dirname, "../../public", fileName)
    console.log("imgPath: ", imgPath)

    // Read the file content as a Buffer
    const fileContent = readFileSync(imgPath)

    console.log("fileContent: ", fileContent)
    console.log("file: ", new Blob([fileContent], { type: "image/jpg" }))

    // Convert the Buffer into a File
    // const file = new File([fileContent], fileName, {
    //     type: "image/jpg",
    // })

    // console.log("file: ", file)

    // return file
}
