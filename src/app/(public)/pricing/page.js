"use client"

import { useState, useEffect } from "react"
import PricingCard from "@/components/PricingCard"
import FullSkeleton from "./PricingSkeleton"

// purchase links
const BUY_PRO_LINK = "/checkout/pro"
const BUY_FREE_LINK = "/checkout/free"

export default function PricingPage() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 900)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="min-h-screen bg-[#0b0e1a] text-white flex flex-col items-center py-16 px-4">

      {loading ? (
        <FullSkeleton />
      ) : (
        <>
          {/* Title */}
          <h1 className="text-4xl font-bold text-center">Simple, Transparent Pricing</h1>
          <p className="text-gray-400 mt-2 text-center">
            Choose the plan that fits your creative needs.
          </p>

          {/* Pricing Cards */}
          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl w-full">

            {/* Hobbyist */}
            <PricingCard
              title="Hobbyist"
              price="$0"
              sub="/month"
              desc="Perfect for trying out the power of Gemini AI."
              features={[
                { text: "5 generations per month" },
                { text: "Gemini Flash Model" },
                { text: "Standard Quality" },
                { text: "Private Gallery", disabled: true },
                { text: "Commercial License", disabled: true },
              ]}
              btnText="Get Started"
              btnLink={BUY_FREE_LINK}
            />

            {/* Pro First, Highlighted */}
            <PricingCard
              highlight
              popular
              title="Pro Creator"
              price="$19"
              sub="/month"
              desc="Unlock the full creative potential."
              features={[
                { text: "Unlimited generations" },
                { text: "Access to Gemini Pro Vision" },
                { text: "HD & 4K Resolution" },
                { text: "Private Gallery" },
                { text: "Commercial License" },
              ]}
              btnText="Upgrade to Pro"
              btnLink={BUY_PRO_LINK}
            />
          </div>
        </>
      )}
    </div>
  )
}
