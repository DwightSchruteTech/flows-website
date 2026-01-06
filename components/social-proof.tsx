export function SocialProof() {
  const logos = [
    { name: "TechCorp", width: 120 },
    { name: "Innovate", width: 100 },
    { name: "Digital Solutions", width: 140 },
    { name: "Creative Studio", width: 110 },
    { name: "MediaHub", width: 90 },
    { name: "StreamCo", width: 100 },
  ]

  return (
    <section className="py-16 px-6 lg:px-8 border-t border-border">
      <div className="max-w-7xl mx-auto">
        <p className="text-center text-sm text-muted-foreground mb-8">Trusted by leading brands worldwide</p>
        <div className="flex items-center justify-center gap-12 flex-wrap opacity-60">
          {logos.map((logo, index) => (
            <div
              key={index}
              className="h-8 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300"
              style={{ width: logo.width }}
            >
              <img
                src={`/placeholder-icon.png?height=32&width=${logo.width}&query=${logo.name} logo`}
                alt={logo.name}
                className="w-full h-full object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
