"use client";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/?auth=login");
    }
  }, [isSignedIn, isLoaded, router]);

  if (!isSignedIn) {
    return <p>Redirecting...</p>;
  }

  return <div className="p-6">Dashboard</div>;
}
