"use client"

import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"

export function HeroSection() {
  const handleDownload = () => {
    window.open("https://flows.app/download", "_blank")
  }

  return (
    <section className="relative pt-32 pb-20 px-6 lg:px-8 overflow-hidden">
      {/* Purple gradient glow background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary text-sm">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-secondary-foreground">New: Desktop Workspace Management</span>
          </div>

          <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight text-balance">
            Switch Workspaces at the{" "}
            <span className="bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
              Speed of Thought
            </span>
          </h1>

          <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-pretty">
            The desktop app that captures your entire workspace—apps, window positions, URLs, and documents—and restores
            it with one click. Transform chaos into organized productivity.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-foreground text-background hover:bg-foreground/90 text-base"
              onClick={handleDownload}
            >
              Download for Mac
            </Button>
          </div>
        </div>

        <div className="mt-16 max-w-5xl mx-auto">
          <div className="relative w-full aspect-video rounded-2xl shadow-2xl overflow-hidden bg-black">
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src="https://www.youtube.com/embed/TURwxPoOe8w?start=1&rel=0&modestbranding=1"
              title="Flows Demo"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
