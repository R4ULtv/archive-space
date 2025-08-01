"use client";

import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/auth-client";
import { LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SignOut() {
  const router = useRouter();

  return (
    <Button
      size="sm"
      variant="ghost"
      className="size-8"
      onClick={() =>
        signOut({
          fetchOptions: {
            onSuccess: () => {
              router.push("/auth/sign-in");
            },
          },
        })
      }
    >
      <LogOutIcon />
    </Button>
  );
}
