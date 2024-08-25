import { Button } from "@headlessui/react";
import { redirect } from "next/navigation";
import { signIn, auth } from "@/lib/auth";

import { StarsBackground } from "@/components/layout/stars-background";
import { ShootingStars } from "@/components/layout/shooting-stars";

export const runtime = "edge"

export default async function Login({ searchParams }) {
  const session = await auth();

  if (session) {
    redirect("/");
  }

  const handleLogin = async () => {
    "use server";
    await signIn("github", { redirectTo: "/" });
  };

  return (
    <>
      <div
        className="flex flex-col items-center justify-center relative z-10"
        style={{ minHeight: "calc(100vh - 64px - 64px)" }}
      >
        <h1 className="text-5xl sm:text-7xl font-black text-center relative z-20 bg-clip-text text-transparent bg-gradient-to-b from-zinc-900 to-zinc-500 dark:from-zinc-200 dark:to-zinc-500">
          Archive Space
        </h1>

        <form
          action={handleLogin}
          className="mt-6 flex flex-col items-center justify-center"
        >
          {searchParams.error && (
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">
              Something went wrong.
            </p>
          )}
          {searchParams.error &&
            searchParams.error === "RetrieveAccessEmails" && (
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">
                Failed to retrieve access emails.
              </p>
            )}
          {searchParams.error && searchParams.error === "NotAuthorized" && (
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">
              You are not authorized to access this website.
            </p>
          )}

          <Button
            type="submit"
            className="bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 px-3 py-1.5 rounded-md flex gap-2 items-center hover:bg-zinc-300/75 dark:hover:bg-zinc-700/75 duration-150"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 496 512"
              className="size-5"
            >
              <path
                fill="currentColor"
                d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3 .3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5 .3-6.2 2.3zm44.2-1.7c-2.9 .7-4.9 2.6-4.6 4.9 .3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3 .7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3 .3 2.9 2.3 3.9 1.6 1 3.6 .7 4.3-.7 .7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3 .7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3 .7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"
              />
            </svg>
            <span className="font-medium">Sign in with GitHub</span>
          </Button>
        </form>
        <div className="absolute bottom-0">
          <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-xl text-center text-balance">
            This website is a private archive space for{" "}
            <span className="font-semibold">specific users</span>. Make sure you
            have the <span className="font-semibold">permission</span> to access
            this website with your GitHub account. If you don't already have an
            account, <span className="font-semibold">you can't create one</span>
            .
          </p>

          <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-xl text-center text-balance mt-3">
            This website is <span className="font-semibold">open-source</span>.
            You can find the code on{" "}
            <a
              href="https://github.com/r4ultv/archive-space"
              className="font-semibold"
            >
              GitHub
            </a>
            . If you need more information you can check out my{" "}
            <a
              href="https://www.raulcarini.dev/blog/archive-space"
              className="font-semibold"
            >
              blog post
            </a>
            .
          </p>

          <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-xl text-center text-balance mt-3">
            Build for You by{" "}
            <a href="https://www.raulcarini.dev" className="font-semibold">
              Raul Carini
            </a>
          </p>
        </div>
      </div>

      <ShootingStars />
      <StarsBackground />
    </>
  );
}
