"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getPublicUserProfile } from "@/app/api/user/userActions";

// ⭐ ShadCN UI
import { Skeleton } from "@/components/ui/skeleton";
import UserInfo from "@/components/UserInfo";

export default function UserProfilePage() {
  const params = useParams();
  const userId = params.username;

  const [profile, setProfile] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch profile
  useEffect(() => {
    if (!userId) return;

    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await getPublicUserProfile(userId);

        if (data.error) {
          setError("User not found");
          return;
        }

        setProfile(data.user);
        setImages(data.images || []);
      } catch {
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  /* ---------------------- LOADING UI ---------------------- */
  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <Skeleton className="h-32 w-full rounded-xl mb-6" />
        <div className="grid grid-cols-3 gap-4">
          {Array(9)
            .fill()
            .map((_, i) => (
              <Skeleton key={i} className="h-40 rounded-xl" />
            ))}
        </div>
      </div>
    );
  }

  /* ---------------------- ERROR ---------------------- */
  if (error) {
    return (
      <div className="h-[70vh] flex flex-col justify-center text-center">
        <h1 className="text-3xl font-bold text-gray-500">{error}</h1>
        <Link href="/explore" className="text-blue-600 underline mt-4">
          ← Back to Explore
        </Link>
      </div>
    );
  }

  /* ---------------------- MAIN PROFILE UI ---------------------- */
  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <UserInfo profile={profile} imagesCount={images.length} />

      {/* Divider */}
      <div className="border-t my-8"></div>

      {/* ⭐ INSTAGRAM STYLE IMAGE GRID ⭐ */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
        {images.map((img) => {
          const shortPrompt =
            img.prompt.length > 50
              ? img.prompt.slice(0, 50) + "..."
              : img.prompt;

          const publishedDate = img.updatedAt
            ? new Date(img.updatedAt).toLocaleDateString()
            : "Unknown";

          return (
            <div
              key={img.id}
              // href={`/u/${images.ownerId}/#`}
              className="
                group block aspect-9/16 md:aspect-9/12 relative overflow-hidden
                rounded-xl border border-gray-900/30
                transition-all duration-500
                hover:border-purple-400/50
                hover:shadow-[0_0_25px_rgba(139,92,246,0.35)]
              "
            >
              {/* Big Instagram-like Image */}
              <Image
                src={img.url}
                alt={img.prompt}
                width={800}
                height={800}
                className="
                  w-full h-full object-cover
                  transition-all duration-700
                  group-hover:scale-110
                "
              />

              {/* Overlay */}
              <div
                className="
                absolute inset-0 bg-linear-to-t
                from-black/80 via-black/40 to-transparent
                opacity-0 group-hover:opacity-100
                transition-all duration-500
                "
              />

              {/* Prompt + Date */}
              <div
                className="
                absolute bottom-0 left-0 right-0 p-4
                opacity-0 translate-y-6
                group-hover:opacity-100 group-hover:translate-y-0
                transition-all duration-500
                "
              >
                <p className="text-white/90 text-xs mb-1">{shortPrompt}</p>

                <p className="text-white/60 text-[10px]">
                  Published: {publishedDate}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
