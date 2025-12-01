"use client";

import { getPublicImages } from "@/app/api/images/imageActions";
import { getPublicUserProfile } from "@/app/api/user/userActions"; // Simple user fetch
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ExplorePage() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredImageId, setHoveredImageId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
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
                  imageUrl: userData?.user?.avatar
                }
              };
            } catch (error) {
              return {
                ...img,
                user: {
                  username: img.ownerId?.slice(-8),
                  imageUrl: null
                }
              };
            }
          })
        );
        
        setImages(imagesWithUser);
      } catch (error) {
        console.error("Error fetching public images:", error);
        setImages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleMouseEnter = (imageId) => {
    setHoveredImageId(imageId);
  };

  const handleMouseLeave = () => {
    setHoveredImageId(null);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8">Explore</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array(12).fill().map((_, i) => (
            <div key={i} className="aspect-square bg-gray-200 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8">Explore</h1>
        <div className="text-center py-20">
          <p className="text-2xl text-gray-500 mb-4">No public images yet</p>
          <p className="text-gray-400">Be the first to publish your creation!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-12">Explore</h1>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {images.map((img) => {
          const isHovered = hoveredImageId === img.id;
          const user = img.user;

          return (
            <Link
              key={img.id}
              href={`/u/${img.ownerId}`}
              className="block aspect-square group relative overflow-hidden rounded-xl shadow-sm hover:shadow-xl transition-all duration-500 w-full"
              onMouseEnter={() => handleMouseEnter(img.id)}
              onMouseLeave={handleMouseLeave}
            >
              {/* Main Image - Full Coverage */}
              <Image
                src={img.url}
                alt={img.prompt}
                width={600}
                height={600}
                // fill
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                className="object-cover transition-transform duration-500 border border-rose-800 group-hover:scale-110"
              />

              {/* Hover Overlay - Black gradient bottom slide-up */}
              <div
                className={`
                  absolute bottom-0 left-0 right-0 h-0 group-hover:h-2/3
                  bg-gradient-to-t from-black/90 via-black/70 to-transparent
                  backdrop-blur-sm transition-all duration-500 ease-out flex flex-col justify-end p-4
                  overflow-hidden
                `}
              >
                {/* Slide-up Content */}
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out opacity-0 group-hover:opacity-100">
                  {/* Avatar + Username */}
                  <div className="flex items-center gap-3 mb-2">
                    {user.imageUrl ? (
                      <Image
                        src={user.imageUrl}
                        alt={user.username}
                        width={36}
                        height={36}
                        className="w-9 h-9 rounded-full ring-2 ring-white/50 object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center ring-2 ring-white/50 flex-shrink-0">
                        <span className="text-xs font-bold text-white">
                          {user.username?.charAt(0)?.toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-semibold text-white truncate">
                        @{user.username}
                      </p>
                    </div>
                  </div>

                  {/* Prompt Preview */}
                  <p className="text-white/90 text-sm leading-relaxed line-clamp-3">
                    {img.prompt}
                  </p>
                </div>
              </div>

              {/* Top-right Corner - Always visible (subtle) */}
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-6 h-6 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-xs font-bold text-gray-800">
                    {user.username?.charAt(0)?.toUpperCase()}
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
