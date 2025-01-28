const { fa } = require('@faker-js/faker');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'utfs.io',
        port: ''
      },
      {
        protocol: 'https',
        hostname: 'api.slingacademy.com',
        port: ''
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '3333'
      },
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
        hostname: 'img.freepik.com',
        port: ''
      },
      {
        protocol: 'https',
        hostname: 'www.albaik.com',
        port: ''
      }
    ]
  },
  transpilePackages: ['geist'],
};

module.exports = nextConfig;
