import { jwt } from "@elysiajs/jwt"

export const jwtSetup = jwt({
    name: "jwt",
    secret: process.env.JWT_SECRET!,
})

export const isAuthenticated = (app: any) => app
    .use(jwtSetup)
    .derive(async ({ cookie: { auth }, jwt, error }: any): Promise<{ userId: string }> => {
        if (!auth) {
            throw error(401, "Unauthorized")
        }

        const decoded = await jwt.verify(auth.value as string)

        if (!decoded || !decoded.userId) {
            throw error(401, "Unauthorized")
        }

        return {
            userId: decoded.userId as string,
        }
    })