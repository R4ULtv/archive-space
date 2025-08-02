"use client";

import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/auth-client";
import { LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignOut() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    setIsLoading(true);

    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/auth/sign-in");
        },
        onError: () => {
          setIsLoading(false);
        },
      },
    });
  };

  return (
    <Button
      size="sm"
      variant="ghost"
      className="size-8"
      onClick={handleSignOut}
      disabled={isLoading}
    >
      {isLoading ? (
        <svg
          className="size-4 -rotate-90 text-foreground ml-auto animate-spin"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="3"
          />
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="3"
            strokeDasharray="62.83"
            strokeDashoffset="50"
            strokeLinecap="round"
            className="transition-all duration-300 ease-in"
          />
        </svg>
      ) : (
        <LogOutIcon />
      )}
    </Button>
  );
}
