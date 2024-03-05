
import { headers } from "next/headers"
import { clerkClient, type WebhookEvent } from "@clerk/nextjs/server"
import { Webhook } from "svix"

export async function POST(req: Request) {
    // You can find this in the Clerk Dashboard -> Webhooks -> choose the webhook
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

    if (!WEBHOOK_SECRET) {
        throw new Error(
            "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
        )
    }

    // Get the headers
    const headerPayload = headers()
    const svix_id = headerPayload.get("svix-id")
    const svix_timestamp = headerPayload.get("svix-timestamp")
    const svix_signature = headerPayload.get("svix-signature")

    // If there are no headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
        return new Response("Error occurred -- no svix headers", {
            status: 400,
        })
    }

    // Get the body
    const payload = (await req.json()) as WebhookEvent
    const body = JSON.stringify(payload)

    // Create a new Svix instance with your secret.
    const webhook = new Webhook(WEBHOOK_SECRET)

    let event: WebhookEvent

    // Verify the payload with the headers
    try {
        event = webhook.verify(body, {
            "svix-id": svix_id,
            "svix-timestamp": svix_timestamp,
            "svix-signature": svix_signature,
        }) as WebhookEvent
    } catch (err) {
        console.error("Error verifying webhook:", err)
        return new Response("Error occurred", {
            status: 400,
        })
    }

    switch (event.type) {
        case "user.created":
            const userId = payload.data.id
            const username =
                "username" in payload.data ? payload.data.username : null
            const email =
                "email_addresses" in payload.data
                    ? payload.data.email_addresses[0].email_address
                    : null
            try {
                if (username !== null) {
                    throw new Response("✅ clerk webhook: User already has username", {status: 200})
                }

                if (email === null) {
                    throw new Error("Email is required")
                }

                if (userId === null || userId === undefined) {
                    throw new Error("User Id is required")
                }

                const newUsername = email.split("@")[0]

                const user = await clerkClient.users.updateUser(userId, {
                    username: newUsername,
                })
                console.log(
                    `✅ clerk webhook: User with id (${user.id}) has been updated with username (${user.username})`
                )
                return new Response("✅ clerk webhook: User updated", { status: 200 })
            } catch (error) {
                console.log("❌ clerk webhook: error: ", error)
                return new Response("❌ clerk webhooks error", { status: 400 })
            }
            default:
                console.warn(`❌ clerk webhook: Unhandled event type: ${event.type}`)
    }
    return new Response(null, { status: 200 })
}
