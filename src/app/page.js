"use client";
import { useEffect } from "react";
import { useClerk } from "@clerk/nextjs";

export default function Home() {
  const { openSignIn } = useClerk();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("auth") === "login") {
      openSignIn({
        oauthFlow: "popup",
        fallbackRedirectUrl: "/generate",
      });
    }
  }, [openSignIn]);

  return <div className="p-10 text-3xl">Welcome to pixelForge</div>;
}
