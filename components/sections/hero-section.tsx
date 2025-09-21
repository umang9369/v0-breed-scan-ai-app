import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Play, Zap } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with cattle image */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-background/90 via-background/70 to-background/90 z-10" />
        <img src="/indian-cattle-and-buffalo-in-rural-farm-setting.jpg" alt="Livestock in rural setting" className="w-full h-full object-cover" />
      </div>

      {/* Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
            <Zap className="w-4 h-4 text-primary mr-2" />
            <span className="text-sm font-medium text-primary">AI-Powered Livestock Intelligence</span>
          </div>

          {/* Main heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 text-balance">
            Intelligent <span className="text-primary">Livestock</span> Management
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto text-balance">
            Empowering farmers with AI-driven breed identification and heat detection technology for improved
            productivity and livestock health.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button size="lg" className="text-lg px-8 py-6" asChild>
              <Link href="/breed-identification">
                Start Scanning
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6 bg-transparent" asChild>
              <Link href="/demo">
                <Play className="mr-2 w-5 h-5" />
                Watch Demo
              </Link>
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="text-sm text-muted-foreground">
            <p className="mb-4">Trusted by farmers across India • Developed with ICAR & NDDB</p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              <span>ICAR Partnership</span>
              <span>•</span>
              <span>NDDB Collaboration</span>
              <span>•</span>
              <span>IEEE Research</span>
              <span>•</span>
              <span>Made in India</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-muted-foreground/30 rounded-full mt-2 animate-bounce" />
        </div>
      </div>
    </section>
  )
}
