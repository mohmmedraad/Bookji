import { nextui } from "@nextui-org/react"
import type { Config } from "tailwindcss"

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
        "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
        "./node_modules/@tremor/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            transitionDuration: {
                DEFAULT: "250ms",
            },
            gridTemplateColumns: {
                test: "2fr 1fr 1fr",
                profile: "160px 1fr",
                addBook: "176px 1fr",
                bookPage: "1fr 1fr 170px",
                updateStore: "auto 1fr",
                analytics: "1fr auto",
            },
            gridTemplateRows: {
                cart: "1fr auto",
            },
            screens: {
                xs: "480px",
            },
            boxShadow: {
                custom: "-12.09178px 8.06119px 17.73461px 0px rgba(0, 0, 0, 0.15)",
            },
            border: {
                visual: "red 1px solid",
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic":
                    "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
                "gradient-boxGradient":
                    "linear-gradient(160deg, #F6F6FE -9.68%, rgba(255, 255, 255, 0.00) 95.61%)",
                "gradient-nav":
                    "linear-gradient(180deg, #FFF -9.26%, rgba(255, 255, 255, 0.00) 84.26%)",
            },
            colors: {
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },

                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                },
                primaryDark: "hsla(var(--primaryDark))",

                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },

                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },

                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                success: {
                    DEFAULT: "hsl(var(--success))",
                    foreground: "hsl(var(--success-foreground))",
                },
                input: "hsl(var(--input))",
                border: "hsl(var(--border))",
                ring: "hsl(var(--ring))",
                radius: "hsl(var(--radius))",
            },
        },
    },
    darkMode: "class",
    plugins: [require("tailwindcss-animate"), nextui()],
}
export default config
