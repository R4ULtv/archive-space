import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { get } from "@vercel/edge-config";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [GitHub],
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    async signIn({ profile }) {
      const emails = await get("authAccessEmails");
      if (emails.includes(profile.email)) {
        return true;
      }
      return false;
    },
  },
});
