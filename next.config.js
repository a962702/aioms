// @ts-check

/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = {
  output: 'export',
  basePath: '/aioms',
  experimental: {
    appDir: true,
  },
}

module.exports = nextConfig
