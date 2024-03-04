import type { CheckoutItem } from "@/types"
import { relations } from "drizzle-orm"
import {
    boolean,
    decimal,
    int,
    json,
    mysqlTable,
    primaryKey,
    serial,
    text,
    timestamp,
    varchar,
} from "drizzle-orm/mysql-core"

const APP_NAME = "Bookji"

export const books = mysqlTable(`${APP_NAME}_books`, {
    id: serial("id").primaryKey(),
    userId: varchar("userId", { length: 191 }).notNull(),
    storeId: int("storeId").notNull(),
    title: varchar("title", { length: 191 }).notNull().unique(),
    description: text("description"),
    cover: varchar("cover", { length: 200 }),
    price: decimal("price", { precision: 10, scale: 2 }).notNull().default("0"),
    inventory: int("inventory").notNull().default(0),
    slug: text("slug").notNull(),
    createdAt: timestamp("createdAt").defaultNow(),
    updatedAt: timestamp("updatedAt").onUpdateNow(),
})

export type Book = typeof books.$inferSelect
export type NewBook = typeof books.$inferInsert

export const booksRelations = relations(books, ({ many, one }) => ({
    ratings: many(ratings),
    categories: many(booksToCategories),
    cartItems: many(cartItems),
    store: one(stores, {
        fields: [books.storeId],
        references: [stores.id],
    }),
}))

export const orders = mysqlTable(`${APP_NAME}_orders`, {
    id: serial("id").primaryKey(),
    storeId: int("storeId").notNull(),
    userId: varchar("userId", { length: 191 }).notNull(),
    total: decimal("total", { precision: 10, scale: 2 }).notNull().default("0"),
    stripePaymentIntentId: varchar("stripePaymentIntentId", {
        length: 191,
    }).notNull(),
    stripePaymentIntentStatus: varchar(
        "${APP_NAME}_stripePaymentIntentStatus",
        {
            length: 191,
        }
    ).notNull(),
    name: varchar("name", { length: 191 }),
    email: varchar("email", { length: 191 }),
    addressId: int("addressId"),
    createdAt: timestamp("createdAt").defaultNow(),
})

export const ordersRelations = relations(orders, ({ one, many }) => ({
    store: one(stores, {
        fields: [orders.storeId],
        references: [stores.id],
    }),

    address: one(addresses, {
        fields: [orders.storeId],
        references: [addresses.id],
    }),

    items: many(orderItems),
}))

export type Order = typeof orders.$inferSelect
export type NewOrder = typeof orders.$inferInsert

export const orderItems = mysqlTable(`${APP_NAME}_orderItems`, {
    id: serial("id").primaryKey(),
    orderId: int("orderId").notNull(),
    bookId: int("bookId").notNull(),
    quantity: int("quantity").notNull().default(1),
    createdAt: timestamp("createdAt").defaultNow(),
})

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
    book: one(books, {
        fields: [orderItems.bookId],
        references: [books.id],
    }),
    order: one(orders, {
        fields: [orderItems.orderId],
        references: [orders.id],
    }),
}))

export const ratings = mysqlTable(`${APP_NAME}_ratings`, {
    id: serial("id").primaryKey(),
    userId: varchar("userId", { length: 191 }).notNull(),
    bookId: int("bookId").notNull(),
    rating: int("rating").notNull(),
    comment: text("comment"),
    createdAt: timestamp("createdAt").defaultNow(),
})

export type Rating = typeof ratings.$inferSelect
export type NewRating = typeof ratings.$inferInsert

export const ratingsRelations = relations(ratings, ({ one }) => ({
    book: one(books, {
        fields: [ratings.bookId],
        references: [books.id],
    }),
}))

export const categories = mysqlTable(`${APP_NAME}_categories`, {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 191 }).notNull(),
    createdAt: timestamp("createdAt").defaultNow(),
})

export const categoriesRelations = relations(categories, ({ many }) => ({
    book: many(booksToCategories),
}))

export const booksToCategories = mysqlTable(
    `${APP_NAME}_booksToCategories`,
    {
        bookId: int("bookId").notNull(),
        categoryId: int("categoryId").notNull(),
    },
    (t) => ({
        pk: primaryKey({ columns: [t.bookId, t.categoryId] }),
    })
)

export const booksToCategoriesRelations = relations(
    booksToCategories,
    ({ one }) => ({
        category: one(categories, {
            fields: [booksToCategories.categoryId],
            references: [categories.id],
        }),
        book: one(books, {
            fields: [booksToCategories.bookId],
            references: [books.id],
        }),
    })
)

export const carts = mysqlTable(`${APP_NAME}_carts`, {
    id: serial("id").primaryKey(),
    userId: varchar("userId", { length: 191 }),
    paymentIntentId: varchar("paymentIntentId", { length: 191 }),
    clientSecret: varchar("clientSecret", { length: 191 }),
    // items: json("items").$type<CartItem[] | null>().default(null),
    createdAt: timestamp("createdAt").defaultNow(),
})

export const cartsRelations = relations(carts, ({ many }) => ({
    items: many(cartItems),
}))

export type Cart = typeof carts.$inferSelect
export type NewCart = typeof carts.$inferInsert

export const cartItems = mysqlTable(`${APP_NAME}_cartItems`, {
    id: serial("id").primaryKey(),
    cartId: int("cart_id").notNull(),
    bookId: int("book_id").notNull(),
    storeId: int("store_id").notNull(),
    quantity: int("quantity").notNull().default(1),
    createdAt: timestamp("created_at").defaultNow(),
})

export type CartItem = typeof cartItems.$inferSelect
export type NewCartItem = Omit<
    typeof cartItems.$inferInsert,
    "id" | "createdAt" | "cartId"
>

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
    store: one(stores, {
        fields: [cartItems.storeId],
        references: [stores.id],
    }),
    cart: one(carts, {
        fields: [cartItems.cartId],
        references: [carts.id],
    }),
    book: one(books, {
        fields: [cartItems.bookId],
        references: [books.id],
    }),
}))

export const stores = mysqlTable(`${APP_NAME}_stores`, {
    id: serial("id").primaryKey(),
    ownerId: varchar("userId", { length: 191 }).notNull(),
    name: varchar("name", { length: 191 }).notNull(),
    description: text("description"),
    logo: varchar("logo", { length: 200 }),
    thumbnail: varchar("thumbnail", { length: 200 }),
    slug: text("slug"),
    stripeAccountId: varchar("stripeAccountId", { length: 191 }),
    active: boolean("active").notNull().default(false),
    createdAt: timestamp("createdAt").defaultNow(),
    updatedAt: timestamp("updatedAt").onUpdateNow(),
})

export const storesRelations = relations(stores, ({ many, one }) => ({
    books: many(books),
    orders: many(orders),
    cartItems: many(cartItems),
}))

export type Store = typeof stores.$inferSelect
export type NewStore = typeof stores.$inferInsert

export const emailPreferences = mysqlTable(`${APP_NAME}_email_preferences`, {
    id: serial("id").primaryKey(),
    userId: varchar("userId", { length: 191 }),
    email: varchar("email", { length: 191 }).notNull(),
    token: varchar("token", { length: 191 }).notNull(),
    newsletter: boolean("newsletter").notNull().default(false),
    marketing: boolean("marketing").notNull().default(false),
    transactional: boolean("transactional").notNull().default(false),
    createdAt: timestamp("createdAt").defaultNow(),
})

export type EmailPreference = typeof emailPreferences.$inferSelect
export type NewEmailPreference = typeof emailPreferences.$inferInsert

export const payments = mysqlTable(`${APP_NAME}_payments`, {
    id: serial("id").primaryKey(),
    storeId: int("storeId").notNull(),
    stripeAccountId: varchar("stripe_account_id", { length: 191 }).notNull(),
    stripeAccountCreatedAt: int("stripe_account_created_at"),
    stripeAccountExpiresAt: int("stripe_account_expires_at"),
    detailsSubmitted: boolean("details_submitted").notNull().default(false),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").onUpdateNow(),
})

export type Payment = typeof payments.$inferSelect
export type NewPayment = typeof payments.$inferInsert

export const addresses = mysqlTable(`${APP_NAME}_addresses`, {
    id: serial("id").primaryKey(),
    line1: varchar("line1", { length: 191 }),
    line2: varchar("line2", { length: 191 }),
    city: varchar("city", { length: 191 }),
    state: varchar("state", { length: 191 }),
    postalCode: varchar("postalCode", { length: 191 }),
    country: varchar("country", { length: 191 }),
    createdAt: timestamp("createdAt").defaultNow(),
})

export type Address = typeof addresses.$inferSelect
export type NewAddress = typeof addresses.$inferInsert
