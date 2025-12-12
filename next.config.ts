import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cache Components disabled due to incompatibility with:
  // - revalidate route config (we have custom revalidation times)
  // - dynamic = 'force-dynamic' (needed for auth pages)
  // - cookies() usage in prerendered routes
  // 
  // To enable Cache Components in the future:
  // 1. Remove all `export const revalidate` from pages
  // 2. Remove all `export const dynamic` from pages  
  // 3. Use Suspense boundaries for all dynamic data
  // 4. Move auth checks to middleware or client-side only
  // cacheComponents: true,
};

// Bundle analyzer - run with: ANALYZE=true pnpm build
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

export default withBundleAnalyzer(nextConfig);
