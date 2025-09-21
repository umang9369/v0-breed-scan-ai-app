import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { HeatDetectionInterface } from "@/components/heat-detection/heat-detection-interface"

export default function HeatDetectionPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">AI Heat Detection</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Analyze images or short videos for visual and behavioral heat indicators. Receive timely alerts to schedule insemination at the optimal time.
            </p>
          </div>
          <HeatDetectionInterface />
        </div>
      </main>
      <Footer />
    </div>
  )
}
