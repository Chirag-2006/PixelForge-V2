"use client";

import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import toast from "react-hot-toast";

// ShadCN UI
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Skeleton } from "@/components/ui/skeleton";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

// Icons
import {
  Loader2,
  RefreshCw,
  UploadCloud,
  Wand2,
  Sparkles,
  Palette,
} from "lucide-react";

export default function GeneratePage() {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();

  // MAIN STATES
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [imgLoading, setImgLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [imageData, setImageData] = useState(null);

  // UI CONTROLS
  const [quality, setQuality] = useState(80);
  const [creativity, setCreativity] = useState(50);

  // USER PLAN + LIMIT
  const [userPlan, setUserPlan] = useState("FREE");
  const [generationCount, setGenerationCount] = useState(0);

  // Upgrade Dialog
  const [showUpgrade, setShowUpgrade] = useState(false);

  // Page skeleton
  const [pageLoading, setPageLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // GET USER PLAN + LIMIT FROM BACKEND
  useEffect(() => {
    async function loadUser() {
      setPageLoading(true);
      try {
        const res = await fetch("/api/user");
        const data = await res.json();

        setUserPlan(data.plan);
        setGenerationCount(data.generationCount);
      } catch (err) {
        console.log("Error loading user:", err);
      } finally {
        setPageLoading(false); // ⭐ STOP LOADING ONLY AFTER USER DATA LOADED
      }
    }

    loadUser();
  }, []);

  // PROTECT ROUTE
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/?auth=login");
    }
  }, [isLoaded, isSignedIn, router]);

  const limitReached = userPlan === "FREE" && generationCount >= 5;

  // ▶ GENERATE HANDLER
  const generate = async () => {
    if (!prompt.trim()) {
      toast.error("Prompt is required!");
      return;
    }

    if (prompt.trim().length < 3) {
      toast.error("Minimum 3 characters required!");
      return;
    }

    // BLOCK REQUEST IF LIMIT EXCEEDED (NO BACKEND CALL)
    if (limitReached) {
      setShowUpgrade(true);
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
        return;
      }

      if (!res.ok || !data.imageUrl) {
        toast.error(data.error || "Error generating image");
        setLoading(false);
        return;
      }

      setImageData(data);
      setImageUrl(data.imageUrl);

      // UPDATE LOCAL COUNT UI WITHOUT RELOAD
      setGenerationCount((prev) => prev + 1);

      toast.success("Image generated successfully 🎉");
    } catch (err) {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  };

  // console.log("image data in genrate page", imageData);

  // ▶ PUBLISH IMAGE
  const publishImage = async () => {
    const insertedId = imageData?.imageData?.[0]?.id;

    if (!insertedId) {
      toast.error("No image to publish");
      return;
    }
    setUploadingImage(true); // ⭐ start loading

    try {
      const res = await fetch("/api/images/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageId: insertedId }),
      });

      if (!res.ok) {
        toast.error("Failed to publish");
        return;
      }

      toast.success("Published successfully!");
      router.push("/explore");
    } catch {
      toast.error("Network error");
    } finally {
      setUploadingImage(false); // ⭐ stop loading
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

  // SKELETON LOADING
  if (!isSignedIn || pageLoading) {
    return (
      <div className="p-10 space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="flex flex-col md:flex-row gap-8">
          <Skeleton className="h-80 flex-1" />
          <Skeleton className="h-80 flex-1" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 pb-20">
      {/* TITLE */}
      <div className="flex items-center justify-center mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight">
          Generate with <span className="text-purple-600">AI</span>
        </h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* LEFT SIDE */}
        <Card className="w-full lg:w-1/3 shadow-lg border rounded-2xl p-6 relative">
          <div className="relative mt-2">
            <label className="absolute -top-3 left-4 px-2 bg-white text-gray-600 text-sm">
              Describe your image
            </label>

            <Textarea
              disabled={loading}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="A cyberpunk samurai walking through neon Tokyo..."
              rows={8}
              className="resize-none text-[17px] rounded-xl border-2 min-h-[120px] p-4"
            />
            {userPlan === "FREE" && (
              <p className="text-right text-[18px] text-purple-600 mt-2 font-medium">
                ({generationCount}/5) images generated
              </p>
            )}
          </div>

          {/* SLIDERS */}
          <div className="mt-6 space-y-5 opacity-100">
            {/* QUALITY */}
            <div>
              <p className="font-semibold flex items-center gap-2 mb-1">
                <Sparkles size={18} /> Quality ({quality}%)
              </p>
              <Slider
                value={[quality]}
                onValueChange={(v) => setQuality(v[0])}
                max={100}
                disabled={loading} // 🔥 prevents changes while generating
                className={loading ? "cursor-not-allowed opacity-60" : ""}
              />
            </div>

            {/* CREATIVITY */}
            <div>
              <p className="font-semibold flex items-center gap-2 mb-1">
                <Wand2 size={18} /> Creativity ({creativity}%)
              </p>
              <Slider
                value={[creativity]}
                onValueChange={(v) => setCreativity(v[0])}
                max={100}
                disabled={loading} // 🔥 prevents changes
                className={loading ? "cursor-not-allowed opacity-60" : ""}
              />
            </div>
          </div>

          {/* BUTTON */}
          <Button
            // disabled={loading}
            className={`
    w-full mt-6 py-8 text-lg rounded-xl font-semibold shadow-sm transition-all duration-300 
    ${
      limitReached
        ? "bg-purple-600 hover:bg-purple-700 text-white"
        : "bg-black hover:bg-gray-900 text-white"
    }
    ${loading && "opacity-50 cursor-not-allowed"}
  `}
            onClick={limitReached ? () => setShowUpgrade(true) : generate}
          >
            {limitReached ? (
              <span className="flex items-center justify-center gap-2 text-[18px]">
                ⚡ Upgrade to Pro
              </span>
            ) : loading ? (
              <span className="flex items-center gap-2 cursor-not-allowed">
                <Loader2 className="animate-spin" size={20} /> Generating...
              </span>
            ) : (
              <>
                Generate Image <Palette size={20} />
              </>
            )}
          </Button>
        </Card>

        {/* RIGHT SIDE */}
        <Card className="flex-1 shadow-xl border rounded-2xl p-2 flex flex-col items-center justify-center min-h-[600px]">
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

          {imageUrl && (
            <Image
              src={imageUrl}
              width={600}
              height={600}
              alt="Generated AI Image"
              unoptimized
              onLoad={() => setImgLoading(false)}
              className="rounded-xl shadow-xl animate-[fadeIn_0.6s_ease-out]"
            />
          )}

          {imageUrl && !loading && (
            <div className="flex gap-4 mt-6 px-6 w-full">
              <Button
                className="bg-green-600 hover:bg-green-700 rounded-xl p-5 w-1/2"
                onClick={publishImage}
                disabled={uploadingImage}
              >
                {uploadingImage ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="animate-spin" size={18} />
                    Publishing…
                  </span>
                ) : (
                  <>
                    <UploadCloud size={18} /> Publish
                  </>
                )}
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

      {/* UPGRADE DIALOG */}
      {userPlan === "FREE" && (
        <Dialog open={showUpgrade} onOpenChange={setShowUpgrade}>
          <DialogContent className="rounded-xl md:max-w-md max-w-xs mx-auto">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold">
                Upgrade Required ⚡
              </DialogTitle>

              <p className="text-sm text-gray-500 mt-1">
                You have reached your free image generation limit. Upgrade to
                Pro for unlimited access and faster AI generation.
              </p>
            </DialogHeader>

            <div className="flex gap-3 justify-end mt-6">
              {/* CANCEL (Desktop only) */}
              <Button
                variant="outline"
                className="w-full hidden md:block md:w-auto"
                onClick={() => setShowUpgrade(false)}
              >
                Cancel
              </Button>

              {/* UPGRADE BUTTON */}
              <Button
                className="bg-purple-600 text-white w-full md:w-auto rounded-xl"
                onClick={() => router.push("/pricing")}
              >
                Upgrade Now 🚀
              </Button>
            </div>

            {/* CANCEL FOR MOBILE BELOW BUTTONS (Optional, UX better) */}
            <Button
              variant="outline"
              className="w-full md:hidden mt-3"
              onClick={() => setShowUpgrade(false)}
            >
              Cancel
            </Button>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
