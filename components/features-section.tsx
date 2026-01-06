import { Card } from "@/components/ui/card"
import { Crosshair, Brain, Zap } from "lucide-react"

export function FeaturesSection() {
  const features = [
    {
      icon: <Crosshair className="w-6 h-6" />,
      title: "Pixel-Perfect Restoration",
      description:
        "Every window returns exactly where you left it. No guessing, no manual adjustments—just perfect placement every time.",
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: "Content Aware",
      description:
        "Automatically re-opens browser tabs (Chrome/Safari) and specific documents. Your exact workflow, instantly restored.",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Context Switching",
      description:
        "Move from 'Deep Work' to 'Communication' mode in seconds. Switch between complete workspace setups with one click.",
    },
  ]

  return (
    <section id="features" className="py-24 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-balance">
            Powerful features for{" "}
            <span className="bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
              power users
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Everything you need to manage complex workflows and switch contexts instantly.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="p-8 bg-card hover:shadow-lg transition-shadow duration-300 border-border">
              <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3 text-card-foreground">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
