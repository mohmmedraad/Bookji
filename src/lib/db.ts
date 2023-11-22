/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { PrismaClient } from "@prisma/client"

import "server-only"

declare global {
    // eslint-disable-next-line no-var, no-unused-vars
    var cachedPrisma: PrismaClient
}

let prisma: PrismaClient
if (process.env.NODE_ENV === "production") {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    prisma = await new PrismaClient()
} else {
    if (!global.cachedPrisma) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        global.cachedPrisma = new PrismaClient()
    }
    prisma = global.cachedPrisma
}

export const db = prisma
