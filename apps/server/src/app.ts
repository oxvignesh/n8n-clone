import { Elysia } from "elysia"
import { cors } from "@elysiajs/cors"
import { app as authApp } from "./modules/auth"
import { app as workflowApp } from "./modules/workflows"
import { app as inngestApp } from "./modules/inngest"

export const app = new Elysia()
    .use(cors())
    .use(inngestApp)
    .use(authApp)
    .use(workflowApp)

export type App = typeof app