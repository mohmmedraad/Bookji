import { db } from "@/db"
import { stores } from "@/db/schema"
import { wrap } from "@decs/typeschema"
import { TRPCError } from "@trpc/server"
import { and, eq } from "drizzle-orm"
import { number, object, partial, string } from "valibot"

import { slugify } from "@/lib/utils"
import { newStoreSchema, updateStoreSchema } from "@/lib/validations/store"

import { privateProcedure, router } from "../trpc"

export const storeRouter = router({
    create: privateProcedure
        .input(wrap(newStoreSchema))
        .mutation(async ({ ctx, input }) => {
            const { name, description, logo, thumbnail } = input
            const storeWithSameName = await db.query.stores.findFirst({
                where: eq(stores.name, name),
            })

            if (storeWithSameName) {
                throw new TRPCError({
                    code: "CONFLICT",
                    message: "Store with same name already exists",
                })
            }

            const store = await db.insert(stores).values({
                name,
                description,
                logo,
                thumbnail,
                ownerId: ctx.user.id,
                slug: slugify(name),
            })

            return store.insertId
        }),

    update: privateProcedure
        .input(wrap(updateStoreSchema))
        .mutation(async ({ input: { storeId, ...input }, ctx }) => {
            const isStoreNotExists = !(await db.query.stores.findFirst({
                where: and(
                    eq(stores.id, storeId),
                    eq(stores.ownerId, ctx.user.id)
                ),
            }))
            if (isStoreNotExists) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Store not found",
                })
            }
            let slug: string = ""

            if (input.name) {
                slug = slugify(input.name)
                // @ts-expect-error slug dosnt exist in input
                input.slug = slug
            }
            await db.update(stores).set(input).where(eq(stores.id, storeId))

            return slug
        }),
})
