/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001',
        pathname: '/uploads/**',
      },
    ],
    domains: ['lh3.googleusercontent.com'], // Añade aquí todos los dominios necesarios
  },
};

export default nextConfig;
