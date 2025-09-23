import { Card } from "@/components/ui/card"
import { Camera, Brain, CheckCircle, TrendingUp } from "lucide-react"

export function ProcessSection() {
  const steps = [
    {
      step: "01",
      icon: <Camera className="w-8 h-8" />,
      title: "Capture",
      description: "Take a photo or video of your livestock using any smartphone or tablet",
      color: "text-blue-500",
    },
    {
      step: "02",
      icon: <Brain className="w-8 h-8" />,
      title: "AI Analysis",
      description: "Our advanced AI models analyze the image for breed identification or heat detection",
      color: "text-purple-500",
    },
    {
      step: "03",
      icon: <CheckCircle className="w-8 h-8" />,
      title: "Get Results",
      description: "Receive instant predictions with confidence scores and actionable insights",
      color: "text-green-500",
    },
    {
      step: "04",
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Track Progress",
      description: "Monitor your livestock health and breeding patterns through comprehensive analytics",
      color: "text-orange-500",
    },
  ]

  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">How PashuSuchak AI Works</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Simple 4-step process to revolutionize your livestock management
          </p>
        </div>

        {/* Process steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={step.step} className="relative">
              {/* Connection line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-border z-0">
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-primary rounded-full" />
                </div>
              )}

              <Card className="p-6 text-center relative z-10 hover:shadow-lg transition-shadow">
                {/* Step number */}
                <div className="text-sm font-bold text-primary mb-4">STEP {step.step}</div>

                {/* Icon */}
                <div className={`${step.color} mb-4 flex justify-center`}>{step.icon}</div>

                {/* Title */}
                <h3 className="text-xl font-semibold text-foreground mb-3">{step.title}</h3>

                {/* Description */}
                <p className="text-muted-foreground text-sm">{step.description}</p>
              </Card>
            </div>
          ))}
        </div>

        {/* Implementation graphic placeholder */}
        <div className="mt-16">
          <Card className="p-8 bg-gradient-to-r from-primary/5 to-secondary/5">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-foreground mb-4">Seamless Integration with Existing Workflows</h3>
              <p className="text-muted-foreground mb-6 max-w-3xl mx-auto">
                PashuSuchak AI integrates smoothly with current livestock management practices, requiring minimal training
                and providing immediate value to farmers and field workers.
              </p>
              <div className="bg-background rounded-lg p-6 max-w-4xl mx-auto">
                <img
                  src="/workflow-diagram-showing-farmer-using-smartphone-t.jpg"
                  alt="PashuSuchak AI workflow diagram"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-auto rounded-lg"
                />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}
