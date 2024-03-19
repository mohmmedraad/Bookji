import { booksRouter } from "./routers/books"
import { cartRouter } from "./routers/cart"
import { storeRouter } from "./routers/store"
import { stripeRouter } from "./routers/stripe"
import { usersRouter } from "./routers/users"
import { router } from "./trpc"

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const dynamic = "force-dynamic"

export const appRouter = router({
    books: booksRouter,
    cart: cartRouter,
    store: storeRouter,
    stripe: stripeRouter,
    users: usersRouter,
})

export type AppRouter = typeof appRouter
