"use client"

import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useMemberstack } from "@/contexts/memberstack-context"
import { PLAN_PRICE_IDS, PLAN_IDS } from "@/lib/memberstack"
import { useState } from "react"

export function PricingSection() {
  const { addFreePlan, purchasePlan, isLoading, member } = useMemberstack()
  const [processingPlan, setProcessingPlan] = useState<string | null>(null)

  const handleFreePlan = async () => {
    try {
      setProcessingPlan('free')
      await addFreePlan(PLAN_IDS.FREE)
    } catch (error) {
      console.error('Error adding free plan:', error)
    } finally {
      setProcessingPlan(null)
    }
  }

  const handleMonthlyTrial = async () => {
    try {
      setProcessingPlan('monthly')
      await purchasePlan(PLAN_PRICE_IDS.PRO_MONTHLY)
    } catch (error) {
      console.error('Error purchasing monthly plan:', error)
      setProcessingPlan(null)
    }
  }

  const handleYearlyTrial = async () => {
    try {
      setProcessingPlan('yearly')
      await purchasePlan(PLAN_PRICE_IDS.PRO_YEARLY)
    } catch (error) {
      console.error('Error purchasing yearly plan:', error)
      setProcessingPlan(null)
    }
  }

  return (
    <section id="pricing" className="py-20 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Choose Your Plan</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Start with a free flow. Upgrade anytime for unlimited workspace management.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Free Plan Card */}
          <div className="bg-card rounded-2xl p-8 shadow-lg border border-border">
            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-2">Free</h3>
              <div className="mb-4">
                <span className="text-5xl font-bold">$0</span>
              </div>
              <p className="text-muted-foreground">Get started with basics</p>
            </div>

            <ul className="space-y-4 mb-8 min-h-[240px]">
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span>1 Flow included</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                <span className="text-muted-foreground">Basic window restoration</span>
              </li>
            </ul>

            <Button 
              size="lg" 
              variant="outline" 
              className="w-full text-lg py-6 bg-transparent" 
              onClick={handleFreePlan}
              disabled={isLoading || processingPlan === 'free'}
            >
              {processingPlan === 'free' ? 'Processing...' : 'Get Started'}
            </Button>
          </div>

          {/* Monthly Pro Plan Card - Highlighted */}
          <div className="relative bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl p-8 shadow-2xl border-2 border-primary">
            {/* Popular badge */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1.5 rounded-full text-sm font-semibold shadow-lg">
              Most Popular
            </div>

            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-2">Pro Monthly</h3>
              <div className="mb-4">
                <span className="text-5xl font-bold">$3.99</span>
                <span className="text-muted-foreground ml-2">/month</span>
              </div>
              <p className="text-muted-foreground">Everything you need to stay organized</p>
            </div>

            <ul className="space-y-4 mb-8 min-h-[240px]">
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="font-medium">Unlimited Saved Flows</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="font-medium">Global Keyboard Shortcuts (⌘R, ⌘C)</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="font-medium">Browser URL & Multi-tab Restoration</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="font-medium">Document & File Tracking</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="font-medium">Custom Icons & Color-coding</span>
              </li>
            </ul>

            <Button
              size="lg"
              className="w-full bg-foreground text-background hover:bg-foreground/90 text-lg py-6"
              onClick={handleMonthlyTrial}
              disabled={isLoading || processingPlan === 'monthly'}
            >
              {processingPlan === 'monthly' ? 'Processing...' : 'Start 7-Day Free Trial'}
            </Button>
          </div>

          {/* Yearly Pro Plan Card */}
          <div className="bg-card rounded-2xl p-8 shadow-lg border border-border">
            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-2">Pro Yearly</h3>
              <div className="mb-4">
                <span className="text-5xl font-bold">$29.99</span>
                <span className="text-muted-foreground ml-2">/year</span>
                <div className="inline-block ml-3 bg-green-500 text-white px-2 py-1 rounded-md text-xs font-semibold">
                  Save 40%
                </div>
              </div>
              <p className="text-muted-foreground">Best value for long-term users</p>
            </div>

            <ul className="space-y-4 mb-8 min-h-[240px]">
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="font-medium">Unlimited Saved Flows</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="font-medium">Global Keyboard Shortcuts (⌘R, ⌘C)</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="font-medium">Browser URL & Multi-tab Restoration</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="font-medium">Document & File Tracking</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="font-medium">Custom Icons & Color-coding</span>
              </li>
            </ul>

            <Button 
              size="lg" 
              className="w-full text-lg py-6" 
              onClick={handleYearlyTrial}
              disabled={isLoading || processingPlan === 'yearly'}
            >
              {processingPlan === 'yearly' ? 'Processing...' : 'Start 7-Day Free Trial'}
            </Button>
          </div>
        </div>

        {/* Trust badges */}
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            Trusted by developers, designers, and power users everywhere
          </p>
          <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground">
            <span>30-day money-back guarantee</span>
            <span>•</span>
            <span>Secure payment</span>
            <span>•</span>
            <span>Instant access</span>
          </div>
        </div>
      </div>
    </section>
  )
}
