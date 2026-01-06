import type React from "react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface FloatingCardProps {
  icon: React.ReactNode
  title: string
  value: string
  iconColor?: string
}

export function FloatingCard({ icon, title, value, iconColor = "text-primary" }: FloatingCardProps) {
  return (
    <Card className="bg-card/80 backdrop-blur-md border-border/50 shadow-xl p-4 min-w-[160px]">
      <div className="flex items-start gap-3">
        <div className={cn("p-2 rounded-lg bg-secondary", iconColor)}>{icon}</div>
        <div className="flex-1">
          <p className="text-xs text-muted-foreground mb-1">{title}</p>
          <p className="text-lg font-semibold text-foreground">{value}</p>
        </div>
      </div>
    </Card>
  )
}
