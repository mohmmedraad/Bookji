import "dotenv/config"

import { env } from "@/env.mjs"
import { connect } from "@planetscale/database"
import { drizzle } from "drizzle-orm/planetscale-serverless"

import * as schema from "./schema"

// create the connection
const connection = connect({
    // host: process.env.DATABASE_HOST,
    // username: process.env.DATABASE_USERNAME,
    // password: process.env.DATABASE_PASSWORD,
    url: env.DATABASE_URL as string,
})

export const db = drizzle(connection, { schema })
