// COMMENTS ADDED FOR EVERY FIX

"use client";

import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast"; // <-- YOU SAID YOU WANT TO USE TOAST

export default function GenerateClient() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  async function generate() {
    if (!prompt) {
      toast.error("Prompt is required", {
        style: {
          color: "red",
        },
      });
      return;
    }

    if (prompt.trim().length < 3) {
      toast.error("Minimum 3 characters required", {
        style: {
          color: "red",
        },
      });
      return;
    }

    setLoading(true);
    setImageUrl("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();

      console.log('data in generate cline', data);
      

      // 403 — FREE LIMIT REACHED
      if (data.limitReached) {
        toast.error("Free limit reached! Upgrade your plan.", {
          style: {
            color: "red",
          },
        });
        setLoading(false);
        return;
      }

      if (!res.ok) {
        toast.error(data.error || "Error generating image", {
          style: {
            color: "red",
          },
        });
        setLoading(false);
        return;
      }

      setImageUrl(data.imageUrl);
      toast.success("Image generated Successfully");
      setLoading(false);
    } catch (err) {
      toast.error("Network error, try again");
      setLoading(false);
    }
  }

  return (
    <div className="p-10 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">
        🤖 AI Image Generator
      </h1>

      <input
        className="p-4 border rounded-lg w-full"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Describe your image..."
      />

      <button
        onClick={generate}
        disabled={loading}
        className={`w-full p-4 mt-4 bg-indigo-600 text-white rounded-lg ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "cursor-pointer hover:bg-indigo-700"
        }`}
      >
        {loading ? "Generating..." : "Generate"}
      </button>

      {imageUrl && (
        <Image
          src={imageUrl}
          width={512}
          height={512}
          alt="generated"
          unoptimized
          className="mt-6 rounded-xl shadow-xl"
        />
      )}
    </div>
  );
}
