import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Footerdemo } from "@/components/ui/footer-section"

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">UI Demo</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Footer component demo with shadcn primitives and subtle animation.</p>
          </div>
          <Footerdemo />
        </div>
      </main>
      <Footer />
    </div>
  )
}
