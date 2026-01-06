"use client"

import { useRouter } from "next/navigation"
import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Navigation } from "@/components/navigation"

export default function SuccessPage() {
  const router = useRouter()

  const handleDownload = () => {
    // Same download URL used in the hero section
    window.open("https://flows.app/download", "_blank")
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-6">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold mb-4">You&apos;re all set!</h1>
          <p className="text-lg text-muted-foreground mb-6">
            Your Flows subscription is active. Download the app and start restoring your perfect workspace
            in one click.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-4">
            <Button
              size="lg"
              className="bg-foreground text-background hover:bg-foreground/90"
              onClick={handleDownload}
            >
              Download Flows for Mac
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => router.push("/")}
            >
              Return to Home
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Having trouble? You can always download from the homepage or your confirmation email.
          </p>
        </div>
      </main>
    </div>
  )
}

