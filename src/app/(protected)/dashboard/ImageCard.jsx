"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, ArrowUp } from "lucide-react";

export default function ImageCard({ url, published, onPublish, onDelete }) {
  return (
    <div
      className="
        relative rounded-xl overflow-hidden border bg-white 
        shadow transition-all duration-300
        group hover:shadow-2xl
      "
    >
      {/* Image */}
      <div className="overflow-hidden">
        <Image
          src={url}
          alt="user image" 
          width={800}
          height={600}
          className="
            w-full h-56 object-cover 
            md:h-64  
            md:group-hover:scale-105 
            md:transition-transform md:duration-500
          "
        />
      </div>

      {/* Status Badge */}
      <div className="absolute top-3 left-3 z-10">
        <Badge
          className={`
            px-2 py-1 text-xs
            ${published ? "bg-green-600 text-white" : "bg-gray-800 text-white"}
          `}
        >
          {published ? "Published" : "Private"}
        </Badge>
      </div>

      {/* Desktop Hover Action Buttons */}
      <div
        className="
          hidden md:flex absolute inset-x-0 bottom-3 justify-center
          opacity-0 group-hover:opacity-100 translate-y-4 
          group-hover:translate-y-0 transition-all duration-300
        "
      >
        <div className="flex gap-3 w-[86%] justify-center">
          {!published && (
            <Button
              className="bg-purple-600 hover:bg-purple-700 text-white w-1/2"
              onClick={onPublish}
            >
              <ArrowUp size={16} /> Publish
            </Button>
          )}

          <Button
            variant="outline"
            className="w-1/2 border-red-500 text-red-600 hover:bg-red-50"
            onClick={onDelete}
          >
            <Trash2 size={16} /> Delete
          </Button>
        </div>
      </div>

      {/* Mobile Action Buttons */}
      <div className="flex md:hidden p-3 gap-3">
        {!published && (
          <Button
            className="bg-purple-600 hover:bg-purple-700 text-white w-1/2"
            onClick={onPublish}
          >
            Publish
          </Button>
        )}

        <Button
          variant="outline"
          className="w-1/2 border-red-500 text-red-600 hover:bg-red-50"
          onClick={onDelete}
        >
          Delete
        </Button>
      </div>
    </div>
  );
}
