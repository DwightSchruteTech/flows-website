"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import initMemberstack from '@/lib/memberstack';

interface Member {
  id: string;
  auth: {
    email: string;
  };
  planConnections?: Array<{
    id: string;
    planId: string;
    status: string;
    payment?: {
      priceId: string;
    };
  }>;
  [key: string]: any;
}

interface MemberstackContextType {
  member: Member | null;
  isLoading: boolean;
  error: string | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  purchasePlan: (priceId: string) => Promise<void>;
  addFreePlan: (planId: string) => Promise<void>;
  hasPlan: (priceId: string) => boolean;
  launchBillingPortal: () => Promise<void>;
}

const MemberstackContext = createContext<MemberstackContextType | undefined>(
  undefined
);

export function MemberstackProvider({ children }: { children: React.ReactNode }) {
  const [member, setMember] = useState<Member | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize and listen for auth changes
  useEffect(() => {
    if (typeof window === 'undefined') {
      setIsLoading(false);
      return;
    }

    let unsubscribe: (() => void) | null = null;

    const setupAuth = async () => {
      const ms = await initMemberstack();
      if (!ms) {
        setIsLoading(false);
        return;
      }

      const initializeAuth = async () => {
        try {
          console.log('Memberstack context: Initializing auth...');
          const result = await ms.getCurrentMember();
          console.log('Memberstack context: getCurrentMember result:', result);
          setMember(result.data || null);
          setError(null);
        } catch (err) {
          console.log('Memberstack context: No member found (expected if not logged in):', err);
          setMember(null);
          setError(null);
        } finally {
          setIsLoading(false);
          console.log('Memberstack context: Initialization complete');
        }
      };

      unsubscribe = ms.onAuthChange((res: any) => {
        const nextMember = res?.data || null;
        setMember(nextMember);
        setError(null);
        setIsLoading(false);
      });

      await initializeAuth();
    };

    setupAuth();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const login = useCallback(async () => {
    console.log('=== CONTEXT: login() called ===');
    if (typeof window === 'undefined') {
      console.log('Window undefined, returning');
      return;
    }
    try {
      console.log('Getting memberstack instance...');
      const ms = await initMemberstack();
      if (!ms) {
        console.error('Memberstack instance is null!');
        return;
      }
      console.log('Memberstack instance obtained, opening modal...');
      setIsLoading(true);
      setError(null);
      // Open Memberstack's login modal (configure Google button in the dashboard)
      // Some Memberstack versions expect a string argument instead of an options object
      // Use the string form to avoid type.toLowerCase errors
      await ms.openModal('LOGIN');
      console.log('Login modal opened successfully');
    } catch (err: any) {
      console.error('Login error in context:', err);
      setError(err.message || 'Failed to open login modal');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    if (typeof window === 'undefined') return;
    const ms = await initMemberstack();
    if (!ms) return;

    try {
      setIsLoading(true);
      setError(null);
      await ms.logout();
      setMember(null);
    } catch (err: any) {
      setError(err.message || 'Failed to logout');
      console.error('Logout error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const purchasePlan = useCallback(async (priceId: string) => {
    console.log('=== CONTEXT: purchasePlan() called with priceId:', priceId);
    if (typeof window === 'undefined') {
      console.log('Window undefined, returning');
      return;
    }
    try {
      console.log('Getting memberstack instance...');
      const ms = await initMemberstack();
      if (!ms) {
        console.error('Memberstack instance is null!');
        return;
      }
      setIsLoading(true);
      setError(null);

      console.log('Checking current member...');
      const current = await ms.getCurrentMember();
      console.log('Current member:', current);
      if (!current.data) {
        console.log('No member found, opening login modal...');
        // Not logged in → open login modal (with Google) then let them click again
        await ms.openModal({ type: 'LOGIN' });
        setIsLoading(false);
        return;
      }

      console.log('Member found, creating checkout session...');
      await ms.purchasePlansWithCheckout({
        priceId,
        successUrl: `${window.location.origin}/success`,
        cancelUrl: `${window.location.origin}/cancel`,
      });
      console.log('Checkout session created, redirecting to Stripe...');
      // Stripe handles redirect
    } catch (err: any) {
      console.error('Purchase error in context:', err);
      setError(err.message || 'Failed to start checkout');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addFreePlan = useCallback(async (planId: string) => {
    if (typeof window === 'undefined') return;
    const ms = await initMemberstack();
    if (!ms) return;

    try {
      setIsLoading(true);
      setError(null);

      const current = await ms.getCurrentMember();
      if (!current.data) {
        // Not logged in → open signup modal
        // Use string form to avoid type.toLowerCase errors and keep behaviour simple
        await ms.openModal('SIGNUP');
        setIsLoading(false);
        return;
      }

      await ms.addPlan({ planId });

      const refreshed = await ms.getCurrentMember();
      setMember(refreshed.data || null);
    } catch (err: any) {
      setError(err.message || 'Failed to add plan');
      console.error('Add plan error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const hasPlan = useCallback(
    (priceId: string) => {
      if (!member?.planConnections) return false;
      return member.planConnections.some(
        (pc) => pc.payment?.priceId === priceId && pc.status === 'ACTIVE'
      );
    },
    [member]
  );

  const launchBillingPortal = useCallback(async () => {
    if (typeof window === 'undefined') return;
    const ms = await initMemberstack();
    if (!ms) return;

    try {
      setIsLoading(true);
      setError(null);

      const current = await ms.getCurrentMember();
      if (!current.data || !current.data.planConnections?.length) {
        setError('No active subscriptions to manage');
        setIsLoading(false);
        return;
      }

      await ms.launchStripeCustomerPortal({
        returnUrl: window.location.href,
      });
    } catch (err: any) {
      setError(err.message || 'Failed to open billing portal');
      console.error('Billing portal error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <MemberstackContext.Provider
      value={{
        member,
        isLoading,
        error,
        login,
        logout,
        purchasePlan,
        addFreePlan,
        hasPlan,
        launchBillingPortal,
      }}
    >
      {children}
    </MemberstackContext.Provider>
  );
}

export function useMemberstack() {
  const ctx = useContext(MemberstackContext);
  if (!ctx) {
    throw new Error('useMemberstack must be used within a MemberstackProvider');
  }
  return ctx;
}
