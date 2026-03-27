import { t } from "elysia";

export namespace AuthModel {
  export const signUp = t.Object({
    email: t.String(),
    password: t.String(),
  });
  export type signUp = typeof signUp.static;

  export const signUpSuccess = t.Object({
    id: t.String(),
  });
  export type signUpSuccess = typeof signUpSuccess.static;

  export const signUpFailed = t.Object({
    message: t.Literal("Failed while signing up"),
  });
  export type signUpFailed = typeof signUpFailed.static;

  export const signUpConflict = t.Object({
    message: t.Literal("Email already taken"),
  });
  export type signUpConflict = typeof signUpConflict.static;

  export const signIn = t.Object({
    email: t.String(),
    password: t.String(),
  });
  export type signIn = typeof signIn.static;

  export const signInSuccess = t.Object({
    message: t.Literal("Signed in successfully"),
  });
  export type signInSuccess = typeof signInSuccess.static;

  export const signInFailed = t.Object({
    message: t.Literal("Incorrect credentials"),
  });
  export type signInFailed = typeof signInFailed.static;

  export const signOut = t.Object({
    message: t.Literal("Signed out successfully"),
  });
  export type signOut = typeof signOut.static;

  export const getUserDetails = t.Object({
    user: t.Object({
      id: t.String(),
      email: t.String()
    }),
  });
  export type getUserDetails = typeof getUserDetails.static;

  export const getUserDetailsFailed = t.Object({
    message: t.Literal("Error while fetching user details"),
  });
  export type getUserDetailsFailed = typeof getUserDetailsFailed.static;
}
