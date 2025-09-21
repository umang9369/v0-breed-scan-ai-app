import { Card } from "@/components/ui/card"
import { Star, Quote } from "lucide-react"

export function TestimonialsSection() {
  const testimonials = [
    {
      name: "Rajesh Kumar",
      role: "Dairy Farmer",
      location: "Sonipat, Haryana",
      content:
        "BreedScan AI has transformed how I manage my 25 cattle. The breed identification is incredibly accurate, and the heat detection has improved my breeding success rate by 40%.",
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
            Real stories from farmers and livestock workers who are transforming their operations with BreedScan AI
          </p>
        </div>

        {/* Testimonials grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.name} className="p-6 hover:shadow-lg transition-shadow">
              <div className="space-y-4">
                {/* Quote icon */}
                <Quote className="w-8 h-8 text-primary/30" />

                {/* Rating */}
                <div className="flex space-x-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                {/* Content */}
                <p className="text-muted-foreground italic">"{testimonial.content}"</p>

                {/* Author */}
                <div className="flex items-center space-x-3 pt-4 border-t border-border">
                  <img
                    src={testimonial.avatar || "/placeholder.svg"}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role} • {testimonial.location}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
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
