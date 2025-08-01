import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: "https://auth.raulcarini.dev",
  credentials: true,
});

export const { signIn, signOut, signUp, useSession, getSession } = authClient;
