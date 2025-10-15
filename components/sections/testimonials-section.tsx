import { Card } from "@/components/ui/card"
import { Star, Quote } from "lucide-react"

import { Gallery4, type Gallery4Item } from "@/components/ui/gallery4"

export function TestimonialsSection() {
  const testimonials = [
    {
      name: "Rajesh Kumar",
      role: "Dairy Farmer",
      location: "Sonipat, Haryana",
      content:
        "PashuSuchak AI has transformed how I manage my 25 cattle. The breed identification is incredibly accurate, and the heat detection has improved my breeding success rate by 40%.",
      rating: 5,
      avatar: "/indian-farmer-portrait.png",
    },
    {
      name: "Dr. Priya Sharma",
      role: "Field Livestock Worker",
      location: "Anand, Gujarat",
      content:
        "As an FLW covering 15 villages, this app has made my job so much easier. I can quickly identify breeds and provide better guidance to farmers. The offline feature is a game-changer.",
      rating: 5,
      avatar: "/indian-veterinarian-woman-portrait.jpg",
    },
    {
      name: "Suresh Patel",
      role: "Progressive Farmer",
      location: "Mehsana, Gujarat",
      content:
        "The AI predictions are remarkably accurate. I've been able to optimize my breeding program and increase milk production. The dashboard analytics help me make data-driven decisions.",
      rating: 5,
      avatar: "/indian-farmer-with-cattle-portrait.jpg",
    },
  ]

  const impactStats = [
    { value: "40%", label: "Increase in breeding success" },
    { value: "60%", label: "Reduction in identification time" },
    { value: "25%", label: "Improvement in milk yield" },
    { value: "89%", label: "Farmer satisfaction rate" },
  ]

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Trusted by Farmers Across India</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Real stories from farmers and livestock workers who are transforming their operations with PashuSuchak AI
          </p>
        </div>

        {/* Testimonials carousel (uses same data) */}
        <div className="mb-16">
          {
            (() => {
              const items: Gallery4Item[] = testimonials.map((t) => ({
                id: t.name,
                title: `${t.name} — ${t.role}`,
                description: t.content,
                href: "#",
                image: t.avatar || "/placeholder.svg",
              }))
              return (
                <Gallery4
                  title="Success Stories"
                  description="Real stories from farmers and FLWs using PashuSuchak AI"
                  items={items}
                />
              )
            })()
          }
        </div>

        {/* Impact statistics */}
        <div className="bg-muted/30 rounded-2xl p-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-foreground mb-2">Measurable Impact on Livestock Management</h3>
            <p className="text-muted-foreground">Data from over 28,000 registered farmers across India</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {impactStats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.value}</div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
