"use client"

import { Navigation } from "@/components/navigation"
import { useMemberstack } from "@/contexts/memberstack-context"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function AccountPage() {
  const { member } = useMemberstack()
  const router = useRouter()

  const activePlans =
    member?.planConnections?.filter((pc) => pc.status === "ACTIVE") || []

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl lg:text-4xl font-bold mb-4">Your Account</h1>
          <p className="text-muted-foreground mb-8">
            View your profile details and subscription status for Flows.
          </p>

          <div className="rounded-xl border border-border bg-card p-6 mb-8 space-y-4">
            <div>
              <h2 className="text-xl font-semibold mb-1">Profile</h2>
              <p className="text-sm text-muted-foreground mb-1">Email</p>
              <p className="text-sm font-medium">
                {member?.auth?.email || "Not logged in"}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">Subscription</p>
              {activePlans.length ? (
                <p className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 text-emerald-500 px-3 py-1 text-xs font-medium">
                  Active subscriber
                </p>
              ) : (
                <p className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-xs font-medium">
                  Free plan
                </p>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 mb-8">
            <h2 className="text-xl font-semibold mb-2">Subscription &amp; Billing</h2>
            <p className="text-sm text-muted-foreground mb-4">
              To update your payment method, download invoices, or change plans, use
              the billing portal.
            </p>
            <Button onClick={() => router.push("/account-billing")}>
              Open Billing Portal
            </Button>
          </div>

          <Button variant="outline" onClick={() => router.push("/")}>
            Back to Home
          </Button>
        </div>
      </main>
    </div>
  )
}

{
  "cells": [],
  "metadata": {
    "language_info": {
      "name": "python"
    }
  },
  "nbformat": 4,
  "nbformat_minor": 2
}