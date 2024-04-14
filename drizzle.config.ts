import { env } from "@/env.mjs"
import type { Config } from "drizzle-kit"

export default {
    schema: "./src/db/schema.ts",
    driver: "pg",
    out: "./drizzle",
    dbCredentials: {
        connectionString: env.DATABASE_URL as string,
        // uri: env.DATABASE_URL as string,
    },
} satisfies Config
