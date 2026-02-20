/** @type {import('next').NextConfig} */
const nextConfig = {
    // Disable static optimization for all pages.
    // This is needed because /assessment and /results use localStorage
    // which is not available during server-side rendering.
    // Without this, Vercel's static pre-rendering causes a client-side exception.
    staticPageGenerationTimeout: 1000,
};

module.exports = nextConfig;
