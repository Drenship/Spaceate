/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: process.env.NODE_ENV === 'production',
  },
  images: {
    domains: [
      'firebasestorage.googleapis.com',
      
      // delete after
      'rb.gy', 'pbs.twimg.com',
      'acadienouvelle-6143.kxcdn.com', 
      'images8.alphacoders.com',
      'a0.muscache.com'
    ],
  },
  env: {
    stripe_public_key: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    
    NEXT_FIREBASE_APIKEY: process.env.NEXT_FIREBASE_APIKEY,
    NEXT_FIREBASE_AUTHDOMAIN: process.env.NEXT_FIREBASE_AUTHDOMAIN,
    NEXT_FIREBASE_PROJECTID: process.env.NEXT_FIREBASE_PROJECTID,
    NEXT_FIREBASE_STORAGEBUCKET: process.env.NEXT_FIREBASE_STORAGEBUCKET,
    NEXT_FIREBASE_MESSAGINGSENDERID: process.env.NEXT_FIREBASE_MESSAGINGSENDERID,
    NEXT_FIREBASE_APPID: process.env.NEXT_FIREBASE_APPID,
    MEASUREMENTID: process.env.MEASUREMENTID,

    WEBSITE_EMAIL: process.env.WEBSITE_EMAIL,
  }
}
