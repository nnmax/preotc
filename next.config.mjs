/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.externals.push('pino-pretty', 'lokijs', 'encoding')
    return config
  },
  redirects: () => {
    return [
      {
        source: '/',
        destination: '/market',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
