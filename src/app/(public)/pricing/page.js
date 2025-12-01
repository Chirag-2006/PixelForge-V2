import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Crown, Zap, User , Users, Star, CreditCard } from "lucide-react";
import Link from "next/link";

const pricingPlans = [
  {
    name: "Free",
    price: "0",
    period: "month",
    description: "Perfect for testing PixelForge",
    features: [
      "10 images/month",
      "512x512 resolution",
      "Watermark on images",
      "Standard queue",
      "Community support"
    ],
    popular: false,
    cta: "Get Started Free",
    href: "/register"
  },
  {
    name: "Pro",
    price: "9",
    period: "month",
    description: "Best for creators & designers",
    features: [
      "Unlimited images",
      "1024x1024 resolution",
      "No watermark",
      "Priority queue",
      "Private gallery",
      "Export HD",
      "Email support"
    ],
    popular: true,
    cta: "Most Popular",
    href: "/register?plan=pro"
  },
  {
    name: "Studio",
    price: "29",
    period: "month",
    description: "For professional teams",
    features: [
      "Everything in Pro",
      "2048x2048 resolution",
      "API access",
      "Team collaboration",
      "Custom branding",
      "24/7 priority support",
      "Image analytics"
    ],
    popular: false,
    cta: "Contact Sales",
    href: "/contact"
  }
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-background to-muted/50 py-20">
      {/* Hero Section */}
      <div className="container mx-auto px-6 text-center mb-24">
        <Badge className="mb-4 inline-flex items-center gap-1 bg-primary text-primary-foreground px-3 py-1">
          <Zap className="h-3 w-3" />
          Simple, transparent pricing
        </Badge>
        
        <h1 className="text-5xl md:text-6xl font-black bg-linear-to-r from-foreground via-primary to-destructive bg-clip-text text-transparent mb-6">
          Choose your plan
        </h1>
        
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-16 leading-relaxed">
          Generate stunning AI images with the perfect plan for your needs. 
          Cancel anytime, no credit card required for Free plan.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
          <Button size="lg" className="text-lg px-8 h-12 shadow-2xl">
            Start Free Trial
          </Button>
          <Button variant="outline" size="lg" className="text-lg px-8 h-12">
            Contact Sales
          </Button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="container mx-auto px-6 mb-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <Card 
              key={plan.name}
              className={`
                group relative overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500
                ${plan.popular ? 
                  'border-2 border-primary shadow-2xl scale-[1.02] lg:scale-105 lg:-translate-y-4' : 
                  'hover:-translate-y-2 hover:scale-[1.02]'
                }
                ${plan.popular ? 'ring-4 ring-primary/10' : ''}
              `}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground px-4 py-1 shadow-lg font-semibold">
                    <Crown className="h-4 w-4 mr-1" />
                    MOST POPULAR
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-6 pt-16">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-linear-to-r from-primary to-primary/80 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  {plan.popular ? (
                    <Crown className="h-8 w-8 text-primary-foreground" />
                  ) : plan.name === "Free" ? (
                    <User  className="h-8 w-8 text-primary-foreground"  />
                  ) : (
                    <Users className="h-8 w-8 text-primary-foreground" />
                  )}
                </div>
                <CardTitle className="text-3xl font-black">{plan.name}</CardTitle>
                <CardDescription className="text-lg text-muted-foreground">
                  {plan.description}
                </CardDescription>
                
                <div className="mt-8">
                  <div className="text-5xl font-black bg-linear-to-r from-foreground to-primary bg-clip-text text-transparent">
                    ${plan.price}
                  </div>
                  <p className="text-2xl font-light text-muted-foreground">
                    per {plan.period}
                  </p>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0 pb-8">
                {/* Features List */}
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3 group-hover:text-foreground transition-colors">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                      <span className="text-sm leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                {/* CTA Button */}
                <Button 
                  asChild 
                  size="lg" 
                  className={`
                    w-full h-14 text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:-translate-y-1
                    ${plan.popular ? 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-primary/25' : ''}
                  `}
                >
                  <Link href={plan.href}>{plan.cta}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Features Comparison */}
      <div className="container mx-auto px-6 mb-24">
        <div className="bg-linear-to-r from-muted/50 to-background/50 rounded-3xl p-12">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black bg-linear-to-r from-foreground to-primary bg-clip-text text-transparent mb-4">
                Everything you need to know
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Compare features across all plans and find the perfect fit for your workflow.
              </p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-border">
                    <th></th>
                    {pricingPlans.map((plan) => (
                      <th key={plan.name} className="text-center py-6">
                        <div className="font-black text-lg">{plan.name}</div>
                        {plan.popular && (
                          <Star className="h-5 w-5 text-yellow-500 mx-auto mt-1 fill-current" />
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {[
                    { feature: "Images per month", free: "10", pro: "∞", studio: "∞" },
                    { feature: "Max resolution", free: "512x512", pro: "1024x1024", studio: "2048x2048" },
                    { feature: "No watermark", free: "✗", pro: "✓", studio: "✓" },
                    { feature: "Priority generation", free: "✗", pro: "✓", studio: "✓" },
                    { feature: "Private gallery", free: "✗", pro: "✓", studio: "✓" },
                    { feature: "API access", free: "✗", pro: "✗", studio: "✓" },
                    { feature: "Team collaboration", free: "✗", pro: "✗", studio: "✓" },
                    { feature: "Priority support", free: "Community", pro: "Email", studio: "24/7" }
                  ].map((row, idx) => (
                    <tr key={idx} className="h-16">
                      <td className="font-semibold text-muted-foreground pr-8 py-4">
                        {row.feature}
                      </td>
                      {Object.entries(row).map(([plan, value]) => (
                        plan !== 'feature' && (
                          <td key={plan} className="text-center py-4 font-medium">
                            {value === '✓' ? (
                              <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                            ) : value === '✗' ? (
                              <span className="text-muted-foreground">—</span>
                            ) : value === '✓✓' ? (
                              <div className="flex gap-1 mx-auto">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              </div>
                            ) : (
                              value
                            )}
                          </td>
                        )
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-black mb-6">Still have questions?</h2>
          <p className="text-xl text-muted-foreground mb-12">
            Everything you need to get started is just a click away.
          </p>
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="flex flex-col items-center p-8 bg-background rounded-2xl shadow-lg hover:shadow-xl transition-all">
              <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                <CreditCard className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4">No credit card needed</h3>
              <p className="text-muted-foreground text-center max-w-md">
                Start with our Free plan instantly. Upgrade anytime when you&apos;re ready.
              </p>
            </div>
            <div className="flex flex-col items-center p-8 bg-background rounded-2xl shadow-lg hover:shadow-xl transition-all">
              <div className="w-20 h-20 bg-destructive/10 rounded-2xl flex items-center justify-center mb-6">
                <Zap className="h-10 w-10 text-destructive" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Cancel anytime</h3>
              <p className="text-muted-foreground text-center max-w-md">
                Monthly billing with no long-term commitments. Scale up or down as needed.
              </p>
            </div>
          </div>
          
          <Button size="lg" asChild className="text-lg px-12 h-14 shadow-2xl">
            <Link href="/docs">View Documentation →</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
