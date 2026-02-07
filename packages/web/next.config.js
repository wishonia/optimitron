/** @type {import('next').NextConfig} */
const isGitHubPages = process.env.GITHUB_ACTIONS === 'true';

const nextConfig = {
  output: 'export',
  basePath: isGitHubPages ? '/optomitron' : '',
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
};

module.exports = nextConfig;
