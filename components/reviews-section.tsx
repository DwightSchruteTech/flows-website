"use client"

import { Star } from "lucide-react"

const reviews = [
  {
    name: "Sarah Chen",
    role: "Product Designer",
    avatar: "/professional-woman.png",
    rating: 5,
    text: "Flows has completely transformed how I manage my browser tabs. The global shortcuts are a game-changer for my workflow.",
  },
  {
    name: "Michael Rodriguez",
    role: "Software Engineer",
    avatar: "/man-developer.png",
    rating: 5,
    text: "Finally, a way to organize my 50+ tabs without losing my mind. The color-coding and custom icons make everything so intuitive.",
  },
  {
    name: "Emily Thompson",
    role: "Marketing Manager",
    avatar: "/business-woman.png",
    rating: 5,
    text: "I love being able to restore my exact workspace with one click. It saves me at least 30 minutes every morning.",
  },
  {
    name: "David Park",
    role: "Freelance Writer",
    avatar: "/creative-man.png",
    rating: 5,
    text: "The 7-day trial convinced me immediately. Flows is worth every penny for the productivity boost alone.",
  },
  {
    name: "Jessica Liu",
    role: "UX Researcher",
    avatar: "/woman-researcher-microscope.png",
    rating: 5,
    text: "Beautifully designed and incredibly functional. This is how browser tab management should work.",
  },
  {
    name: "Alex Turner",
    role: "Data Analyst",
    avatar: "/man-analyst.jpg",
    rating: 5,
    text: "The document tracking feature is perfect for research projects. No more losing important tabs in the chaos.",
  },
]

export function ReviewsSection() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md-text-5xl font-bold mb-4 text-balance">Loved by many users</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
            Join the community of productive people who have transformed their workflow with Flows.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 hover:border-primary/50 transition-colors"
            >
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              <p className="text-foreground mb-6 leading-relaxed">{review.text}</p>

              <div className="flex items-center gap-3">
                <img src={review.avatar || "/placeholder.svg"} alt={review.name} className="w-10 h-10 rounded-full" />
                <div>
                  <p className="font-semibold text-sm">{review.name}</p>
                  <p className="text-xs text-muted-foreground">{review.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
