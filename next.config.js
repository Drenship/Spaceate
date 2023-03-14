/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: process.env.NODE_ENV === 'production',
  },
  images: {
    domains: [
      'rb.gy', 'pbs.twimg.com',


      'acadienouvelle-6143.kxcdn.com'
    ],
  },
  env: {
    stripe_public_key: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  }
}
