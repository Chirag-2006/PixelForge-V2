"use client";

import Link from "next/link";
import { SignedIn, SignedOut, useClerk, UserButton } from "@clerk/nextjs";
import { Button } from "../ui/button";
import { useAuth } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Skeleton } from "../ui/skeleton";

export default function Navbar() {
  const { openSignIn } = useClerk();
  const { isSignedIn, isLoaded } = useAuth();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Add shadow when scrolling
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const linkClass = (path) =>
    `relative inline-block w-fit transition-all hover:text-black ${
      pathname === path ? "text-black font-semibold" : "text-gray-600"
    }
    after:absolute after:left-0 after:-bottom-1 after:w-full after:h-[2px]
    after:bg-black after:scale-x-0 after:transition after:duration-300
    hover:after:scale-x-100
  `;

  if (!isLoaded && !isSignedIn) {
    return (
      <header className="w-full bg-white/40 backdrop-blur-md border-b border-gray-200/40 sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center px-6 py-4">
          {/* Logo */}
          <Skeleton className="h-7 w-32 rounded-md" />

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <Skeleton className="h-5 w-20" /> {/* Explore */}
            <Skeleton className="h-5 w-20" /> {/* Pricing */}
            <Skeleton className="h-9 w-24 rounded-md" /> {/* Login */}
          </div>

          {/* Mobile Hamburger */}
          <Skeleton className="h-6 w-6 rounded-md md:hidden" />
        </div>
      </header>
    );
  }


  return (
    <header
      className={`
      w-full backdrop-blur-md border-b border-gray-200/40
      sticky top-0 z-50 transition-all 
      ${scrolled ? "shadow-md bg-white/70" : "bg-white/40"}
    `}
    >
      <div className="container mx-auto flex justify-between items-center px-6 py-4">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-extrabold bg-linear-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent"
        >
          pixelForge
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-8 text-sm">
          <Link className={linkClass("/explore")} href="/explore">
            Explore
          </Link>

          <Link className={linkClass("/pricing")} href="/pricing">
            Pricing
          </Link>

          {isSignedIn && (
            <>
              <Link className={linkClass("/generate")} href="/generate">
                Generate
              </Link>
              <Link className={linkClass("/dashboard")} href="/dashboard">
                Dashboard
              </Link>
            </>
          )}

          {/* Auth UI */}
          {isLoaded && (
            <>
              <SignedOut>
                <Button
                  onClick={() =>
                    openSignIn({
                      oauthFlow: "popup",
                      fallbackRedirectUrl: "/generate",
                    })
                  }
                  className="
                    px-5 py-2 rounded-lg bg-black text-white 
                    hover:bg-gray-900 transition-all shadow-sm
                  "
                >
                  Login
                </Button>
              </SignedOut>

              <SignedIn>
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox:
                        "w-10 h-10 rounded-full ring-2 ring-purple-500",
                    },
                  }}
                />
              </SignedIn>
            </>
          )}
        </nav>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden flex text-gray-700 cursor-pointer"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileOpen && (
        <div className="md:hidden bg-white/70 backdrop-blur-lg p-6 border-t flex flex-col gap-6 text-sm">
          <Link
            className={linkClass("/explore")}
            href="/explore"
            onClick={(e) => setMobileOpen(false)}
          >
            Explore
          </Link>

          <Link
            className={linkClass("/pricing")}
            href="/pricing"
            onClick={(e) => setMobileOpen(false)}
          >
            Pricing
          </Link>

          {isSignedIn && (
            <>
              <Link
                className={linkClass("/generate")}
                href="/generate"
                onClick={(e) => setMobileOpen(false)}
              >
                Generate
              </Link>
              <Link
                className={linkClass("/dashboard")}
                href="/dashboard"
                onClick={(e) => setMobileOpen(false)}
              >
                Dashboard
              </Link>
            </>
          )}

          {isLoaded && (
            <>
              <SignedOut>
                <Button
                  onClick={() =>
                    openSignIn({
                      oauthFlow: "popup",
                      fallbackRedirectUrl: "/generate",
                    })
                  }
                  className="w-full bg-black text-white py-2 rounded-lg shadow"
                >
                  Login
                </Button>
              </SignedOut>

              <SignedIn>
                <UserButton />
              </SignedIn>
            </>
          )}
        </div>
      )}
    </header>
  );
}
