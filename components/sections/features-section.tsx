import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Camera, Video, Wifi, MessageSquare, BarChart3, Shield, ArrowRight, CheckCircle } from "lucide-react"
import Link from "next/link"
import { GlowCard } from "@/components/ui/spotlight-card"

export function FeaturesSection() {
  const features = [
    {
      icon: <Camera className="w-8 h-8" />,
      title: "AI Breed Identification",
      description: "Instantly identify cattle and buffalo breeds with 89%+ accuracy using advanced computer vision.",
      benefits: ["15+ Indian breeds supported", "Real-time predictions", "Confidence scoring"],
      href: "/breed-identification",
      color: "text-blue-500",
    },
    {
      icon: <Video className="w-8 h-8" />,
      title: "Heat Detection",
      description: "Automated estrus detection through behavioral analysis and physical sign recognition.",
      benefits: ["Video & image analysis", "Alert notifications", "Breeding optimization"],
      href: "/heat-detection",
      color: "text-red-500",
    },
    {
      icon: <Wifi className="w-8 h-8" />,
      title: "Offline-First Design",
      description: "Works seamlessly in rural areas with limited connectivity. Sync when online.",
      benefits: ["No internet required", "Local data storage", "Auto-sync capability"],
      href: "/features/offline",
      color: "text-green-500",
    },
    {
      icon: <MessageSquare className="w-8 h-8" />,
      title: "Feedback Loop",
      description: "Continuous learning system that improves accuracy through farmer feedback.",
      benefits: ["Model improvement", "Community validation", "Expert verification"],
      href: "/feedback",
      color: "text-purple-500",
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Analytics Dashboard",
      description: "Comprehensive insights for farmers, FLWs, and administrators with detailed metrics.",
      benefits: ["Performance tracking", "Trend analysis", "Export capabilities"],
      href: "/dashboard",
      color: "text-orange-500",
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Data Security",
      description: "Enterprise-grade security with local data processing and privacy protection.",
      benefits: ["GDPR compliant", "Local processing", "Encrypted storage"],
      href: "/security",
      color: "text-teal-500",
    },
  ]

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Powerful Features for Modern Farming</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Comprehensive AI-powered tools designed specifically for Indian livestock management needs
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div key={feature.title} className="relative">
              <div className="absolute inset-0 -z-0">
                {/* spotlight border following cursor */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
              </div>
              <Card className="p-0 overflow-hidden">
                <div className="p-6 hover:shadow-lg transition-all duration-300 group">
                  <div className="space-y-4">
                    {/* Icon and title */}
                    <div className="flex items-start space-x-4">
                      <div className={`${feature.color} flex-shrink-0`}>{feature.icon}</div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-muted-foreground">{feature.description}</p>

                    {/* Benefits */}
                    <ul className="space-y-2">
                      {feature.benefits.map((benefit) => (
                        <li key={benefit} className="flex items-center text-sm text-muted-foreground">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                          {benefit}
                        </li>
                      ))}
                    </ul>

                    {/* CTA */}
                    <Button variant="ghost" className="w-full group-hover:bg-muted/50 transition-colors" asChild>
                      <Link href={feature.href}>
                        Learn More
                        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </Card>
              <div className="pointer-events-none absolute inset-0 -z-10 rounded-2xl">
                {/** Spotlight overlay renders behind card while preserving original styles */}
                <GlowCard customSize className="h-full w-full rounded-2xl" />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="bg-muted/30 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-foreground mb-4">Ready to Transform Your Livestock Management?</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Join thousands of farmers already using BreedScan AI to improve their livestock productivity
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/register">
                  Get Started Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/contact">Contact Sales</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
