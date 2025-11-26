"use client";

import Link from "next/link";
import { SignedIn, SignedOut, useClerk, UserButton } from "@clerk/nextjs";
import { Button } from "../ui/button";
import { useAuth } from "@clerk/nextjs";

export default function Navbar() {
  const { openSignIn } = useClerk();
  const { isSignedIn, isLoaded } = useAuth();

  return (
    <header className="container mx-auto w-full border-b py-4 px-6 flex justify-between items-center bg-white">
      <Link href="/" className="text-xl font-bold">
        pixelForge
      </Link>

      <nav className="flex gap-6 items-center text-sm font-medium">
        <Link href="/explore">Explore</Link>
        <Link href="/pricing">Pricing</Link>
        {/* the generate and dashboard show only when user is login */}
        {isSignedIn && (
          <>
            <Link href="/generate">Generate</Link>
            <Link href="/dashboard">Dashboard</Link>
          </>
        )}

        {isLoaded ? (
          <>
            <SignedOut>
              <Button
                onClick={() =>
                  openSignIn({
                    oauthFlow: "popup",
                    fallbackRedirectUrl: "/generate",
                  })
                }
                className="px-4 py-2 bg-black text-white rounded-md"
              >
                Login
              </Button>
            </SignedOut>

            <SignedIn>
              <UserButton />
            </SignedIn>
          </>
        ) : (
          <p>loading...</p>
        )}
      </nav>
    </header>
  );
}
