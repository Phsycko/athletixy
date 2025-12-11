/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: { workerThreads: false, cpus: 1 },
  reactStrictMode: false,
  distDir: ".next",
  generateEtags: false,
  onDemandEntries: { maxInactiveAge: 0, pagesBufferLength: 0 },
  webpack: (config) => {
    return config;
  },
  async headers() {
    return [
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
          {
            key: 'Service-Worker-Allowed',
            value: '/',
          },
        ],
      },
      {
        source: '/manifest.json',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/manifest+json',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig

