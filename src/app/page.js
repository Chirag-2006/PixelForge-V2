"use client";

import { useEffect } from "react";
import { useClerk } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  Zap,
  Images,
  ShieldCheck,
  ArrowRight,
  ArrowDown,
  FileText,
  Cpu,
  CheckCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import FooterCol from "@/components/home/footerCols";

export default function Home() {
  const { openSignIn } = useClerk();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("auth") === "login") {
      openSignIn({
        oauthFlow: "popup",
        fallbackRedirectUrl: "/generate",
      });
    }
  }, [openSignIn]);

  return (
    <>
      <main className="min-h-[90vh] pt-24 px-6">
        {/* 🌟 HERO SECTION */}
        <section className="text-center max-w-3xl mx-auto">
          <h1 className="text-5xl py-3 md:text-6xl font-extrabold bg-linear-to-r from-purple-500 via-blue-500 to-cyan-400 bg-clip-text text-transparent">
            Create Stunning AI Images in Seconds
          </h1>

          <p className="text-gray-600 text-lg md:text-xl mt-1">
            pixelForge turns your imagination into reality with AI-powered image
            generation.
          </p>

          <div className="mt-8 flex items-center flex-col sm:flex-row justify-center gap-4">
            <Link href="/generate">
              <Button className="p-6 text-lg flex items-center gap-2">
                Start Generating <ArrowRight className="size-6" />
              </Button>
            </Link>

            <Link href="/explore">
              <Button variant="outline" className="px-6 py-6 text-lg">
                Explore Gallery
              </Button>
            </Link>
          </div>
        </section>

        {/* ---------- IMAGE GRID MOCKUP ----------- */}
        <section className="mt-20 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div
              key={i}
              className="rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500"
            >
              <Image
                src={`https://picsum.photos/id/${i + 50}/600/800`}
                alt="AI sample"
                width={500}
                height={700}
                className="object-cover w-full h-full hover:scale-110 transition-all duration-700"
              />
            </div>
          ))}
        </section>

        {/* ⭐ FEATURES (SHADCN CARDS) */}
        <section className="mt-28 max-w-6xl mx-auto">
          <h2 className="text-center text-4xl font-bold mb-10">
            Why Choose <span className="text-purple-500">pixelForge?</span>
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Sparkles className="w-10 h-10 text-purple-600" />,
                title: "High Quality Output",
                desc: "Generate stunning, high-resolution AI images.",
              },
              {
                icon: <Zap className="w-10 h-10 text-yellow-500" />,
                title: "Fast Generation",
                desc: "Images created in just seconds.",
              },
              {
                icon: <Images className="w-10 h-10 text-blue-500" />,
                title: "Unlimited Creativity",
                desc: "Create art, portraits, landscapes & more.",
              },
              {
                icon: <ShieldCheck className="w-10 h-10 text-green-600" />,
                title: "Secure & Private",
                desc: "Protected with Clerk auth & Drizzle ORM.",
              },
            ].map((f, i) => (
              <Card key={i} className="hover:shadow-xl transition-all">
                <CardHeader>
                  <CardTitle className="flex items-center gap-4">
                    {f.icon}
                    {f.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{f.desc}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* 🔥 HOW IT WORKS — SHADCN CARDS + LUCIDE ARROWS */}
        <section className="mt-32 max-w-7xl mx-auto">
          <h2 className="text-center text-4xl font-extrabold mb-16">
            How it’s <span className="text-blue-600">works</span>
          </h2>

          <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
            {/* STEP 1 */}
            <Card className="w-full lg:w-[32%] p-6 h-[360px] hover:shadow-2xl transition-all">
              <CardHeader className="flex flex-row gap-3 items-center">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <FileText className="w-7 h-7 text-purple-600" />
                </div>
                <CardTitle>1. Enter Your Prompt</CardTitle>
              </CardHeader>

              <CardContent className="flex flex-col justify-between h-full">
                <p className="text-gray-600 text-sm">
                  Describe anything: landscapes, portraits, futuristic scenes,
                  characters.
                </p>

                <div className="mt-5 bg-gray-100 rounded-xl p-4 text-sm border">
                  “A futuristic dragon flying over neon Tokyo at night”
                </div>
              </CardContent>
            </Card>

            {/* ARROW */}
            <ArrowRight className="hidden lg:block w-12 h-12 text-blue-500" />
            <ArrowDown className="lg:hidden block w-10 h-10 text-blue-500" />

            {/* STEP 2 */}
            <Card className="w-full lg:w-[32%] p-6 h-[360px] hover:shadow-2xl transition-all text-center">
              <CardHeader>
                <Cpu className="w-14 h-14 text-blue-600 mx-auto" />
                <CardTitle className="mt-3">AI Generates Your Image</CardTitle>
              </CardHeader>

              <CardContent className="flex flex-col items-center justify-between h-full">
                <p className="text-gray-600 text-sm">
                  pixelForge converts your text into stunning artwork using
                  advanced AI.
                </p>

                <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
              </CardContent>
            </Card>

            {/* ARROW */}
            <ArrowRight className="hidden lg:block w-12 h-12 text-green-500" />
            <ArrowDown className="lg:hidden block w-10 h-10 text-green-500" />

            {/* STEP 3 */}
            <Card className="w-full lg:w-[32%] p-6 h-[360px] hover:shadow-2xl transition-all">
              <CardHeader className="flex flex-row gap-3 items-center">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-7 h-7 text-green-600" />
                </div>
                <CardTitle>3. Get Your Result</CardTitle>
              </CardHeader>

              <CardContent className="flex flex-col justify-between h-full">
                <p className="text-gray-600 text-sm">
                  Your idea becomes a stunning AI-generated image within
                  seconds.
                </p>

                <div className="mt-5 rounded-xl overflow-hidden shadow-md">
                  <AspectRatio ratio={16 / 10}>
                    <Image
                      src="https://picsum.photos/id/82/600/400"
                      alt="Generated result"
                      fill
                      className="object-cover"
                    />
                  </AspectRatio>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* ❓ FAQ — SHADCN ACCORDION */}
        <section className="mt-32 max-w-3xl mx-auto">
          <h2 className="text-center text-4xl font-bold mb-10">
            Frequently Asked <span className="text-purple-500">Questions</span>
          </h2>

          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="q1">
              <AccordionTrigger>Is pixelForge free?</AccordionTrigger>
              <AccordionContent>
                Yes, you can generate images on the free plan with monthly
                limits.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="q2">
              <AccordionTrigger>Are images copyright-free?</AccordionTrigger>
              <AccordionContent>
                Yes, all generated images come with commercial usage rights.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="q3">
              <AccordionTrigger>How fast is generation?</AccordionTrigger>
              <AccordionContent>
                Most images generate in 1-3 seconds.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="q4">
              <AccordionTrigger>
                Which AI models do you support?
              </AccordionTrigger>
              <AccordionContent>
                Gemini, Stable Diffusion, LCM Models & more coming soon.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>
      </main>

      {/* 🖤 FOOTER */}
      <footer className="mt-32 bg-black text-white py-10">
        <div className="max-w-6xl mx-auto px-6 grid sm:grid-cols-2 md:grid-cols-4 gap-10">
          <div>
            <h3 className="text-xl font-semibold mb-3">pixelForge</h3>
            <p className="text-gray-400 text-sm">
              AI Image Generator for creatives, designers, and dreamers.
            </p>
          </div>

          <FooterCol
            title="Links"
            links={[
              { label: "Explore", href: "/explore" },
              { label: "Generate", href: "/generate" },
              { label: "Pricing", href: "/pricing" },
            ]}
          />

          <FooterCol
            title="Resources"
            links={[
              { label: "Docs", href: "#" },
              { label: "API Status", href: "#" },
              { label: "Models", href: "#" },
            ]}
          />

          <FooterCol
            title="Company"
            links={[
              { label: "About Us", href: "#" },
              { label: "Privacy", href: "#" },
              { label: "Terms", href: "#" },
            ]}
          />
        </div>

        <p className="text-center text-gray-500 text-xs mt-10">
          © {new Date().getFullYear()} pixelForge · All rights reserved.
        </p>
      </footer>
    </>
  );
}
