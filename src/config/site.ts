import { type OauthProvider, type SubscriptionPlan } from "@/types"

import { Icons } from "@/components/Icons"

const links = {
    github: "https://github.com/mohammedraad/Bookji",
    githubAccount: "https://github.com/mohammedraad",
    x: "https://twitter.com/mohammedraad_0",
    telegram: "https://t.me/mohammedraad_0",
}

export const site = {
    name: "Bookji",
    title: "Open-Source Books E-Commerce built with Next.js",
    description:
        "Bookji is an open-source e-commerce platform built with Next.js, TypeScript, and TailwindCSS. Sell and buy books hassle-free with secure payments via Stripe.",
    url: "https://bookji.vercel.app",
    keywords: [
        "Open-source e-commerce app",
        "next.js",
        "react",
        "trpc",
        "valibot",
        "clerk",
        "drizzle orm",
        "typeScript",
        "tailwindCSS",
        "stripe payments",
        "books selling",
        "e-commerce for books",
        "secure online payments",
        "open-source development",
        "typeScript app development",
    ],
    links,
    authors: [
        {
            name: "mohammed raad",
            // TODO: add your portfolio link
        },
    ],
    creator: "mohammed raad",
}

export const navLinks = [
    {
        name: "Home",
        url: "/",
    },
    {
        name: "Shop",
        url: "/shop",
    },
    {
        name: "About",
        url: "/about",
    },
    {
        name: "Contact us",
        url: "/contact-us",
    },
]

export const supportLinks = [
    {
        name: "Getting started",
        url: "/getting-started",
    },
    {
        name: "Chat Our support",
        url: "/chat-support",
    },
    {
        name: "Help center",
        url: "/help",
    },
    {
        name: "Report a bug",
        url: "/report",
    },
]

export const books = [
    {
        id: 1,
        title: "Who Can You Trust?",
        userFullName: "Rachel Botsman",
        cover: "/Book-5.webp",
        inventory: 10,
        categories: "ui/ux design",
        rating: 4,
        price: "380",
        userId: "29",
        description: "hello this is a description",
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: 2,
        title: "The Good Guy",
        userFullName: "Mark Maclalister",
        cover: "/Book-2.webp",
        inventory: 22,
        categories: "ui/ux design",
        rating: 2,
        price: "123",
        userId: "29",
        description: "hello this is a description",
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: 3,
        title: "Beautiful Day",
        userFullName: "Kate Anthony",
        cover: "/Book-3.webp",
        inventory: 5,
        categories: "ui/ux design",
        rating: 1,
        price: "111",
        userId: "29",
        description: "hello this is a description",
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: 4,
        title: "Scavenger",
        userFullName: "Darren Simpson",
        cover: "/Book-4.webp",
        inventory: 2,
        categories: "ui/ux design",
        rating: 5,
        price: "334",
        userId: "29",
        description: "hello this is a description",
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: 5,
        title: "The Great Symphony",
        userFullName: "Nancy Brown",
        cover: "/Book-1.webp",
        inventory: 0,
        categories: "ui/ux design",
        rating: 5,
        price: "10",
        userId: "29",
        description: "hello this is a description",
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: 6,
        title: "Ford Boyard Challenge",
        userFullName: "Ford Boyard",
        cover: "/Book-7.webp",
        inventory: 50,
        categories: "ui/ux design",
        rating: 2,
        price: "11",
        userId: "29",
        description: "hello this is a description",
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: 7,
        title: "Lightfall",
        userFullName: "MOhammed Raad",
        cover: "/Book-6.webp",
        inventory: 100,
        categories: "ui/ux design",
        rating: 1,
        price: "34",
        userId: "29",
        description: "hello this is a description",
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: 8,
        title: "Night Of The Walkers",
        userFullName: "Maurice Broaddus",
        cover: "/Book-8.webp",
        inventory: 98,
        categories: "ui/ux design",
        rating: 4,
        price: "99",
        userId: "29",
        description: "hello this is a description",
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: 9,
        title: "Alone",
        userFullName: "Maurice Madremon",
        cover: "/Book-9.webp",
        inventory: 1,
        categories: "ui/ux design",
        rating: 3,
        price: "89",
        userId: "29",
        description: "hello this is a description",
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date(),
    },
]

export const orders = [
    {
        id: 1,
        title: "Who Can You Trust?",
        author: "Rachel Botsman",
        cover: "/Book-5.webp",

        categories: "ui/ux design",
        rating: 4,
        price: 380,
        customerName: "a",
        customerAvatar: "/person-1.webp",
        status: "on way",
    },
    {
        id: 2,
        title: "The Good Guy",
        author: "Mark Maclalister",
        cover: "/Book-2.webp",

        categories: "ui/ux design",
        rating: 2,
        price: 123,
        customerName: "b",
        customerAvatar: "/person-2.webp",
        status: "delivered",
    },
    {
        id: 3,
        title: "Beautiful Day",
        author: "Kate Anthony",
        cover: "/Book-3.webp",
        categories: "ui/ux design",
        rating: 1,
        price: 111,
        customerName: "c",
        customerAvatar: "/person-3.webp",
        status: "delivered",
    },
    {
        id: 4,
        title: "Scavenger",
        author: "Darren Simpson",
        cover: "/Book-4.webp",
        categories: "ui/ux design",
        rating: 5,
        price: 334,
        customerName: "d",
        customerAvatar: "/person-4.webp",
        status: "canceled",
    },
    {
        id: 5,
        title: "The Great Symphony",
        author: "Nancy Brown",
        cover: "/Book-1.webp",
        categories: "ui/ux design",
        rating: 5,
        price: 10,
        customerName: "e",
        customerAvatar: "/person-5.webp",
        status: "on way",
    },
    {
        id: 6,
        title: "Ford Boyard Challenge",
        author: "Ford Boyard",
        cover: "/Book-7.webp",

        categories: "ui/ux design",
        rating: 2,
        price: 11,
        customerName: "f",
        customerAvatar: "/person-1.webp",
        status: "canceled",
    },
    {
        id: 7,
        title: "Lightfall",
        author: "MOhammed Raad",
        cover: "/Book-6.webp",

        categories: "ui/ux design",
        rating: 1,
        price: 34,
        customerName: "j",
        customerAvatar: "/person-5.webp",
        status: "delivered",
    },
    {
        id: 8,
        title: "Night Of The Walkers",
        author: "Maurice Broaddus",
        cover: "/Book-8.webp",

        categories: "ui/ux design",
        rating: 4,
        price: 99,
        customerName: "h",
        customerAvatar: "/person-4.webp",
        status: "canceled",
    },
    {
        id: 9,
        title: "Alone",
        author: "Maurice Madremon",
        cover: "/Book-9.jpg",
        categories: "ui/ux design",
        rating: 3,
        price: 89,
        customerName: "i",
        customerAvatar: "/person-2.webp",
        status: "delivered",
    },
]

export const customers = [
    {
        id: 1,
        email: "mraad6689@gmail.com",
        place: "Baghdad",
    },
    {
        id: 2,
        email: "example1@gmail.com",
        place: "New York",
    },
    {
        id: 3,
        email: "example2@gmail.com",
        place: "London",
    },
    {
        id: 4,
        email: "example3@gmail.com",
        place: "Tokyo",
    },
    {
        id: 5,
        email: "example4@gmail.com",
        place: "Sydney",
    },
    {
        id: 6,
        email: "example5@gmail.com",
        place: "Paris",
    },
    {
        id: 7,
        email: "example6@gmail.com",
        place: "Berlin",
    },
    {
        id: 8,
        email: "example7@gmail.com",
        place: "Toronto",
    },
    {
        id: 9,
        email: "example8@gmail.com",
        place: "Mumbai",
    },
    {
        id: 10,
        email: "example9@gmail.com",
        place: "Rio de Janeiro",
    },
]

export const socialMediaLinks = [
    {
        name: "Facebook",
        url: "https://www.facebook.com",
        Icon: Icons.Facebook,
    },
    {
        name: "Twitter",
        url: "https://www.twitter.com",
        Icon: Icons.Twitter,
    },
    {
        name: "Instagram",
        url: "https://www.instagram.com",
        Icon: Icons.Instagram,
    },
    {
        name: "Youtube",
        url: "https://www.youtube.com",
        Icon: Icons.Youtube,
    },
]

export const footerLinks = [
    {
        groupName: "QuickLinks",
        links: navLinks,
    },
    {
        groupName: "Social Media",
        links: socialMediaLinks.map(({ name, url }) => ({ name, url })),
    },
    {
        groupName: "Support",
        links: supportLinks,
    },
]

export type Testimonial = {
    name: string
    jobTitle: string
    avatar: string
    comment: string
}

export const testimonials: Testimonial[] = [
    {
        name: "JOHN ANDERSON",
        jobTitle: "University Student",
        avatar: "/person-1.webp",
        comment:
            "The university student experience has been greatly enriched by the presence of the bookstore library. Its abundant resources, serene environment, and expert guidance have significantly contributed to my academic success.",
    },
    {
        name: "MICHAEL SMITH",
        jobTitle: "Graduate Student",
        avatar: "/person-2.webp",
        comment:
            "As a dedicated graduate student, I've found the library to be a pivotal resource. Its cutting-edge tech resources, workshops, and a supportive atmosphere have propelled my research and career ambitions forward.",
    },

    {
        name: "ROBERT JOHNSON",
        jobTitle: "Book Lover",
        avatar: "/person-3.webp",
        comment:
            "For a true book lover, the library is a sanctuary of discovery. Within its shelves, I've embarked on captivating journeys through history and literature, thanks to its remarkable collection.",
    },
    {
        name: "DAVID MILLER",
        jobTitle: "Educator",
        avatar: "/person-4.webp",
        comment:
            "Educators like me rely on the library's extensive educational resources to create enriching learning experiences. The knowledgeable staff provide invaluable guidance, making it an essential asset for educators.",
    },
    {
        name: "STEVEN WILSON",
        jobTitle: "Ph.D. Candidate",
        avatar: "/person-5.webp",
        comment:
            "For a Ph.D. candidate, access to comprehensive research materials is paramount. The library has played a pivotal role in my academic journey, offering the resources I need to excel in my field.",
    },
    {
        name: "MICHAEL JONES",
        jobTitle: "Business Professional",
        avatar: "/person-6.webp",
        comment:
            "In the world of business, research is paramount, and the library simplifies this task. Its extensive resources and the assistance of its knowledgeable staff have proven invaluable to me as a business professional.",
    },
]

export const values = [
    {
        title: "Curiosity Unleashed",
        description:
            "Embrace endless exploration. We celebrate curiosity's role in unearthing new worlds and broadening horizons.",
        Icon: Icons.Book,
        color: "#FFB000",
    },
    {
        title: "Empathy in Stories",
        description:
            "Experience lives beyond your own. Through narratives, we cultivate empathy and connect diverse perspectives.",
        Icon: Icons.Lovely,
        color: "#4CAF50",
    },
    {
        title: "Curation Excellence",
        description:
            "Meticulously selected. Our collection reflects quality, diversity, and the art of meaningful curation.",
        Icon: Icons.Books,
        color: "#2979FF",
    },
    {
        title: "Community of Readers",
        description:
            "More than a store. We're a haven for like-minded readers, fostering connections, discussions, and shared passion.",
        Icon: Icons.People,
        color: "#E91E63",
    },
]

export const contactLinks = [
    {
        title: "Sales",
        description:
            "Explore new literary worlds with us. Reach out for inquiries, book recommendations, and purchases that kindle your imagination.",
        Icon: Icons.HandPills,
        color: "#4ADE80",
        linkName: "Contact sales",
        url: "contact-us",
    },
    {
        title: "Help & Support",
        description:
            "We're here to assist you. Contact us for any support you need, from order inquiries to navigating our offerings.",
        Icon: Icons.Headset,
        color: "#7B61FF",
        linkName: "Get support",
        url: "contact-us",
    },
    {
        title: "Media & Press",
        description:
            "Journalists, reviewers, and partners, let's connect. Reach out to explore collaboration opportunities and discover our latest narratives.",
        Icon: Icons.Airplay,
        color: "#0B63E5",
        linkName: "Get press kit",
        url: "contact-us",
    },
]
export type BooksType = typeof books

export const subscriptionPlans: Record<
    SubscriptionPlan["id"],
    SubscriptionPlan
> = {
    Basic: {
        id: "Basic",
        name: "BookWorm Free",
        description:
            "Start selling books for free with basic essentials for your store.",
        features: [
            "Create up to 1 store",
            "Create up to 10 products",
            "Free customer support.",
        ],
        analytics: false,
        stripePriceId: "",
        price: 0,
    },
    Standard: {
        id: "Standard",
        name: "Literary Pro",
        description:
            "Upgrade for more benefits to enhance your book-selling experience.",
        features: [
            "Create up to 2 store",
            "Create up to 30 books per store",
            "Free customer support.",
            "Free analytics.",
        ],
        analytics: true,
        stripePriceId: process.env.STRIPE_STD_MONTHLY_PRICE_ID!,
        price: 15,
    },
    Pro: {
        id: "Pro",
        name: "Book Maverick Plus",
        description:
            "Unlock premium advantages for a more advanced marketplace presence.",
        features: [
            "Create up to 3 stores",
            "Create up to 50 books per store",
            "Free customer support.",
            "Free analytics.",
        ],
        analytics: true,
        stripePriceId: process.env.STRIPE_PRO_MONTHLY_PRICE_ID!,
        price: 25,
    },
}

export const oauthProviders: OauthProvider[] = [
    { name: "Google", strategy: "oauth_google", icon: "Google" },
    { name: "Facebook", strategy: "oauth_facebook", icon: "Facebook" },
    { name: "Apple", strategy: "oauth_apple", icon: "Apple" },
]
