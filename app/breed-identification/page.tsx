import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { BreedIdentificationInterface } from "@/components/breed-identification/breed-identification-interface"

export default function BreedIdentificationPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">AI Breed Identification</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Upload an image of your cattle or buffalo to get instant breed identification with confidence scores
            </p>
          </div>
          <BreedIdentificationInterface />
        </div>
      </main>
      <Footer />
    </div>
  )
}
