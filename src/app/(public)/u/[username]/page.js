"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getPublicUserProfile } from "@/app/api/user/userActions";

export default function UserProfilePage() {
  const params = useParams();
  const userId = params.username; // ✅ Rename to userId (kyunki ownerId aa raha)

  const [profile, setProfile] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log('userId from params:', userId);

  useEffect(() => {
    if (!userId) return;

    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await getPublicUserProfile(userId); // ✅ Pass userId instead of username

        console.log("data in user profile page", data);

        if (data.error) {
          setError("User not found");
          return;
        }

        setProfile(data.user);
        
        setImages(data.images || []);
      } catch (err) {
        console.error("Profile fetch error:", err);
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);
  
  console.log("profile data", profile);


  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto p-6 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-6 animate-pulse mb-12">
            <div className="w-24 h-24 bg-gray-200 rounded-full"></div>
            <div className="space-y-2">
              <div className="h-8 bg-gray-200 rounded w-48"></div>
              <div className="h-4 bg-gray-200 rounded w-32"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {Array(8)
              .fill()
              .map((_, i) => (
                <div
                  key={i}
                  className="h-64 bg-gray-200 rounded-lg animate-pulse"
                ></div>
              ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto p-6 min-h-screen flex items-center justify-center">
        <div className="text-center py-12">
          <h1 className="text-4xl font-bold text-gray-400 mb-4">
            User Not Found
          </h1>
          <Link href="/explore" className="text-blue-600 hover:underline">
            ← Back to Explore
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 min-h-screen">
      {/* Profile Header */}
      <div className="max-w-4xl mx-auto mb-12">
        <div className="flex items-center gap-6 bg-white rounded-2xl shadow-lg p-8 border">
          <div className="relative">
            {/* ✅ FIXED: Tailwind gradient syntax */}
            <div className="w-24 h-24 bg-linear-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-lg">
              <Image
                width={500} 
                height={500}
                src={profile?.imageUrl || "/default-avatar.png"}
                alt="Profile"
                className="w-24 h-24 rounded-full"
              />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            {/* ✅ FIXED: Tailwind gradient syntax */}
            <h1 className="text-4xl font-bold bg-linear-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent  pb-2">
              @{profile?.username || userId?.slice(-8)}
            </h1>
            <p className="text-gray-500 mb-4">
              {images.length} {images.length === 1 ? "image" : "images"} published
            </p>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <span>Member since {new Date().getFullYear()}</span>
              {/* <Link
                href="/explore"
                className="hover:text-blue-600 transition-colors"
              >
                ← Explore
              </Link> */}
            </div>
          </div>
        </div>
      </div>

      {/* Published Images Grid */}
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">Published Works</h2>
          {images.length === 0 && (
            <span className="text-gray-500 text-lg">No public images yet</span>
          )}
        </div>

        {images.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-2xl">
            {/* ✅ FIXED: Tailwind gradient syntax */}
            <div className="w-24 h-24 mx-auto mb-6 bg-linear-to-r from-gray-200 to-gray-300 rounded-2xl flex items-center justify-center">
              <span className="text-3xl">📸</span>
            </div>
            <h3 className="text-2xl font-semibold text-gray-600 mb-2">
              No images published
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              This user hasn&apos;t published any images yet. Check back later!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {images.map((img) => (
              <Link
                key={img.id}
                href={`/explore/${img.id}`}
                className="group block"
              >
                <div className="border rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-white">
                  <div className="overflow-hidden">
                    <Image
                      src={img.url}
                      alt={img.prompt}
                      width={400}
                      height={400}
                      className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-gray-600 line-clamp-2 group-hover:text-gray-900 transition-colors mb-2">
                      {img.prompt}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      {/* ✅ FIXED: Tailwind gradient syntax */}
                      <div className="w-5 h-5 bg-linear-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">✓</span>
                      </div>
                      <span>Published</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
