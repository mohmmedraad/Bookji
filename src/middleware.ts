import { NextResponse } from "next/server"
// import { type UserRole } from "@/types"
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"

const isPublicRoute = createRouteMatcher([
    "/",
    "/pending",
    "/verification(.*)",
    "/sign-in(.*)",
    "/sign-up(.*)",
    "/sso-callback(.*)",
    "/categories(.*)",
    "/product(.*)",
    "/products(.*)",
    "/product(.*)",
    "/stores(.*)",
    "/store(.*)",
    "/build-a-board(.*)",
    "/email-preferences(.*)",
    "/blog(.*)",
    "/about(.*)",
    "/shop(.*)",
    "/contact-us(.*)",
    "/getting-started(.*)",
    "/chat-support(.*)",
    "/help(.*)",
    "/report(.*)",
    "/terms(.*)",
    "/privacy(.*)",
    "/api(.*)",
    "/book(.*)",
])

export default clerkMiddleware((auth, request) => {
    if (!isPublicRoute(request)) {
        const url = new URL(request.nextUrl.origin)

        if (!auth().userId) {
            //  If user tries to access a private route without being authenticated,
            //  redirect them to the sign in page
            const searchParams = request.nextUrl.searchParams
            const pathname = request.nextUrl.pathname
            const origin = `${pathname}?${searchParams.toString()}`
            url.searchParams.set("_origin", origin)
            url.pathname = `/sign-in`
            return NextResponse.redirect(url)
        }
    }
})

// export authMiddleware({
//     // Public routes are routes that don't require authentication
//     afterAuth(auth, req) {
//         if (auth.isPublicRoute) {
//             //  For public routes, we don't need to do anything
//             return NextResponse.next()
//         }

//         const url = new URL(req.nextUrl.origin)

//         if (!auth.userId) {
//             //  If user tries to access a private route without being authenticated,
//             //  redirect them to the sign in page
//             const searchParams = req.nextUrl.searchParams
//             const pathname = req.nextUrl.pathname
//             const origin = `${pathname}?${searchParams.toString()}`
//             url.searchParams.set("_origin", origin)
//             url.pathname = `/sign-in`
//             return NextResponse.redirect(url)
//         }

//         // Set the user's role to user if it doesn't exist
//         // const user = await clerkClient.users.getUser(auth.userId)
//         // console.log(user)

//         // if (!user) {
//         //     throw new Error("User not found.")
//         // }

//         // If the user doesn't have a role, set it to user
//         // if (!user.privateMetadata.role) {
//         //   await clerkClient.users.updateUserMetadata(auth.userId, {
//         //     privateMetadata: {
//         //       role: "user" satisfies UserRole,
//         //     },
//         //   })
//         // }
//     },
// })

export const config = {
    matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api)(.*)"],
}
