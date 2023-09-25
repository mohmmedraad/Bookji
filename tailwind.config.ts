import type { Config } from "tailwindcss"

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            screens: {
                xs: "480px",
            },
            container: {
                center: true,
                padding: {
                    DEFAULT: "1rem",
                    sm: "1.5rem",
                    lg: "2.5rem",
                },
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
            },
            colors: {
                primary: "hsla(var(--primary))",
                primaryDark: "hsla(var(--primaryDark))",
                secondary: "hsla(var(--secondary))",
                accent: "hsla(var(--accent))",
                accentForeground: "hsla(var(--accent-foreground))",
                background: "hsl(var(--background))",
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
}
export default config
