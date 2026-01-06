// Initialize Memberstack with your public key
// In production, use environment variable: process.env.NEXT_PUBLIC_MEMBERSTACK_PUBLIC_KEY
const MEMBERSTACK_PUBLIC_KEY = process.env.NEXT_PUBLIC_MEMBERSTACK_PUBLIC_KEY || 'pk_sb_921e54f1773946f5da41';

// Initialize Memberstack only on the client side to avoid SSR issues
let ms: any = null;
let memberstackModule: any = null;

export const getMemberstack = async () => {
  // Only initialize on the client side
  if (typeof window === 'undefined') {
    // Return a mock object during SSR that will throw if methods are called
    return {
      getCurrentMember: () => Promise.reject(new Error('Memberstack not initialized on server')),
      onAuthChange: () => () => {},
      loginWithProvider: () => Promise.reject(new Error('Memberstack not initialized on server')),
      logout: () => Promise.reject(new Error('Memberstack not initialized on server')),
      purchasePlansWithCheckout: () => Promise.reject(new Error('Memberstack not initialized on server')),
      addPlan: () => Promise.reject(new Error('Memberstack not initialized on server')),
      openModal: () => Promise.reject(new Error('Memberstack not initialized on server')),
    } as any;
  }

  // Dynamically import memberstack only on client side
  if (!memberstackModule) {
    memberstackModule = await import('@memberstack/dom');
  }

  // Initialize on first call in browser
  if (!ms) {
    try {
      ms = memberstackModule.default.init({
        publicKey: MEMBERSTACK_PUBLIC_KEY,
        useCookies: true, // Enable cookie-based authentication
      });
      console.log('Memberstack initialized successfully');
    } catch (initError) {
      console.error('Memberstack initialization error:', initError);
      throw initError;
    }
  }

  return ms;
};

// Plan price IDs from your Memberstack dashboard (for paid plans)
export const PLAN_PRICE_IDS = {
  PRO_MONTHLY: 'prc_pro-monthly-lqr107dp',
  PRO_YEARLY: 'prc_pro-yearly-q5ro0ba7',
} as const;

// Plan IDs (for free plans that don't have a price)
// You may need to update this with your actual free plan ID from Memberstack dashboard
export const PLAN_IDS = {
  FREE: 'pln_free-bdr20742', // Update this with your actual free plan ID
} as const;

// Export getMemberstack as default for backward compatibility
export default getMemberstack;



