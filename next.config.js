/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  serverExternalPackages: ['@prisma/client', 'prisma'],
  images: {
    unoptimized: true,
  },
  reactStrictMode: false,
  output: 'standalone',
  env: {
    NEXT_PUBLIC_API_URL: 'https://mispri24.vercel.app/api',
  },
}

module.exports = nextConfig