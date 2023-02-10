# scheduling-app

This sample repo will show you how to easily create a scheduling app using the Nylas Scheduler.

The codebase is part of a blog post and livestream showing [How to Make a Calendar Scheduler in 3 Steps](https://www.nylas.com/blog/how-to-make-a-calendar-scheduler/). Take a look at the blog post for further details.

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

### Gather environment variables

You'll need the following values added to your environment:

```text
NEXT_PUBLIC_SCHEDULE_APP_SUPABASE_URL = ""
NEXT_PUBLIC_SCHEDULE_APP_SUPABASE_ANON_KEY = ""
NEXT_PUBLIC_NYLAS_ACCESS_TOKEN = ""
```
## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


## Code
The starting point for the frontend can be found [here](https://github.com/nylas-samples/scheduling-app/blob/main/pages/index.tsx)

We store the scheduler information on supabase with a table called `service` that includes the following details:
- `user_id: int8` defaulted to 1 for demo
- `service: string`
- `nylas_scheduler_url:string`

## Learn more

Visit our [Nylas documentation](https://developer.nylas.com/) to learn more.