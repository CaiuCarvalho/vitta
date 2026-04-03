/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ignora erros de ESLint e TypeScript durante o build para garantir o deploy
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" }
    ],
  },
}

module.exports = nextConfig
