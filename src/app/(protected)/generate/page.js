"use client";


import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import toast from "react-hot-toast";


// shadcn components
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";


// icons
import {
  ChevronDown,
  ChevronUp,
  Download,
  RefreshCw,
  UploadCloud,
} from "lucide-react";


export default function GeneratePage() {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();


  const [prompt, setPrompt] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);


  const [imageUrl, setImageUrl] = useState("");
  const [imgLoading, setImgLoading] = useState(false);


  // 🟡 Page skeleton initial
  const [pageLoading, setPageLoading] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setPageLoading(false), 700); // smooth effect
    return () => clearTimeout(t);
  }, []);


  // Protect route
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/?auth=login");
    }
  }, [isLoaded, isSignedIn, router]);


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


  // ▶️ Generate Image
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


      if (!res.ok) {
        toast.error(data.error || "Error generating image");
        setLoading(false);
        return;
      }


      setImageUrl(data.imageUrl);
      toast.success("Image generated");
    } catch (err) {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  };


  // ▶️ Publish
  const publishImage = async () => {
    try {
      const res = await fetch("/api/images/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl }),
      });


      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Error publishing image");
        return;
      }


      toast.success("Published!");
    } catch {
      toast.error("Network error");
    }
  };


  // ▶️ Download
  const downloadImage = () => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = "pixelForge-image.png";
    link.click();
  };


  return (
    <div className=" container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">✨ Generate Your Image</h1>


      <div className="flex flex-col md:flex-row gap-8">
        {/* LEFT SMALL AREA */}
        <Card className="border border-gray-300 shadow-sm flex-1">
          <CardHeader>
            <h2 className="text-xl font-semibold">Enter your prompt</h2>
          </CardHeader>


          <CardContent>
            {/* Expandable textarea */}
            {/* Expandable textarea like Google Gemini */}
            <div className="relative">
              <Textarea
                value={prompt}
                onChange={(e) => {
                  setPrompt(e.target.value);
                  if (e.target.value.length > 40 && !expanded) {
                    setExpanded(false); // keep collapsed when long
                  }
                }}
                placeholder="Describe your image..."
                rows={expanded ? 6 : 3}
                className={`text-base resize-none pr-10 transition-all duration-200 ${
                  expanded ? "overflow-auto" : "overflow-hidden"
                }`}
              />


              {/* Show icon only when prompt > 40 characters */}
              {prompt.length > 40 && (
                <button
                  className="absolute right-3 bottom-3 text-gray-500 hover:text-black"
                  onClick={() => setExpanded(!expanded)}
                >
                  {expanded ? (
                    <ChevronUp size={20} />
                  ) : (
                    <ChevronDown size={20} />
                  )}
                </button>
              )}
            </div>


            {/* Generate Button */}
            <Button
              onClick={generate}
              disabled={loading}
              className="w-full mt-4 py-4 text-lg"
            >
              {loading ? "Generating..." : "Generate"}
            </Button>
          </CardContent>
        </Card>


        {/* RIGHT — BIG PREVIEW AREA */}
        <Card className="border border-gray-300 shadow-sm p-4 min-h-[470px] flex flex-col items-center justify-center flex-2">
          {/* IMAGE SKELETON */}
          {!imageUrl && imgLoading && (
            <div className="w-lg h-[512px] bg-gray-300 rounded-xl animate-pulse" />
          )}


          {/* IMAGE */}
          {imageUrl && (
            <Image
              src={imageUrl}
              width={512}
              height={512}
              alt="Generated Image"
              unoptimized
              onLoad={() => setImgLoading(false)}
              className="rounded-xl shadow-lg"
            />
          )}


          {/* BUTTON GROUP */}
          {imageUrl && !imgLoading && (
            <div className="flex gap-3 mt-5 w-full justify-center">
              <Button
                onClick={publishImage}
                className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
              >
                <UploadCloud size={18} /> Publish
              </Button>


              <Button
                onClick={generate}
                className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
              >
                <RefreshCw size={18} /> Regenerate
              </Button>


              <Button
                onClick={downloadImage}
                className="bg-black hover:bg-gray-800 flex items-center gap-2"
              >
                <Download size={18} /> Download
              </Button>
            </div>
          )}


          {/* No Image Yet */}
          {!imageUrl && !imgLoading && (
            <p className="text-gray-500 text-lg">
              Your generated image will appear here...
            </p>
          )}
        </Card>
      </div>
    </div>
  );
}