import type { CartItem, CheckoutItem } from "@/types"
import { inArray, relations, type InferModel } from "drizzle-orm"
import {
    boolean,
    decimal,
    int,
    json,
    mysqlTable,
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
    tag: json("items").$type<string[] | null>().default(null),
    inventory: int("inventory").notNull().default(0),
    createdAt: timestamp("createdAt").defaultNow(),
    updatedAt: timestamp("updatedAt").onUpdateNow(),
})

export type Book = InferModel<typeof books>

export const booksRelations = relations(books, ({ many }) => ({
    ratings: many(ratings),
}))

export const ratings = mysqlTable(`${APP_NAME}_ratings`, {
    id: serial("id").primaryKey(),
    userId: varchar("userId", { length: 191 }).notNull(),
    bookId: varchar("bookId", { length: 191 }).notNull(),
    rating: int("rating").notNull(),
    createdAt: timestamp("createdAt").defaultNow(),
})

export type Rating = InferModel<typeof ratings>

export const ratingsRelations = relations(ratings, ({ one }) => ({
    book: one(books, {
        fields: [ratings.bookId],
        references: [books.id],
    }),
}))

export const carts = mysqlTable(`${APP_NAME}_carts`, {
    id: serial("id").primaryKey(),
    userId: varchar("userId", { length: 191 }),
    paymentIntentId: varchar("paymentIntentId", { length: 191 }),
    clientSecret: varchar("clientSecret", { length: 191 }),
    items: json("items").$type<CartItem[] | null>().default(null),
    createdAt: timestamp("createdAt").defaultNow(),
})

export type Cart = InferModel<typeof carts>

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

export type EmailPreference = InferModel<typeof emailPreferences>

export const payments = mysqlTable(`${APP_NAME}_payments`, {
    id: serial("id").primaryKey(),
    userId: varchar("userId", { length: 191 }),
    stripeAccountId: varchar("stripeAccountId", { length: 191 }).notNull(),
    stripeAccountCreatedAt: int("stripeAccountCreatedAt").notNull(),
    stripeAccountExpiresAt: int("stripeAccountExpiresAt").notNull(),
    detailsSubmitted: boolean("detailsSubmitted").notNull().default(false),
    createdAt: timestamp("createdAt").defaultNow(),
})

export type Payment = InferModel<typeof payments>

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

export type Order = InferModel<typeof orders>

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

export type Address = InferModel<typeof addresses>
