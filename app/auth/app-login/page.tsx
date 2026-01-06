'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import initMemberstack from '@/lib/memberstack';

function AppLoginContent() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || 'flows://auth/callback';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAuth = async () => {
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const ms = await initMemberstack();
      if (!ms) {
        throw new Error('Failed to initialize Memberstack');
      }

      let result;
      if (isSignUp) {
        result = await ms.signupMemberEmailPassword({
          email,
          password,
          plans: [{ planId: 'pln_free-xgrp0bsv' }],
        });
      } else {
        result = await ms.loginMemberEmailPassword({ email, password });
      }

      if (result.data?.member) {
        // Create token for app
        const token = Buffer.from(`${result.data.member.id}:${Date.now()}`).toString('base64');
        const appUrl = `${redirect}?token=${encodeURIComponent(token)}`;
        
        // Redirect to app
        setTimeout(() => {
          window.location.href = appUrl;
        }, 500);
      } else {
        setError('Authentication failed');
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">
            {isSignUp ? 'Create Account' : 'Sign In'}
          </h1>
          <p className="text-muted-foreground">
            {isSignUp ? 'Create your Flows account' : 'Sign in to your Flows account'}
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-md bg-background"
              placeholder="you@example.com"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-md bg-background"
              placeholder="Enter your password"
              disabled={isLoading}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleAuth();
                }
              }}
            />
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-md text-red-500 text-sm">
              {error}
            </div>
          )}

          <button
            onClick={handleAuth}
            disabled={isLoading || !email || !password}
            className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-md font-medium disabled:opacity-50"
          >
            {isLoading ? 'Processing...' : isSignUp ? 'Create Account' : 'Sign In'}
          </button>

          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError(null);
            }}
            className="w-full text-sm text-muted-foreground hover:text-foreground"
          >
            {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AppLoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground mt-4">Loading...</p>
        </div>
      </div>
    }>
      <AppLoginContent />
    </Suspense>
  );
}

