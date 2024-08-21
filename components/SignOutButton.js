"use client";
import { Button } from "@headlessui/react";
import { ArrowRightEndOnRectangleIcon } from "@heroicons/react/16/solid";
import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return (
    <Button
      onClick={() => signOut()}
      className="cursor-pointer group duration-150 text-gray-800 dark:text-gray-200 p-2"
    >
      <ArrowRightEndOnRectangleIcon className="size-4 group-hover:scale-110 duration-150" />
    </Button>
  );
}
