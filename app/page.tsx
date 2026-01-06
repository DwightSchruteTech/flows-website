'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { FeaturesSection } from "@/components/features-section"
import { ReviewsSection } from "@/components/reviews-section"
import { PricingSection } from "@/components/pricing-section"

export default function Home() {
  const searchParams = useSearchParams();
  
  useEffect(() => {
    // Check for token in URL (from app)
    const token = searchParams.get('token');
    if (token) {
      // Sync session with token
      fetch('/api/auth/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            console.log('✅ Session synced from app');
            // Remove token from URL
            window.history.replaceState({}, '', window.location.pathname);
            // Reload to refresh auth state
            window.location.reload();
          }
        })
        .catch(err => {
          console.error('Failed to sync session:', err);
        });
    }
  }, [searchParams]);

  const initialPlan = typeof searchParams?.get('plan') === "string" ? searchParams.get('plan') : undefined
  const autoCheckout = searchParams?.get('checkout') === "1"

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <HeroSection />
        <FeaturesSection />
        <PricingSection initialPlan={initialPlan} autoCheckout={autoCheckout} />
        <ReviewsSection />
      </main>
    </div>
  )
}
