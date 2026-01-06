'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import initMemberstack from '@/lib/memberstack';

export default function GoogleAuthPage() {
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

        await ms.loginWithProvider({
          provider: 'GOOGLE',
          allowSignup: true,
        });

        const unsubscribe = ms.onAuthChange(async (member) => {
          if (member?.data) {
            setStatus('success');
            setMessage('Authentication successful! Redirecting to app...');

            try {
              const response = await fetch('/api/auth/me', {
                credentials: 'include',
              });

              if (response.ok) {
                const data = await response.json();
                const appUrl = `${redirect}?memberId=${encodeURIComponent(member.data.id || '')}`;
                setTimeout(() => {
                  window.location.href = appUrl;
                }, 1000);
              } else {
                setTimeout(() => {
                  window.location.href = `${redirect}?memberId=${encodeURIComponent(member.data.id || '')}`;
                }, 1000);
              }
            } catch (error) {
              console.error('Error getting token:', error);
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
        setMessage(error.message || 'Failed to sign in with Google. Please try again.');
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
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md"
            >
              Try Again
            </button>
          </>
        )}
      </div>
    </div>
  );
}

