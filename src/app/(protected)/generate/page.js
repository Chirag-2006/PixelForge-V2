"use client";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import GenerateClient from "./generate-client";

export default function GeneratePage() {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();

  console.log("isSignedIn", isSignedIn);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/?auth=login");
    }
  }, [isSignedIn, isLoaded, router]);

  if (!isSignedIn) {
    return <p>Redirecting...</p>;
  }

  return (
    <>
      <div className="p-10 text-2xl">Generate Page</div>
      <GenerateClient />
    </>
  );
}
