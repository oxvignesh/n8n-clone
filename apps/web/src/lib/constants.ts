import { treaty } from "@elysiajs/eden"
import type { App as ServerApp } from "@workspace/server"

const SERVER_URL = import.meta.env.VITE_SERVER_URL ?? "http://localhost:3000"

export const serverClient = treaty<ServerApp>(SERVER_URL, {
  fetch: { credentials: "include" },
})

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 5,
  MAX_PAGE_SIZE: 100,
  MIN_PAGE_SIZE: 1,
}
