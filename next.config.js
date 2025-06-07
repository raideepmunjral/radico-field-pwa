/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath: '/radico-field-pwa',
  assetPrefix: '/radico-field-pwa',
  images: {
    unoptimized: true
  },
  distDir: 'out',
  env: {
    NEXT_PUBLIC_GOOGLE_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
    NEXT_PUBLIC_MASTER_SHEET_ID: '1pRz9CgOoamTrfpnmF-XuBCg9IZON9br5avgRlKYtxM',
    NEXT_PUBLIC_VISIT_SHEET_ID: '1XG4c_Lrpk-YglTq3G3ZY9Qjt7wSnUq0UZWDSYT61eWE',
    NEXT_PUBLIC_HISTORICAL_SHEET_ID: '1yXzEYHJeHlETrEmU4TZ9F2_qv4OE10N4DPdYX0Iqfx0',
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuild: false,
  }
}

module.exports = nextConfig
