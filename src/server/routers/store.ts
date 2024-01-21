import { db } from "@/db"
import { stores } from "@/db/schema"
import { wrap } from "@decs/typeschema"

import { newStoreSchema } from "@/lib/validations/store"

import { privateProcedure, router } from "../trpc"

export const storeRouter = router({
    create: privateProcedure
        .input(wrap(newStoreSchema))
        .mutation(async ({ ctx, input }) => {
            const { name, description, logo, thumbnail } = input

            const store = await db.insert(stores).values({
                name,
                description,
                logo,
                thumbnail,
                ownerId: ctx.user.id,
            })

            return store.insertId
        }),
})
