import { clerkClient } from "@clerk/nextjs"
import { type User } from "@clerk/nextjs/server"
import { wrap } from "@decs/typeschema"
import { TRPCError } from "@trpc/server"

import { updateUserSchema } from "@/lib/validations/auth"

import { privateProcedure, router } from "../trpc"

export const usersRouter = router({
    updateUser: privateProcedure
        .input(wrap(updateUserSchema))
        .mutation(async ({ ctx, input }) => {
            try {
                const isUsernameTakenByAnotherUser = await isUsernameTaken(
                    ctx.user,
                    input.username
                )

                if (isUsernameTakenByAnotherUser) {
                    throw new TRPCError({
                        code: "CONFLICT",
                        message: "Username is already taken by another user",
                    })
                }

                await clerkClient.users.updateUser(ctx.userId, { ...input })
                return `User updated successfully!`
            } catch (error) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "An error occurred while updating the user",
                    cause: error,
                })
            }
        }),
})

async function isUsernameTaken(user: User, username: string) {
    if (user.username === username) return false

    const users = await clerkClient.users.getUserList({ username: [username] })
    return users.length > 0
}
