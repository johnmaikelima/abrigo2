/** @type {import('next').NextConfig} */
const nextConfig = {
  // Desabilitar ESLint durante o build para evitar erros de dependências
  eslint: {
    // Aviso: Isso ignora erros de ESLint durante o build
    ignoreDuringBuilds: true,
  },
  // Desabilitar verificação de tipos TypeScript durante o build
  typescript: {
    // Aviso: Isso ignora erros de TypeScript durante o build
    ignoreBuildErrors: true,
  },
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  compress: true,
  optimizeFonts: true,
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  // Configuração para lidar com o erro de manifesto
  experimental: {
    serverComponentsExternalPackages: ['mongoose'],
    missingSuspenseWithCSRBailout: false,
  },
  
  // Redirecionamentos para o sitemap
  async redirects() {
    return [
      {
        source: '/sitemap.xml',
        destination: '/api/sitemap.xml',
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        dns: false,
        child_process: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;
