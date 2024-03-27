/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { createEnv } from "@t3-oss/env-nextjs"
import { email, enum_, string, url } from "valibot"

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
export const env = createEnv({
    /**
     * Specify your server-side environment variables schema here. This way you can ensure the app
     * isn't built with invalid env vars.
     */
    server: {
        DATABASE_URL: string(),
        // NODE_ENV: enum_(
        //     Environment),
        CLERK_SECRET_KEY: string(),
        // RESEND_API_KEY: string(),
        // EMAIL_FROM_ADDRESS: string([email()]),
        UPLOADTHING_SECRET: string(),
        UPLOADTHING_APP_ID: string(),
        STRIPE_SECRET_KEY: string(),
        // STRIPE_WEBHOOK_SECRET: string(),
        // STRIPE_STD_MONTHLY_PRICE_ID: string(),
        // STRIPE_PRO_MONTHLY_PRICE_ID: string(),
    },

    /**
     * Specify your client-side environment variables schema here. This way you can ensure the app
     * isn't built with invalid env vars. To expose them to the client, prefix them with
     * `NEXT_PUBLIC_`.
     */
    client: {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        NEXT_PUBLIC_APP_URL: string([url()]),
        NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: string(),
    },

    /**
     * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
     * middlewares) or client-side so we need to destruct manually.
     */
    runtimeEnv: {
        NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
        DATABASE_URL: process.env.DATABASE_URL,
        NODE_ENV: process.env.NODE_ENV,
        NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
            process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
        CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
        // RESEND_API_KEY: process.env.RESEND_API_KEY,
        // EMAIL_FROM_ADDRESS: process.env.EMAIL_FROM_ADDRESS,
        UPLOADTHING_SECRET: process.env.UPLOADTHING_SECRET,
        UPLOADTHING_APP_ID: process.env.UPLOADTHING_APP_ID,
        STRIPE_SECRET_KEY: process.env.STRIPE_API_KEY,
        // STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
        // STRIPE_STD_MONTHLY_PRICE_ID: process.env.STRIPE_STD_MONTHLY_PRICE_ID,
        // STRIPE_PRO_MONTHLY_PRICE_ID: process.env.STRIPE_PRO_MONTHLY_PRICE_ID,
    },
    /**
     * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
     * This is especially useful for Docker builds.
     */
    skipValidation: !!process.env.SKIP_ENV_VALIDATION,
})
