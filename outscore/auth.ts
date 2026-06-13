import "dotenv/config";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";

import { prisma } from "@/lib/prisma";

console.log({
  GOOGLE_CLIENT_ID: !!process.env.GOOGLE_CLIENT_ID,
  GOOGLE_SECRET_ID: !!process.env.GOOGLE_SECRET_ID,
  BETTER_AUTH_SECRET: !!process.env.BETTER_AUTH_SECRET,
  DATABASE_URL: !!process.env.DATABASE_URL,
});
export const {
  handlers,
  signIn,
  signOut,
  auth,
} = NextAuth({
  debug: true,
  secret: process.env.BETTER_AUTH_SECRET,
  adapter: PrismaAdapter(prisma),

  

  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_SECRET_ID!,
    }),
  ],
});
