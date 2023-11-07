/** @type {import('next').NextConfig} */

const isDevelopment = process.env.NODE_ENV !== 'production'

const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  images: {
    unoptimized: true,
  },
  assetPrefix: isDevelopment ? '' : '/touch-position/',
  basePath: isDevelopment ? '' : '/touch-position',
}

module.exports = nextConfig
