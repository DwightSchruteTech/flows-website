"use client"

import { useRouter } from "next/navigation"
import { XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Navigation } from "@/components/navigation"

export default function CancelPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-6">
            <XCircle className="w-16 h-16 text-destructive mx-auto" />
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold mb-4">Payment Cancelled</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Your payment was cancelled. No charges were made to your account.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-foreground text-background hover:bg-foreground/90"
              onClick={() => router.push('/#pricing')}
            >
              Try Again
            </Button>
            <Button 
              size="lg"
              variant="outline"
              onClick={() => router.push('/')}
            >
              Return to Home
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}

