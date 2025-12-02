import Link from "next/link";
import Feature from "./FeatureCard";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";


export default function PricingCard({ title, price, sub, desc, features, btnText, btnLink, popular, highlight }) {
  return (
    <Card
      className={`relative bg-[#0f1320] text-white rounded-xl transition-all duration-300 
        ${highlight
          ? "border border-blue-600 shadow-blue-700/20 shadow-2xl scale-[1.02]"
          : "border border-gray-700 hover:-translate-y-2 hover:border-blue-500 hover:shadow-blue-700/20"
        }
        hover:shadow-xl`}
    >
      {popular && (
        <div className="absolute top-4 right-4 bg-yellow-500 text-black text-xs px-3 py-1 rounded-full">
          MOST POPULAR
        </div>
      )}

      <CardHeader>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>

      <CardContent>
        <p className="text-4xl font-bold">
          {price}
          <span className="text-base font-normal text-gray-400"> {sub}</span>
        </p>

        <p className="text-gray-400 mt-2 mb-6 text-sm">{desc}</p>

        <div className="space-y-3 text-sm">
          {features.map((f, i) => (
            <Feature key={i} text={f.text} disabled={f.disabled} />
          ))}
        </div>
      </CardContent>

      <CardFooter>
        <Link href={btnLink} className="w-full">
          <Button
            className={`w-full transition-all 
              ${popular || highlight
                ? "bg-[#7a4bff] hover:bg-[#6737f2]"
                : "bg-gray-200 text-black hover:bg-gray-300"
              }`}
          >
            {btnText}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}