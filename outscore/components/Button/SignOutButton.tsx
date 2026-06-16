"use client";

import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600 transition"
    >
      Sign Out
    </button>
  );
}