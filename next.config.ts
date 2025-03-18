/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Ensure we're using only the Pages Router
  experimental: {
    appDir: false,
  }
};

module.exports = nextConfig;