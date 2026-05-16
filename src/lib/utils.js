import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function getOptimizedCloudinaryUrl(url, width = 800) {
  if (!url || !url.includes("cloudinary.com")) return url;
  const parts = url.split("/upload/");
  if (parts.length === 2) {
    return `${parts[0]}/upload/f_auto,q_auto,w_${width}/${parts[1]}`;
  }
  return url;
}

export const blurDataURL = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
