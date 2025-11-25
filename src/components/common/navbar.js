"use client";

import Link from "next/link";
import { UserButton, SignedIn, SignedOut } from "@clerk/nextjs";

export default function Navbar() {
  return (
    <header className="container mx-auto w-full border-b py-4 px-6 flex justify-between items-center bg-white">
      <Link href="/" className="text-xl font-bold">pixelForge</Link>

      <nav className="flex gap-6 items-center text-sm font-medium">
        <Link href="/explore">Explore</Link>
        <Link href="/generate">Generate</Link>
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/pricing">Pricing</Link>

        <SignedOut>
          <Link href="/sign-in" onClick={() => openSignIn()}>Login</Link>
        </SignedOut>

        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
      </nav>
    </header>
  );
}
