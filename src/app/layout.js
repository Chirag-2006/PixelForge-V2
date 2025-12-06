import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/common/navbar";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const ogImage = "https://res.cloudinary.com/ddrrc7kbh/image/upload/v1764928595/wmremove-transformed_lj1gsf.png";

// ⭐ Full SEO Metadata (themeColor removed)
export const metadata = {
  title: "pixelForge – AI Image Generator | Create Stunning AI Images",
  description:
    "pixelForge is a modern AI-powered image generator that creates high-quality artwork using advanced AI models. Fast, clean, and easy to use.",
  keywords: [
    "AI image generator",
    "free AI image generator",
    "pixelForge",
    "AI artwork",
    "text to image",
    "AI tool",
    "create images with AI",
  ],
  authors: [{ name: "Chirag Arya" }],
  creator: "Chirag Arya",
  metadataBase: new URL("https://YOUR_DOMAIN.com"),

  openGraph: {
    title: "pixelForge – Generate Stunning AI Images Instantly",
    description:
      "Create high-quality AI images using our advanced AI generator. Just write a prompt and generate!",
    url: "https://YOUR_DOMAIN.com",
    siteName: "pixelForge",
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: "pixelForge AI Image Generator",
      },
    ],
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "pixelForge – AI Image Generator",
    description:
      "Generate stunning AI images using text prompts. Fast, smooth, high-quality results.",
    images: [ogImage],
  },

  icons: {
    icon: "/favicon.ico",
  },
};

// ⭐ FIX: themeColor MUST be defined inside 'viewport'
export const viewport = {
  themeColor: "#00ADB5",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <Toaster position="top-center" reverseOrder={false} />
          <Navbar />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
