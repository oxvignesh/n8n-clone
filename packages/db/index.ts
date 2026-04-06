import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client";

export { NodeType } from "./generated/prisma/enums"
export type { Node, Connection } from "./generated/prisma/client"

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
});

export const prisma = new PrismaClient({ adapter });