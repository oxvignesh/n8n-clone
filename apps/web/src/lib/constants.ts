import { treaty } from '@elysiajs/eden'
import type { App as ServerApp } from "@workspace/server";

const SERVER_URL = import.meta.env.VITE_SERVER_URL ?? "http://localhost:3000"

export const server = treaty<ServerApp>(SERVER_URL)