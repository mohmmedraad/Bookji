# [Bookji](https://github.com/mohmmedraad/Bookji)

Bookji is an open-source e-commerce platform built with Next.js, TypeScript, and TailwindCSS. Sell and buy books hassle-free with secure payments via Stripe.

[![Bookji](./public/bookji_screenshot.png)](https://bookji.vercel.app/)

> **Warning**
> This project is still in development and is not ready for production use.
>
> It uses new technologies (drizzle ORM) which are subject to change and may break your application.

## Tech Stack

-   **Framework:** [Next.js](https://nextjs.org)
-   **Styling:** [Tailwind CSS](https://tailwindcss.com)
-   **User Management:** [Clerk](https://clerk.com)
-   **ORM:** [Drizzle ORM](https://orm.drizzle.team)
-   **UI Components:** [shadcn/ui](https://ui.shadcn.com)
-   **File Uploads:** [uploadthing](https://uploadthing.com)
-   **Payments infrastructure:** [Stripe](https://stripe.com)
-   **Validation schema:** [Valibot](https://valibot.dev/)

## Running Locally

1. Clone the repository

    ```bash
    git clone https://github.com/mohmmedraad/Bookji.git
    ```

2. Install dependencies using pnpm

    ```bash
    npm install
    ```

3. Copy the `.env.example` to `.env` and update the variables.

    ```bash
    cp .env.example .env
    ```

4. Start the development server

    ```bash
    npm run dev
    ```

5. Push the database schema

    ```bash
    npm run db:push
    ```

6. Seed the database

    ```bash
    npm run db:seed
    ```

7. Start the Stripe webhook listener

    ```bash
    npm run stripe:listen
    ```
