import { Elysia } from "elysia"
import { serve } from "inngest/bun"
import { functions, inngest } from "../../inngest/client"

const handler = serve({
  client: inngest,
  functions,
})

export const app = new Elysia().all("/api/inngest", ({ request }) =>
  handler(request)
)
//run the inngest dev server
//npx --ignore-scripts=false inngest-cli@latest dev -u http://localhost:3000/api/inngest