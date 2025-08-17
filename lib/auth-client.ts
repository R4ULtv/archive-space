import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: `${process.env.NEXT_PUBLIC_AUTH_API_URL}`,
  credentials: true,
});

export const { signIn, signOut, signUp, useSession, getSession } = authClient;
