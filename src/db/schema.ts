import type { CartItem, CheckoutItem } from "@/types"
import { relations, type InferModel } from "drizzle-orm"
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
    title: varchar("title", { length: 191 }).notNull(),
    description: text("description"),
    cover: varchar("cover", { length: 200 }),
    price: decimal("price", { precision: 10, scale: 2 }).notNull().default("0"),
    inventory: int("inventory").notNull().default(0),
    createdAt: timestamp("createdAt").defaultNow(),
    updatedAt: timestamp("updatedAt").onUpdateNow(),
})

export type Book = typeof books.$inferSelect
export type NewBook = typeof books.$inferInsert

export const booksRelations = relations(books, ({ many }) => ({
    ratings: many(ratings),
    categories: many(booksToCategories),
}))

export const ratings = mysqlTable(`${APP_NAME}_ratings`, {
    id: serial("id").primaryKey(),
    userId: varchar("userId", { length: 191 }).notNull(),
    bookId: varchar("bookId", { length: 191 }).notNull(),
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
        pk: primaryKey(t.bookId, t.categoryId),
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
    items: json("items").$type<CartItem[] | null>().default(null),
    createdAt: timestamp("createdAt").defaultNow(),
})

export type Cart = typeof carts.$inferSelect
export type NewCart = typeof carts.$inferInsert

export const stores = mysqlTable(`${APP_NAME}_stores`, {
    id: serial("id").primaryKey(),
    ownerId: varchar("userId", { length: 191 }).notNull(),
    name: varchar("name", { length: 191 }).notNull(),
    description: text("description"),
    logo: varchar("logo", { length: 200 }),
    thumbnail: varchar("thumbnail", { length: 200 }),
    stripeAccountId: varchar("stripeAccountId", { length: 191 }),
    createdAt: timestamp("createdAt").defaultNow(),
    updatedAt: timestamp("updatedAt").onUpdateNow(),
})

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
    userId: varchar("userId", { length: 191 }),
    bookId: varchar("bookId", { length: 191 }),
    stripeAccountId: varchar("stripeAccountId", { length: 191 }).notNull(),
    stripeAccountCreatedAt: int("stripeAccountCreatedAt").notNull(),
    stripeAccountExpiresAt: int("stripeAccountExpiresAt").notNull(),
    detailsSubmitted: boolean("detailsSubmitted").notNull().default(false),
    createdAt: timestamp("createdAt").defaultNow(),
})

export type Payment = typeof payments.$inferSelect
export type NewPayment = typeof payments.$inferInsert

export const orders = mysqlTable(`${APP_NAME}_orders`, {
    id: serial("id").primaryKey(),
    userId: varchar("userId", { length: 191 }),
    items: json("items").$type<CheckoutItem[] | null>().default(null),
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

export type Order = typeof orders.$inferSelect
export type NewOrder = typeof orders.$inferInsert

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
