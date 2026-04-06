import { jwt } from "@elysiajs/jwt"
import { Elysia } from "elysia"

export const jwtSetup = jwt({
  name: "jwt",
  secret: process.env.JWT_SECRET!,
})

export const isAuthenticated = new Elysia()
  .use(jwtSetup)
  .derive({ as: "global" }, async ({ cookie: { auth }, jwt, status }) => {
    if (!auth) {
      throw status(401, "Unauthorized")
    }

    const decoded = await jwt.verify(auth.value as string)

    if (!decoded || !decoded.userId) {
      throw status(401, "Unauthorized")
    }

    return {
      userId: decoded.userId as string,
    }
  })