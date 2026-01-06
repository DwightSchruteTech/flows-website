// Use env var in production; keep your existing sandbox key as local fallback
const PUBLIC_KEY = process.env.NEXT_PUBLIC_MEMBERSTACK_PUBLIC_KEY || 'pk_sb_921e54f1773946f5da41';

let memberstack: any = null;
let memberstackModule: any = null;

export const initMemberstack = async () => {
  // Only run in the browser
  if (typeof window === 'undefined') return null;

  // Dynamically import to avoid SSR issues
  if (!memberstackModule) {
    memberstackModule = await import('@memberstack/dom');
  }

  if (!memberstack) {
    memberstack = memberstackModule.default.init({
      publicKey: PUBLIC_KEY,
      useCookies: true,
    });
  }

  return memberstack;
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

export default initMemberstack;
