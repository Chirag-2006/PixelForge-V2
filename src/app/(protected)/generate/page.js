"use client";

import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import toast from "react-hot-toast";

// shadcn UI
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";

// icons
import {
  Loader2,
  RefreshCw,
  UploadCloud,
  Wand2,
  Sparkles,
  Palette,
  Settings,
} from "lucide-react";

export default function GeneratePage() {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();

  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [imgLoading, setImgLoading] = useState(false);

  const [imageUrl, setImageUrl] = useState("");
  const [imageData, setImageData] = useState(null);

  // Controls (UI only)
  const [quality, setQuality] = useState(80);
  const [creativity, setCreativity] = useState(50);

  // Smooth page load skeleton
  const [pageLoading, setPageLoading] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setPageLoading(false), 700);
    return () => clearTimeout(t);
  }, []);

  // Protect route if not logged in
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/?auth=login");
    }
  }, [isLoaded, isSignedIn, router]);

  // Skeleton while page loads
  if (!isSignedIn || pageLoading) {
    return (
      <div className="p-10 space-y-6 animate-pulse">
        <div className="h-8 w-64 bg-gray-300 rounded-md" />
        <div className="flex flex-col md:flex-row gap-8">
          <div className="h-80 flex-1 bg-gray-300 rounded-xl" />
          <div className="h-80 flex-2 bg-gray-300 rounded-xl" />
        </div>
      </div>
    );
  }

  // ▶ Generate (Backend untouched)
  const generate = async () => {
    if (!prompt.trim()) {
      toast.error("Prompt is required");
      return;
    }

    setLoading(true);
    setImgLoading(true);
    setImageUrl("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();

      if (data.limitReached) {
        toast.error("Free limit reached!");
        setLoading(false);
        return;
      }

      if (!res.ok || !data.imageUrl) {
        toast.error(data.error || "Error generating image");
        setLoading(false);
        return;
      }

      setImageData(data);
      setImageUrl(data.imageUrl);

      toast.success("Image generated successfully 🎉");
    } catch {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  };

  // ▶ Publish
  const publishImage = async () => {
    if (!imageData?.imageData?.[0]?.insertId) {
      toast.error("No image to publish");
      return;
    }

    try {
      const res = await fetch("/api/images/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageId: imageData.imageData?.[0]?.insertId }),
      });

      if (!res.ok) {
        toast.error("Failed to publish");
        return;
      }

      toast.success("Published successfully!");
      router.push("/explore");
    } catch {
      toast.error("Network error");
    }
  };

  // ▶️ Download Image
  // const downloadImage = () => {
  //    if (!imageUrl) {
  //   toast.error("No image to download");
  //   return;
  // }
  // const link = document.createElement("a");
  // link.href = imageUrl;
  // link.download = "pixelForge-image.png"; // File ka naam jo download hoga
  // document.body.appendChild(link);
  // link.click();  // Yahi click download trigger karta hai bina reload ya redirect ke
  // document.body.removeChild(link);
  // };

  return (
    <div className="container mx-auto p-6 pb-20">
      {/* ---------- PAGE HEADER ---------- */}
      <div className="flex items-center justify-center mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight">
          Generate with <span className="text-purple-600">AI</span>
        </h1>

        {/* <Button
          variant="outline"
          className="flex items-center gap-2 rounded-xl"
        >
          <Settings size={18} /> Advanced Settings
        </Button> */}
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* ---------- LEFT SIDE: Prompt + Controls ---------- */}
        <Card className="w-full lg:w-1/3 shadow-lg border rounded-2xl p-6">
          {/* BIG Premium Textarea */}
          <div className="relative mt-2">
            <label className="absolute -top-3 left-4 px-2 bg-white text-gray-600 text-sm">
              Describe your image
            </label>

            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="A cyberpunk samurai walking through neon Tokyo..."
              rows={8} // ⬅️ increased height
              className="resize-none text-[17px] rounded-xl border-2 min-h-[120px] focus:ring-2 focus:ring-purple-400 transition-all p-4 leading-relaxed"
            />
          </div>

          {/* UI SLIDERS */}
          <div className="mt-6 space-y-5">
            {/* Quality */}
            <div>
              <p className="font-semibold flex items-center gap-2 mb-1">
                <Sparkles size={18} /> Quality ({quality}%)
              </p>
              <Slider
                value={[quality]}
                onValueChange={(v) => setQuality(v[0])}
                max={100}
                className="w-full"
              />
            </div>

            {/* Creativity */}
            <div>
              <p className="font-semibold flex items-center gap-2 mb-1">
                <Wand2 size={18} /> Creativity ({creativity}%)
              </p>
              <Slider
                value={[creativity]}
                onValueChange={(v) => setCreativity(v[0])}
                max={100}
                className="w-full"
              />
            </div>
          </div>

          {/* Generate Button */}
          <Button
            className={`w-full mt-6 py-8 text-lg rounded-xl bg-black hover:bg-gray-900 ${
              loading && "opacity-50 cursor-not-allowed"
            }`}
            onClick={generate}
            // disabled={loading}
          >
            {loading ? (
              <div className="flex items-center gap-2 hover:cursor-not-allowed ">
                <Loader2 className="animate-spin" size={20} />
                Generating...
              </div>
            ) : (
              <>
                Generate Image <Palette size={20} />
              </>
            )}
          </Button>
        </Card>

        {/* ---------- RIGHT SIDE: Image Preview ---------- */}
        <Card className="flex-1 shadow-xl border rounded-2xl p-2 flex flex-col items-center justify-center min-h-[600px]">
          {/* 360° Modern Loader */}
          {!imageUrl && loading && (
            <div className="flex flex-col items-center gap-4">
              <RefreshCw
                className="animate-spin text-purple-600"
                size={70}
                strokeWidth="1.5"
              />
              <p className="text-gray-500">Crafting your masterpiece...</p>
            </div>
          )}

          {/* IMAGE */}
          {imageUrl && (
            <Image
              src={imageUrl}
              width={600}
              height={600}
              alt="Generated AI Image"
              unoptimized
              onLoad={() => setImgLoading(false)}
              className="
                rounded-xl shadow-xl
                animate-[fadeIn_0.6s_ease-out]
              "
            />
          )}

          {/* ACTION BUTTONS */}
          {imageUrl && !loading && (
            <div className="flex gap-4 mt-6 px-6 w-full">
              <Button
                className="bg-green-600 hover:bg-green-700 rounded-xl p-5 w-1/2"
                onClick={publishImage}
              >
                <UploadCloud size={18} /> Publish
              </Button>

              <Button
                className="bg-blue-600 hover:bg-blue-700 rounded-xl w-1/2 p-5"
                onClick={generate}
              >
                <RefreshCw size={18} /> Regenerate
              </Button>
            </div>
          )}

          {!imageUrl && !loading && (
            <p className="text-gray-500 mt-10 text-lg">
              Your generated image will appear here...
            </p>
          )}
        </Card>
      </div>
    </div>
  );
}
