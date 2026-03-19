const path = require("node:path");

/** @type {import('next').NextConfig} */
const isStaticExport = process.env.NEXT_OUTPUT_EXPORT === 'true';

const nextConfig = {
  output: isStaticExport ? 'export' : undefined,
  basePath: isStaticExport ? '/optimitron' : '',
  outputFileTracingRoot: path.resolve(__dirname, "../.."),
  images: {
    unoptimized: true,
  },
  eslint: {
    // Skip ESLint during builds — run separately via `pnpm lint`
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Type checking is done via `pnpm typecheck`
    ignoreBuildErrors: true,
  },
  webpack: (config) => {
    // MetaMask SDK bundles React Native code that references this package.
    // It's not needed in web builds — alias to false so webpack provides an empty module.
    config.resolve.fallback = {
      ...config.resolve.fallback,
      "@react-native-async-storage/async-storage": false,
    };
    return config;
  },
};

module.exports = nextConfig;
