"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useUser } from "@clerk/nextjs";
import { getUserImages } from "@/app/api/images/imageActions";
import ImageCard from "./ImageCard";


export default function DashboardClientPage() {
  const { user, isLoaded } = useUser(); // isLoaded add kiya
  
  const [created, setCreated] = useState([]);
  const [published, setPublished] = useState([]);
  const [privateImgs, setPrivateImgs] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state add kiya

  // Fetch user images - FIXED VERSION
  useEffect(() => {
    if (!isLoaded || !user?.id) return; // User load hone ka wait

    const fetchImages = async () => {
      try {
        setLoading(true);
        const data = await getUserImages(user.id); // await sahi se

        console.log("image data in dashboard", data);

        // Data ko properly categorize karo
        const createdImages = data || [];
        const publishedImages = (data || []).filter((img) => img.isPublished === true);
        const privateImages = (data || []).filter((img) => img.isPublished === false);

        // Ek saath sab set karo
        setCreated(createdImages);
        setPublished(publishedImages);
        setPrivateImgs(privateImages);

        console.log("✅ Updated states:", {
          created: createdImages.length,
          published: publishedImages.length,
          private: privateImages.length
        });
      } catch (error) {
        console.error("❌ Error fetching images:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [user?.id, isLoaded]); // ✅ user.id aur isLoaded add kiya

  // Loading state
  if (!isLoaded || loading) {
    return (
      <div className="max-w-6xl mx-auto py-10 px-4 text-center">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-64 mx-auto"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mt-6">
            {Array(6).fill().map((_, i) => (
              <div key={i} className="h-80 bg-gray-200 rounded-lg animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // No images found
  if (created.length === 0) {
    return (
      <div className="max-w-6xl mx-auto py-10 px-4 text-center">
        <h1 className="text-3xl font-bold mb-6">Your Dashboard</h1>
        <div className="text-2xl text-gray-500 py-20">
          No images found. Create your first image!
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Your Dashboard</h1>

      <Tabs defaultValue="created" className="w-full">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="created">
            Created ({created.length})
          </TabsTrigger>
          <TabsTrigger value="published">
            Published ({published.length})
          </TabsTrigger>
          <TabsTrigger value="private">
            Private ({privateImgs.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="created" className="mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {created.map((img) => (
              <ImageCard
                key={img.id}
                url={img.url}  // ✅ Console data me 'url' hai, 'imageUrl' nahi
                published={img.isPublished}  // ✅ Console data me 'isPublished' hai
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="published" className="mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {published.map((img) => (
              <ImageCard
                key={img.id}
                url={img.url}  // ✅ Fixed field name
                published={true}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="private" className="mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {privateImgs.map((img) => (
              <ImageCard
                key={img.id}
                url={img.url}  // ✅ Fixed field name
                published={false}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
