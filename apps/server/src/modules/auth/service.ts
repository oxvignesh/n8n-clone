import { prisma } from "@workspace/db";

export abstract class Auth {
  static async signUp(email: string, password: string): Promise<string> {
    const user = await prisma.user.create({
      data: {
        email,
        password: await Bun.password.hash(password),
      },
    });

    return user.id.toString();
  }

  static async signIn(
    email: string,
    password: string,
  ): Promise<{ isSignedIn: boolean; userId: string }> {
    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      return { isSignedIn: false, userId: "" };
    }

    if (!(await Bun.password.verify(password, user.password))) {
      return { isSignedIn: false, userId: "" };
    }

    return { isSignedIn: true, userId: user.id.toString() };
  }

  static async getUserDetails(userId: string) {
    const user = await prisma.user.findFirst({ where: { id: userId } });

    if (!user) {
      return null;
    }

    return {
      user: {
        id: user.id,
        email: user.email,
      },
    };
  }
}
