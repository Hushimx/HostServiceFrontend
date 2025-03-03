const { fa } = require('@faker-js/faker');

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true, // Ignore TypeScript errors during build
  },
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
        protocol: 'http',
        hostname: "127.0.0.1",
        port: '3333'
      }
    ]
  },
  transpilePackages: ['geist'],
};

module.exports = nextConfig;
