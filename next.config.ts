import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const nextConfig: NextConfig = {
  // Fix workspace root detection issue (prevents Next.js from using wrong parent directory)
  outputFileTracingRoot: __dirname,
  // pdfmake uses pdfkit internally; externalize to avoid bundler issues.
  // @react-pdf/* kept for legacy components (not used in active PDF export).
  serverExternalPackages: [
    'pdfmake',
    '@react-pdf/renderer',
    '@react-pdf/reconciler',
    '@react-pdf/layout',
    '@react-pdf/render',
    '@react-pdf/pdfkit',
    '@react-pdf/font',
    '@react-pdf/primitives',
    '@react-pdf/fns',
  ],
  // Performance optimizations
  poweredByHeader: false,
  compress: true,
  // Image optimization
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
      {
        protocol: "https",
        hostname: "images.clerk.dev",
      },
    ],
  },
  // API configuration for file uploads
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
};

export default nextConfig;
