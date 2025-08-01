import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { getSession } from "@/lib/auth-client";

export async function middleware(request: NextRequest) {
  const session = await getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });

  if (!session) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
}

export const config = {
  runtime: "nodejs",
  matcher: ["/"],
};
