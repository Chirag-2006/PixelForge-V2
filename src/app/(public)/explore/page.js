"use client";

import { getPublicImages } from "@/app/api/images/imageActions";
import { getPublicUserProfile } from "@/app/api/user/userActions";
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
      <div className="container mx-auto p-6">
        <div className="h-10 w-48 bg-gray-800/40 rounded-lg animate-pulse mb-6"></div>
        <div className="h-4 w-64 bg-gray-800/30 rounded-lg animate-pulse mb-10"></div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array(9)
            .fill()
            .map((_, i) => (
              <div
                key={i}
                className="aspect-4/5 bg-gray-800/30 rounded-2xl animate-pulse"
              ></div>
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
        gap-8
      "
      >
        {images.map((img) => {
          const user = img.user;

          // Trim prompt to 10 characters
          const shortPrompt =
            img.prompt.length > 10
              ? img.prompt.slice(0, 50) + "..."
              : img.prompt;

          return (
            <Link
              key={img.id}
              href={`/u/${img.ownerId}`}
              className="
                group block aspect-4/5 relative overflow-hidden
                rounded-2xl border border-gray-800/40
                hover:border-purple-400/50
                hover:shadow-[0_0_40px_rgba(139,92,246,0.25)]
                transition-all duration-500
              "
            >
              {/* Big High-Quality Image */}
              <Image
                src={img.url}
                alt={"Image"}
                width={800}
                height={1000}
                className="
                  object-cover w-full h-full
                  transition-all duration-700
                  group-hover:scale-[1.05]
                "
              />

              {/* Dark Fade Overlay */}
              <div
                className="
                absolute inset-0 
                bg-linear-to-t from-black/80 via-black/40 to-transparent
                opacity-0 group-hover:opacity-100
                transition-all duration-500
              "
              />

              {/* Hover Info */}
              <div
                className="
                  absolute bottom-0 left-0 right-0 p-5
                  translate-y-8 group-hover:translate-y-0
                  opacity-0 group-hover:opacity-100
                  transition-all duration-500
                "
              >
                {/* Avatar + Username */}
                <div className="flex items-center gap-3 mb-2">
                  {user.imageUrl ? (
                    <Image
                      src={user.imageUrl}
                      width={40}
                      height={40}
                      className="
                        w-10 h-10 rounded-full object-cover
                      "
                      alt="user"
                    />
                  ) : (
                    <div
                      className="
                        w-10 h-10 rounded-full 
                        bg-linear-to-br from-purple-500 to-blue-600 
                        flex items-center justify-center
                        ring-2 ring-white/40 group-hover:ring-purple-400 transition-all
                      "
                    >
                      <span className="text-sm font-bold">
                        {user.username?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}

                  <p className="text-white font-semibold text-sm">
                    @{user.username}
                  </p>
                </div>

                {/* Short Prompt */}
                <p className="text-white/80 text-xs">{shortPrompt}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
