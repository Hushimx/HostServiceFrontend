const { fa } = require('@faker-js/faker');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [

      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        port: ''
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: ''
      },    {
        protocol: 'https',
        hostname: 'cdn-icons-png.flaticon.com',
        port: ''
      },


      {
        protocol: 'https',
        hostname: Process.env.NEXT_PUBLIC_API_URL,
        port: ''
      }
    ]
  },
  transpilePackages: ['geist'],
};

module.exports = nextConfig;
