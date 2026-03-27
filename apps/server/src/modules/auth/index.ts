import { Elysia } from "elysia"
import { jwt } from "@elysiajs/jwt"

import { Auth } from "./service"
import { AuthModel } from "./model"
import { jwtSetup, isAuthenticated } from "../../middleware/auth"

export const app = new Elysia({ prefix: "/api/auth" })
  .use(jwtSetup)
  .post(
    "/sign-up",
    async ({ body, status }) => {
      try {
        const userId = await Auth.signUp(body.email, body.password)

        return {
          id: userId,
        }
      } catch (e: any) {
        if (e.code === "P2002") {
          return status(409, {
            message: "Email already taken",
          })
        }
        return status(400, {
          message: "Failed while signing up",
        })
      }
    },
    {
      body: AuthModel.signUp,
      response: {
        200: AuthModel.signUpSuccess,
        400: AuthModel.signUpFailed,
        409: AuthModel.signUpConflict,
      },
    }
  )
  .post(
    "/sign-in",
    async ({ jwt, body, status, cookie: { auth } }) => {
      const { isSignedIn, userId } = await Auth.signIn(
        body.email,
        body.password
      )
      if (isSignedIn) {
        const token = await jwt.sign({ userId })
        auth.set({
          value: token,
          httpOnly: true,
          maxAge: 7 * 86400,
        })
        return {
          message: "Signed in successfully",
        }
      } else {
        return status(403, {
          message: "Incorrect credentials",
        })
      }
    },
    {
      body: AuthModel.signIn,
      response: {
        200: AuthModel.signInSuccess,
        403: AuthModel.signInFailed,
      },
    }
  )
  .use(isAuthenticated)
  .get(
    "/me",
    async ({ userId, status }) => {
      const user = await Auth.getUserDetails(userId)

      if (!user) {
        return status(400, {
          message: "Error while fetching user details",
        })
      }

      return user
    },
    {
      response: {
        200: AuthModel.getUserDetails,
        400: AuthModel.getUserDetailsFailed,
      },
    }
  )
  .post(
    "/sign-out",
    ({ cookie: { auth } }) => {
      auth.remove()
      return { message: "Signed out successfully" }
    },
    {
      response: {
        200: AuthModel.signOut,
      },
    }
  )