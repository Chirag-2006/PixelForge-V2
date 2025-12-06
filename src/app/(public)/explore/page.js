"use client";

import { getPublicImages } from "@/app/api/images/imageActions";
import { getPublicUserProfile } from "@/app/api/user/userActions";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ExplorePage() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getPublicImages();
        // Fetch simple user info (just username + avatar)
        const imagesWithUser = await Promise.all(
          data.map(async (img) => {
            try {
              const userData = await getPublicUserProfile(img.ownerId);
              return {
                ...img,
                user: {
                  username: userData?.user.username || img.ownerId?.slice(-8),
                  imageUrl: userData?.user?.imageUrl,
                },
              };
            } catch {
              return {
                ...img,
                user: {
                  username: img.ownerId?.slice(-8),
                  imageUrl: null,
                },
              };
            }
          })
        );

        imagesWithUser.sort(
          (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
        );

        setImages(imagesWithUser);
      } catch {
        setImages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  /* ------------------------- SKELETON --------------------------- */
  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-8">
        {/* Page Title Skeleton */}
        <div className="flex justify-center">
          <Skeleton className="h-10 w-48 rounded-lg" />
        </div>

        {/* Subtitle Skeleton */}
        <div className="flex justify-center">
          <Skeleton className="h-4 w-64 rounded-lg" />
        </div>

        {/* Image Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 9 }).map((_, i) => (
            <Skeleton key={i} className="aspect-4/5 w-full rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  /* ----------------------- NO IMAGES ---------------------------- */
  if (images.length === 0) {
    return (
      <div className="container mx-auto p-6 text-center">
        <h1 className="text-4xl font-bold mb-4">Explore</h1>
        <p className="text-gray-400 text-lg">No public images yet.</p>
      </div>
    );
  }

  /* ⭐ Modern Time Ago function */
  function timeAgo(utcString) {
    const past = new Date(utcString);

    // Convert UTC → Indian time
    const indiaTime = new Date(
      past.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
    );

    const now = new Date(
      new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
    );

    let diff = Math.floor((now - indiaTime) / 1000); // seconds

    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;

    return indiaTime.toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
    });
  }

  /* ----------------------- MAIN EXPLORE PAGE ---------------------------- */
  return (
    <div className="container mx-auto p-6">
      {/* Heading */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold bg-linear-to-r from-white via-gray-300 to-gray-500 bg-clip-text text-transparent">
          Explore Library
        </h1>
        <p className="text-gray-400 mt-2 tracking-wide">
          A collection of stunning AI images published by the community
        </p>
      </div>

      {/* Larger Images Grid (Library style) */}
      <div
        className="
        grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 
        gap-2 md:gap-8
      "
      >
        {images.map((img) => {
          const user = img.user;
          return (
            <Link
              key={img.id}
              href={`/u/${img.ownerId}`}
              className="
    group relative block aspect-9/14 md:aspect-4/5 overflow-hidden
    rounded-2xl border border-gray-800/40
    hover:border-purple-400/50
    hover:shadow-[0_0_40px_rgba(139,92,246,0.25)]
    transition-all duration-500
  "
            >
              {/* IMAGE */}
              <Image
                src={img.url}
                alt={"Image by " + img.user.username}
                width={800}
                height={1000}
                className="
      w-full h-full object-cover 
      transition-transform duration-700
      group-hover:scale-[1.05]
    "
              />

              {/* ⭐ ALWAYS SHOW — TIME BADGE */}
              <div className="absolute top-4 right-4 z-20">
                <span
                  className="
        px-3 py-1 text-[11px] font-medium
        rounded-full 
        bg-white/15 text-white 
        backdrop-blur-md border border-white/20
        shadow-md
      "
                >
                  • {timeAgo(img.updatedAt)}
                </span>
              </div>

              {/* DARK OVERLAY ON HOVER */}
              <div
                className="
      absolute inset-0
      bg-linear-to-t from-black/85 via-black/40 to-transparent
      opacity-0 group-hover:opacity-100 
      transition-all duration-500
    "
              ></div>

              {/* ⭐ HOVER INFO (BOTTOM CARD) */}
              <div
                className="
      absolute bottom-0 left-0 right-0
      p-4 flex flex-col gap-2
      translate-y-10 group-hover:translate-y-0
      opacity-0 group-hover:opacity-100
      transition-all duration-500
      z-30
    "
              >
                {/* AVATAR + USERNAME */}
                <div className="flex items-center gap-3">
                  {user.imageUrl ? (
                    <Image
                      src={user.imageUrl}
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-white/40"
                      alt="user"
                    />
                  ) : (
                    <div
                      className="
            w-10 h-10 rounded-full 
            bg-linear-to-br from-purple-500 to-blue-600 
            flex items-center justify-center
            text-white font-bold
            ring-2 ring-white/40
          "
                    >
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                  )}

                  <p className="text-white font-semibold text-sm">
                    @{user.username}
                  </p>
                </div>

                {/* PROMPT + PUBLISHED DATE */}
                <div className="block sm:flex justify-between items-center">
                  <p className="text-white/80 text-xs max-w-[70%] truncate">
                    {img.prompt.length > 20
                      ? img.prompt.slice(0, 25) + "..."
                      : img.prompt}
                  </p>

                  <span className="text-white/60 text-[11px] right-0">
                    Publish on{" "}
                    {new Date(
                      new Date(img.updatedAt).toLocaleString("en-US", {
                        timeZone: "Asia/Kolkata",
                      })
                    ).toLocaleDateString("en-IN", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
