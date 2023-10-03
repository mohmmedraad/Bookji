import { Icons } from "@/components/Icons"

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
        title: "Who Can You Trust?",
        author: "Rachel Botsman",
        cover: "/Book-5.webp",
    },
    {
        title: "The Good Guy",
        author: "Mark Maclalister",
        cover: "/Book-2.webp",
    },
    {
        title: "Beautiful Day",
        author: "Kate Anthony",
        cover: "/Book-3.webp",
    },
    {
        title: "Scavenger",
        author: "Darren Simpson",
        cover: "/Book-4.webp",
    },
    {
        title: "The Great Symphony",
        author: "Nancy Brown",
        cover: "/Book-1.webp",
    },
    {
        title: "Ford Boyard Challenge",
        author: "Ford Boyard",
        cover: "/Book-7.webp",
    },
    {
        title: "Lightfall",
        author: "MOhammed Raad",
        cover: "/Book-6.webp",
    },
    {
        title: "Night Of The Walkers",
        author: "Maurice Broaddus",
        cover: "/Book-8.webp",
    },
    {
        title: "Alone",
        author: "Maurice Madremon",
        cover: "/Book-9.jpg",
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
