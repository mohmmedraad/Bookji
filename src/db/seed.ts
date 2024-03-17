import { db } from "./index.js"
import { books as booksTable } from "./schema.js"

const data = [
    {
        id: 3,
        userId: "user_2cUPWoTcIyoHmf844ktO7kPM112",
        storeId: 25,
        author: "mohammed raad",
        title: "Who Can You Trust?",
        description: "this a book about Who Can You Trust",
        cover: "https://uploadthing.com/f/fe493552-f291-4735-ba67-8519a0981b34-x01bw1.webp",
        price: "50.00",
        inventory: 0,
        slug: "who-can-you-trust",
    },
    {
        id: 4,
        userId: "user_2cUPWoTcIyoHmf844ktO7kPM112",
        storeId: 25,
        author: "mohammed raad",
        title: "by the sea",
        description: "this is a book talk about the sea ",
        cover: "https://uploadthing.com/f/ddafb983-0226-4b57-be9a-cb1a4a6c8276-x01bw2.webp",
        price: "9.00",
        inventory: 8,
        slug: "by-the-sea",
    },
    {
        id: 5,
        userId: "user_2cUPWoTcIyoHmf844ktO7kPM112",
        storeId: 24,
        author: "mohammed raad",
        title: "Beautifull Day",
        description: "this is a book my kate anthony",
        cover: "https://uploadthing.com/f/44fe5751-29b0-4c02-be98-0fc5ab07e199-x01bvz.webp",
        price: "100.00",
        inventory: 20,
        slug: "beautifull-day",
    },
    {
        id: 6,
        userId: "user_2cUPWoTcIyoHmf844ktO7kPM112",
        storeId: 25,
        author: "mohammed raad",
        title: "The Good Guy",
        description: "this is a book about a movie",
        cover: "https://uploadthing.com/f/49c758d6-10de-4e99-8b65-84d24ab4dd4f-x01bvy.webp",
        price: "50.00",
        inventory: 7,
        slug: "the-good-guy",
    },
]

const main = async () => {
    console.log("Seed start")
    // await db.delete(booksTable)
    await db.insert(booksTable).values(data)
    console.log("Seed done")
}

void main()
