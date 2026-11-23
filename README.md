# Fitness

Arabic (RTL, dark theme) web app for tracking workouts and body progress.

## Features

- Weekly workout plan per user (Arabic week, Saturday to Friday), with sets, reps, form notes, YouTube links and muscle images
- Workout log: mark each exercise as done per day
- Weight tracking with charts
- InBody result image uploads
- Email and password sign-in with user and admin roles

## Tech stack

Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, shadcn/ui, Prisma, Neon Postgres, NextAuth (Auth.js v5), Recharts.

## Run locally

```bash
npm install
```

Create a `.env` file with your Neon connection string and an auth secret:

```bash
DATABASE_URL="your-neon-postgres-connection-string"
AUTH_SECRET="a-long-random-string"
```

Then create the tables, seed the default data and start the dev server:

```bash
npx prisma db push
npm run seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The seed script creates an admin user. Set `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `.env` before seeding to choose your own credentials.
