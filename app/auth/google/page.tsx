'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import initMemberstack from '@/lib/memberstack';

function GoogleAuthContent() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || 'flows://auth/callback';
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Initializing Google sign-in...');

  useEffect(() => {
    const handleGoogleAuth = async () => {
      try {
        const ms = await initMemberstack();
        if (!ms) {
          throw new Error('Failed to initialize Memberstack');
        }

        setMessage('Signing in with Google...');

        // Try signupWithProvider first (handles both signup and login with allowLogin: true)
        try {
          await ms.signupWithProvider({
            provider: 'GOOGLE',
            allowLogin: true, // Allow login if account exists
            plans: [{ planId: 'pln_free-xgrp0bsv' }], // Add free plan for new users
          });
        } catch (signupError: any) {
          // If signupWithProvider fails, try loginWithProvider as fallback
          console.log('signupWithProvider failed, trying loginWithProvider...', signupError);
          try {
            await ms.loginWithProvider({
              provider: 'GOOGLE',
              allowSignup: true,
            });
          } catch (loginError: any) {
            throw new Error('Google OAuth is not configured in your Memberstack dashboard. Please enable Google OAuth in Settings → Authentication.');
          }
        }

        const unsubscribe = ms.onAuthChange(async (member) => {
          if (member?.data) {
            setStatus('success');
            setMessage('Authentication successful! Redirecting to app...');

            // Get token from Memberstack session
            try {
              // Create a token for the app (memberId:timestamp)
              const token = Buffer.from(`${member.data.id}:${Date.now()}`).toString('base64');
              
              // Redirect to app with token
              const appUrl = `${redirect}?token=${encodeURIComponent(token)}`;
              console.log('Redirecting to app:', appUrl);
              
              setTimeout(() => {
                window.location.href = appUrl;
              }, 1000);
            } catch (error) {
              console.error('Error creating token:', error);
              // Fallback: redirect with memberId
              setTimeout(() => {
                window.location.href = `${redirect}?memberId=${encodeURIComponent(member.data.id || '')}`;
              }, 1000);
            }

            unsubscribe();
          }
        });

        const timeout = setTimeout(() => {
          if (status === 'loading') {
            setStatus('error');
            setMessage('Authentication timed out. Please try again.');
            unsubscribe();
          }
        }, 30000);

        return () => {
          clearTimeout(timeout);
          unsubscribe();
        };
      } catch (error: any) {
        console.error('Google auth error:', error);
        setStatus('error');
        setMessage(error.message || 'Failed to sign in with Google. Please check your Memberstack Google OAuth configuration in the dashboard.');
      }
    };

    handleGoogleAuth();
  }, [redirect, status]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4 max-w-md mx-auto px-4">
        {status === 'loading' && (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">{message}</p>
          </>
        )}
        {status === 'success' && (
          <>
            <div className="text-green-500 text-4xl mb-4">✓</div>
            <p className="text-foreground font-medium">{message}</p>
          </>
        )}
        {status === 'error' && (
          <>
            <div className="text-red-500 text-4xl mb-4">✗</div>
            <p className="text-foreground font-medium">{message}</p>
            <div className="mt-4 space-y-2">
              <p className="text-sm text-muted-foreground">
                To enable Google OAuth:
              </p>
              <ol className="text-sm text-muted-foreground text-left list-decimal list-inside space-y-1 max-w-md mx-auto">
                <li>Go to your Memberstack Dashboard</li>
                <li>Navigate to Settings → Authentication</li>
                <li>Enable Google OAuth provider</li>
                <li>Configure your Google OAuth credentials</li>
              </ol>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md"
              >
                Try Again
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function GoogleAuthPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground mt-4">Loading...</p>
        </div>
      </div>
    }>
      <GoogleAuthContent />
    </Suspense>
  );
}
