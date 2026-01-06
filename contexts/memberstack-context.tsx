"use client"

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { getMemberstack } from '@/lib/memberstack';

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
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  purchasePlan: (priceId: string) => Promise<void>;
  addFreePlan: (planId: string) => Promise<void>;
  hasPlan: (priceId: string) => boolean;
  launchBillingPortal: () => Promise<void>;
}

const MemberstackContext = createContext<MemberstackContextType | undefined>(undefined);

export function MemberstackProvider({ children }: { children: React.ReactNode }) {
  const [member, setMember] = useState<Member | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize and listen for auth changes
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') {
      setIsLoading(false);
      return;
    }

    // Get initial member state
    const initializeAuth = async () => {
      try {
        const ms = await getMemberstack();
        const result = await ms.getCurrentMember();
        setMember(result.data || null);
        setError(null);
      } catch (err: any) {
        // User not logged in - this is expected
        setMember(null);
        setError(null);
      } finally {
        setIsLoading(false);
      }
    };

    let unsubscribe: (() => void) | null = null;

    // Initialize and set up auth listener
    const setupAuth = async () => {
      const ms = await getMemberstack();
      
      // Listen for auth state changes
      unsubscribe = ms.onAuthChange((member, error) => {
        console.log('=== onAuthChange callback triggered ===');
        console.log('Member data received:', member);
        console.log('Error (if any):', error);
        console.log('Member data.data:', member?.data);
        const memberData = member?.data || null;
        console.log('Setting member state to:', memberData);
        setMember(memberData);
        setError(null);
        setIsLoading(false);
        
        // If we got a member, also manually refresh to ensure state is correct
        if (memberData) {
          setTimeout(async () => {
            try {
              const refreshed = await ms.getCurrentMember();
              if (refreshed.data) {
                console.log('Refreshed member after auth change:', refreshed.data);
                setMember(refreshed.data);
              }
            } catch (err) {
              console.log('Refresh after auth change failed:', err);
            }
          }, 500);
        }
      });

      // Get initial state
      await initializeAuth();
    };

    setupAuth();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const login = useCallback(async () => {
    if (typeof window === 'undefined') return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const ms = await getMemberstack();
      // Open login modal with Google auth option
      await ms.openModal({ 
        type: 'LOGIN' 
      });
      
      // The modal will handle the login, and onAuthChange will update the state
    } catch (err: any) {
      setError(err.message || 'Failed to open login modal');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loginWithGoogle = useCallback(async () => {
    if (typeof window === 'undefined') {
      console.log('loginWithGoogle: window is undefined, returning early');
      return;
    }
    
    console.log('loginWithGoogle: Starting login process');
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('loginWithGoogle: Getting memberstack instance');
      const ms = await getMemberstack();
      console.log('loginWithGoogle: Memberstack instance obtained', ms);
      
      // Try lowercase first (as per index.json), then uppercase
      try {
        console.log('loginWithGoogle: Attempting login with lowercase "google"');
        await ms.loginWithProvider({
          provider: 'google',
          allowSignup: true // Allow new users to sign up
        });
        console.log('loginWithGoogle: Login with lowercase provider initiated');
        // Success is handled by onAuthChange callback
        // But let's also manually check after a short delay to ensure state updates
        // Check multiple times to catch the auth state change
        const checkInterval = setInterval(async () => {
          try {
            const currentMember = await ms.getCurrentMember();
            if (currentMember.data) {
              console.log('Manual member check after login - found member:', currentMember.data);
              setMember(currentMember.data);
              setIsLoading(false);
              clearInterval(checkInterval);
            }
          } catch (err) {
            console.log('Manual member check failed:', err);
          }
        }, 1000);
        
        // Stop checking after 10 seconds
        setTimeout(() => {
          clearInterval(checkInterval);
          setIsLoading(false);
        }, 10000);
        
        // Don't set loading to false here - let onAuthChange handle it
        return;
      } catch (lowercaseErr: any) {
        console.log('loginWithGoogle: Lowercase failed, error:', lowercaseErr);
        // If lowercase fails, try uppercase
        if (lowercaseErr.message?.includes('No auth provider') || lowercaseErr.message?.includes('provider')) {
          console.log('loginWithGoogle: Trying uppercase "GOOGLE"');
          await ms.loginWithProvider({
            provider: 'GOOGLE',
            allowSignup: true
          });
          console.log('loginWithGoogle: Login with uppercase provider initiated');
          // Also manually check after a short delay
          const checkInterval = setInterval(async () => {
            try {
              const currentMember = await ms.getCurrentMember();
              if (currentMember.data) {
                console.log('Manual member check after login (uppercase) - found member:', currentMember.data);
                setMember(currentMember.data);
                setIsLoading(false);
                clearInterval(checkInterval);
              }
            } catch (err) {
              console.log('Manual member check failed:', err);
            }
          }, 1000);
          
          // Stop checking after 10 seconds
          setTimeout(() => {
            clearInterval(checkInterval);
            setIsLoading(false);
          }, 10000);
          return;
        }
        throw lowercaseErr;
      }
    } catch (err: any) {
      console.error('loginWithGoogle: Error caught:', err);
      // If Google provider is not configured, fall back to login modal
      if (err.message?.includes('No auth provider') || err.message?.includes('provider')) {
        console.warn('Google OAuth not configured, falling back to login modal');
        try {
          const ms = await getMemberstack();
          await ms.openModal({ 
            type: 'LOGIN' 
          });
          return;
        } catch (modalErr: any) {
          setError('Please configure Google OAuth in your Memberstack dashboard, or use the login modal.');
          console.error('Login modal error:', modalErr);
        }
      } else {
        setError(err.message || 'Failed to login. Please check if popups are blocked.');
        console.error('Login error:', err);
      }
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    if (typeof window === 'undefined') return;
    
    try {
      setIsLoading(true);
      const ms = await getMemberstack();
      await ms.logout();
      setMember(null);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to logout');
      console.error('Logout error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const purchasePlan = useCallback(async (priceId: string) => {
    console.log('purchasePlan: Called with priceId:', priceId);
    if (typeof window === 'undefined') {
      console.log('purchasePlan: window is undefined, returning early');
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);

      console.log('purchasePlan: Getting memberstack instance');
      const ms = await getMemberstack();
      console.log('purchasePlan: Memberstack instance obtained');

      // Check if member is logged in
      console.log('purchasePlan: Checking current member');
      const currentMember = await ms.getCurrentMember();
      console.log('purchasePlan: Current member:', currentMember);
      
      if (!currentMember.data) {
        console.log('purchasePlan: No member found, initiating login');
        // If not logged in, try Google login first, fallback to modal
        try {
          try {
            console.log('purchasePlan: Trying lowercase google login');
            await ms.loginWithProvider({
              provider: 'google',
              allowSignup: true
            });
            console.log('purchasePlan: Lowercase login initiated');
          } catch {
            console.log('purchasePlan: Lowercase failed, trying uppercase');
            await ms.loginWithProvider({
              provider: 'GOOGLE',
              allowSignup: true
            });
            console.log('purchasePlan: Uppercase login initiated');
          }
        } catch (err: any) {
          console.log('purchasePlan: Login failed, error:', err);
          // If Google provider is not configured, use login modal
          if (err.message?.includes('No auth provider') || err.message?.includes('provider')) {
            console.log('purchasePlan: Opening signup modal');
            await ms.openModal({ 
              type: 'SIGNUP',
              plans: [{ planId }]
            });
          }
        }
        // After login, user will need to click the plan again
        // The onAuthChange callback will update the member state
        setIsLoading(false);
        return;
      }

      console.log('purchasePlan: Member is logged in, creating checkout session');
      // Create checkout session
      await ms.purchasePlansWithCheckout({
        priceId: priceId,
        successUrl: `${window.location.origin}/success`,
        cancelUrl: `${window.location.origin}/cancel`,
        metadataForCheckout: {
          source: 'pricing_page',
          timestamp: new Date().toISOString()
        }
      });
      console.log('purchasePlan: Checkout session created, should redirect to Stripe');

      // Will auto-redirect to Stripe checkout
    } catch (err: any) {
      setError(err.message || 'Failed to start checkout');
      console.error('Purchase error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addFreePlan = useCallback(async (planId: string) => {
    if (typeof window === 'undefined') return;
    
    try {
      setIsLoading(true);
      setError(null);

      const ms = await getMemberstack();

      // Check if member is logged in
      const currentMember = await ms.getCurrentMember();
      if (!currentMember.data) {
        // If not logged in, try Google login first, fallback to modal
        try {
          try {
            await ms.loginWithProvider({
              provider: 'google',
              allowSignup: true
            });
          } catch {
            await ms.loginWithProvider({
              provider: 'GOOGLE',
              allowSignup: true
            });
          }
        } catch (err: any) {
          // If Google provider is not configured, use login modal
          if (err.message?.includes('No auth provider') || err.message?.includes('provider')) {
            await ms.openModal({ 
              type: 'SIGNUP',
              plans: [{ planId }]
            });
          }
        }
        // After login, user will need to click the plan again
        // The onAuthChange callback will update the member state
        setIsLoading(false);
        return;
      }

      // Add free plan
      await ms.addPlan({ planId });
      
      // Refresh member data
      const result = await ms.getCurrentMember();
      setMember(result.data || null);
    } catch (err: any) {
      setError(err.message || 'Failed to add plan');
      console.error('Add plan error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const hasPlan = useCallback((priceId: string) => {
    if (!member?.planConnections) return false;
    
    return member.planConnections.some(
      (planConnection) =>
        planConnection.payment?.priceId === priceId &&
        planConnection.status === 'ACTIVE'
    );
  }, [member]);

  const launchBillingPortal = useCallback(async () => {
    if (typeof window === 'undefined') return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const ms = await getMemberstack();
      
      // Check if member has active subscriptions
      const currentMember = await ms.getCurrentMember();
      if (!currentMember.data || !currentMember.data.planConnections?.length) {
        setError('No active subscriptions to manage');
        setIsLoading(false);
        return;
      }
      
      // Launch customer portal
      await ms.launchStripeCustomerPortal({
        returnUrl: window.location.href
      });
      
      // Will auto-redirect to Stripe portal
    } catch (err: any) {
      setError(err.message || 'Failed to open billing portal');
      console.error('Billing portal error:', err);
      setIsLoading(false);
      throw err;
    }
  }, []);

  return (
    <MemberstackContext.Provider
      value={{
        member,
        isLoading,
        error,
        login,
        loginWithGoogle,
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
  const context = useContext(MemberstackContext);
  if (context === undefined) {
    throw new Error('useMemberstack must be used within a MemberstackProvider');
  }
  return context;
}



