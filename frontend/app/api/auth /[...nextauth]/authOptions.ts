import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import userLogin from "@/app/libs/userLogin";

export const authOptions: AuthOptions = {
  debug: false, 
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "email@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials.password) {
          throw new Error("Please provide both email and password.");
        }

        try {
          const user = await userLogin(credentials.email, credentials.password);

          if (!user) {
            throw new Error("Invalid email or password.");
          }

          return user;
        } catch (error: any) {
          throw new Error(error.message || "Authentication failed.");
        }
      },
    }),
  ],
    pages: {
      signIn: "/auth/signin",
      signOut: "/auth/signout"
    },
    session: {strategy: "jwt"},
    callbacks: {
      async jwt({token, user}) {
        return {...token, ...user}
      },
      async session({session, token, user}) {
        session.user = token as any
        return session
      }
    }
};