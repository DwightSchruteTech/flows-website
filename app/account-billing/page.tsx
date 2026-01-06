"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { useMemberstack } from "@/contexts/memberstack-context"

export default function AccountBillingPage() {
  const router = useRouter()
  const { launchBillingPortal, isLoading, error } = useMemberstack()

  useEffect(() => {
    const openPortal = async () => {
      try {
        await launchBillingPortal()
      } catch {
        // error is already handled in context
      }
    }

    openPortal()
  }, [launchBillingPortal])

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl lg:text-4xl font-bold mb-4">Manage Billing</h1>
          <p className="text-muted-foreground mb-8">
            We&apos;re opening your secure Stripe billing portal where you can update payment
            methods, view invoices, and manage your subscription.
          </p>

          {isLoading && (
            <div className="flex items-center justify-center gap-3 mb-6">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm text-muted-foreground">Opening billing portal...</span>
            </div>
          )}

          {error && (
            <p className="text-sm text-destructive mb-6 max-w-md mx-auto">
              {error}
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" onClick={() => router.push("/")}>
              Back to Home
            </Button>
            <Button onClick={() => launchBillingPortal()} disabled={isLoading}>
              Retry Billing Portal
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}


